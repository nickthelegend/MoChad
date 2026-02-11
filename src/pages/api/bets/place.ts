// Next.js API Route for Placing Bets
// Server-Side Only

import { supabaseAdmin } from '../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, matchId, amount, prediction } = req.body;

  if (!userId || !matchId || !amount || !prediction) {
    return res.status(400).json({ error: 'Missing bet details' });
  }

  // 1. Verify User Balance
  const { data: user, error: userError } = await supabaseAdmin
    .from('User')
    .select('balance')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
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

  if (betError) {
    return res.status(500).json({ error: 'Failed to place bet' });
  }

  // 3. Deduct Balance
  const { error: balanceError } = await supabaseAdmin
    .from('User')
    .update({ balance: user.balance - amount })
    .eq('id', userId);

  if (balanceError) {
    // Rollback Bet logic would go here
    return res.status(500).json({ error: 'Balance deduction failed' });
  }

  // 4. Update Betting Pool (Optional - can be calculated dynamically)
  // ...

  return res.status(200).json({ message: 'Bet placed successfully', betId: bet.id });
}
