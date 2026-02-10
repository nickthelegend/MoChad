
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userAddress, matchId, botId, amount } = body;

        if (!userAddress || !matchId || !botId || !amount) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Find User
        const user = await prisma.user.findUnique({ where: { walletAddress: userAddress } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance < amount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Create Bet
        const bet = await prisma.bet.create({
            data: {
                userId: user.id,
                matchId,
                prediction: botId,
                amount: parseFloat(amount),
                status: 'PENDING'
            }
        });

        // Deduct Balance
        await prisma.user.update({
            where: { id: user.id },
            data: { balance: { decrement: parseFloat(amount) } }
        });

        return NextResponse.json({ success: true, bet });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
