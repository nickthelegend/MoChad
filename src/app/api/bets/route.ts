
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, matchId, amount, prediction } = body;

        if (!userId || !matchId || !amount || !prediction) {
            return NextResponse.json({ error: 'Missing bet details' }, { status: 400 });
        }

        // 1. Verify User Balance
        const { data: user, error: userError } = await supabaseAdmin
            .from('User')
            .select('balance')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.balance < amount) {
            return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
        }

        // 2. Create Bet
        const { data: bet, error: betError } = await supabaseAdmin
            .from('Bet')
            .insert({
                userId,
                matchId,
                amount,
                prediction,
                status: 'PENDING'
            })
            .select()
            .single();

        if (betError) throw betError;

        // 3. Deduct Balance
        const { error: balanceError } = await supabaseAdmin
            .from('User')
            .update({ balance: user.balance - amount })
            .eq('id', userId);

        if (balanceError) throw balanceError;

        return NextResponse.json({ success: true, bet });
    } catch (error: any) {
        console.error('Error placing bet:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
