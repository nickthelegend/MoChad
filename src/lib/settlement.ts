
import { supabaseAdmin } from './supabaseAdmin';

export async function settleBets(matchId: string, winnerId: string | null) {
    try {
        console.log(`Settling bets for match ${matchId}, winner: ${winnerId}`);

        // 1. Fetch all pending bets for this match
        const { data: bets, error: betsError } = await supabaseAdmin
            .from('Bet')
            .select('*, user:User(*)')
            .eq('matchId', matchId)
            .eq('status', 'PENDING');

        if (betsError) throw betsError;
        if (!bets || bets.length === 0) {
            console.log('No pending bets found for this match.');
            return;
        }

        for (const bet of bets) {
            const isWinner = bet.prediction === winnerId;

            if (isWinner) {
                // Calculate Payout: Fixed 1.9x for now (protocol takes 10% fee)
                const payoutAmount = bet.amount * 1.9;

                // 1. Update Bet Status
                await supabaseAdmin
                    .from('Bet')
                    .update({ status: 'WON', payout: payoutAmount })
                    .eq('id', bet.id);

                // 2. Update User Balance
                const newBalance = (bet.user.balance || 0) + payoutAmount;
                await supabaseAdmin
                    .from('User')
                    .update({ balance: newBalance })
                    .eq('id', bet.userId);

                // 3. Create Transaction Record
                await supabaseAdmin
                    .from('Transaction')
                    .insert({
                        userId: bet.userId,
                        amount: payoutAmount,
                        type: 'BET_WON',
                        description: `Payout for match ${matchId}`,
                        referenceId: bet.id
                    });

                console.log(`Paid out ${payoutAmount} to user ${bet.userId}`);
            } else {
                // Mark as LOST
                await supabaseAdmin
                    .from('Bet')
                    .update({ status: 'LOST', payout: 0 })
                    .eq('id', bet.id);

                console.log(`Bet ${bet.id} marked as LOST`);
            }
        }
    } catch (error) {
        console.error('Error in settleBets:', error);
        throw error;
    }
}
