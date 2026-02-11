
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { simulateMatch } from '@/lib/gameEngine';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { matchId } = body;

        if (!matchId) {
            return NextResponse.json({ error: 'Match ID is required' }, { status: 400 });
        }

        // 1. Fetch Match Details
        const { data: match, error: matchError } = await supabaseAdmin
            .from('Match')
            .select(`
                *,
                botA:Bot!botAId(*),
                botB:Bot!botBId(*)
            `)
            .eq('id', matchId)
            .single();

        if (matchError || !match) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 });
        }

        if (match.status === 'FINISHED') {
            return NextResponse.json({ error: 'Match already finished' }, { status: 400 });
        }

        // 2. Simulate Match
        const result = await simulateMatch(match.botA, match.botB);

        // 3. Determine Winner ID
        let winnerId = null;
        if (result.winner === 'A') winnerId = match.botAId;
        else if (result.winner === 'B') winnerId = match.botBId;

        // 4. Update Match in DB
        const { error: updateError } = await supabaseAdmin
            .from('Match')
            .update({
                status: 'FINISHED',
                winnerId,
                resultData: {
                    moveA: result.moveA,
                    moveB: result.moveB,
                    log: result.log
                }
            })
            .eq('id', matchId);

        if (updateError) throw updateError;

        // 5. Update Bot Stats
        if (winnerId) {
            const loserId = winnerId === match.botAId ? match.botBId : match.botAId;

            // Update Winner Stats
            const { data: winnerBot } = await supabaseAdmin.from('Bot').select('wins').eq('id', winnerId).single();
            if (winnerBot) {
                await supabaseAdmin.from('Bot').update({ wins: (winnerBot.wins || 0) + 1 }).eq('id', winnerId);
            }

            // Update Loser Stats
            const { data: loserBot } = await supabaseAdmin.from('Bot').select('losses').eq('id', loserId).single();
            if (loserBot) {
                await supabaseAdmin.from('Bot').update({ losses: (loserBot.losses || 0) + 1 }).eq('id', loserId);
            }
        }

        // 6. Trigger Settlement (Plan 2.3)
        const { settleBets } = await import('@/lib/settlement');
        await settleBets(matchId, winnerId);

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Error executing match:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
