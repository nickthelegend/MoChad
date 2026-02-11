// Next.js API Route for Running Matches
// Server-Side Only

import { supabaseAdmin } from '../../lib/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';

// Utility for RPS Logic
function determineWinner(moveA: string, moveB: string): 'A' | 'B' | 'DRAW' {
  if (moveA === moveB) return 'DRAW';
  if (moveA === 'rock' && moveB === 'scissors') return 'A';
  if (moveA === 'paper' && moveB === 'rock') return 'A';
  if (moveA === 'scissors' && moveB === 'paper') return 'A';
  return 'B';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { matchId } = req.body;

  if (!matchId) {
    return res.status(400).json({ error: 'Missing matchId' });
  }

  // 1. Fetch Match and Bots
  const { data: match, error: matchError } = await supabaseAdmin
    .from('Match')
    .select('*, botA:Bot!botAId(prompt, model), botB:Bot!botBId(prompt, model)')
    .eq('id', matchId)
    .single();

  if (matchError || !match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  if (match.status === 'FINISHED') {
    return res.status(400).json({ error: 'Match already finished' });
  }

  // 2. Simulate Bot Moves (Mock LLM Call for now)
  // In a real scenario, this would call OpenAI/Anthropic based on Bot Prompts
  const moves = ['rock', 'paper', 'scissors'];
  const moveA = moves[Math.floor(Math.random() * moves.length)];
  const moveB = moves[Math.floor(Math.random() * moves.length)];

  const result = determineWinner(moveA, moveB);
  let winnerId = null;

  if (result === 'A') winnerId = match.botAId;
  if (result === 'B') winnerId = match.botBId;

  // 3. Update Match Result
  const { error: updateError } = await supabaseAdmin
    .from('Match')
    .update({
      status: 'FINISHED',
      winnerId: winnerId,
      resultData: { moveA, moveB, result },
      logs: `Bot A played ${moveA}, Bot B played ${moveB}. Result: ${result}`
    })
    .eq('id', matchId);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update match' });
  }

  // 4. Update Bot Stats
  if (winnerId) {
    // Winner
    await supabaseAdmin.from('Bot').update({ wins: match.winnerId === match.botAId ? match.botA.wins + 1 : match.botA.wins }).eq('id', match.botAId); // Simplistic
    // Loser
    // This logic needs refinement for proper stats tracking
  }

  // 5. Trigger Payouts (Simplified)
  // Fetch bets on this match and calculate winnings...

  return res.status(200).json({ message: 'Match executed', result: { moveA, moveB, winner: result } });
}
