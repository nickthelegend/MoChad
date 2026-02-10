
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { simulateMatch } from '@/lib/gameEngine';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const matches = await prisma.match.findMany({
            where: status ? { status } : {},
            include: {
                botA: true,
                botB: true
            },
            orderBy: { scheduledFor: 'asc' }
        });

        return NextResponse.json({ matches });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === 'generate') {
            // Find bots
            const bots = await prisma.bot.findMany();
            if (bots.length < 2) return NextResponse.json({ message: 'Not enough bots' });

            // Random pairing
            const shuffled = bots.sort(() => 0.5 - Math.random());
            const matches = [];

            for (let i = 0; i < shuffled.length - 1; i += 2) {
                const match = await prisma.match.create({
                    data: {
                        botAId: shuffled[i].id,
                        botBId: shuffled[i + 1].id,
                        scheduledFor: new Date(Date.now() + 1000 * 60 * 5), // 5 mins from now
                        status: 'SCHEDULED'
                    }
                });
                matches.push(match);
            }

            return NextResponse.json({ message: 'Matches generated', count: matches.length });
        }

        if (action === 'execute') {
            // Find scheduled matches that are due (or just all scheduled for demo)
            const matchesToPlay = await prisma.match.findMany({
                where: { status: 'SCHEDULED' },
                include: { botA: true, botB: true }
            });

            const results = [];

            for (const match of matchesToPlay) {
                // Run simulation
                const gameResult = await simulateMatch(match.botA, match.botB);

                let winnerId = null;
                if (gameResult.winner === 'A') winnerId = match.botAId;
                if (gameResult.winner === 'B') winnerId = match.botBId;

                // Update Match
                await prisma.match.update({
                    where: { id: match.id },
                    data: {
                        status: 'FINISHED',
                        winnerId,
                        resultData: JSON.stringify(gameResult)
                    }
                });

                // Update Bot Stats
                if (winnerId) {
                    await prisma.bot.update({ where: { id: winnerId }, data: { wins: { increment: 1 } } });
                    const loserId = winnerId === match.botAId ? match.botBId : match.botAId;
                    await prisma.bot.update({ where: { id: loserId }, data: { losses: { increment: 1 } } });
                }

                // SETTLE BETS (Simplified)
                if (winnerId) {
                    // Mark winning bets
                    await prisma.bet.updateMany({
                        where: { matchId: match.id, prediction: winnerId },
                        data: { status: 'WON', payout: 2.0 } // 2x payout for simplicity
                    });
                    // Mark losing bets
                    await prisma.bet.updateMany({
                        where: { matchId: match.id, NOT: { prediction: winnerId } },
                        data: { status: 'LOST', payout: 0 }
                    });
                }

                results.push({ matchId: match.id, result: gameResult });
            }

            return NextResponse.json({ message: 'Matches executed', results });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
