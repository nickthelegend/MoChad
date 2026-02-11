import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, prompt, strategy, model, ownerId } = req.body;

  if (!name || !prompt || !ownerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. Create Bot
  const { data: bot, error: botError } = await supabaseAdmin
    .from('Bot')
    .insert({
      name,
      prompt,
      strategy,
      model,
      ownerId
    })
    .select()
    .single();

  if (botError) {
    return res.status(500).json({ error: botError.message });
  }

  return res.status(201).json({ message: 'Bot registered successfully', bot });
}
