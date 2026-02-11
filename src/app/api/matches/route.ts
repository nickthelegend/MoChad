
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(req: Request) {
    try {
        const { data: matches, error } = await supabaseAdmin
            .from('Match')
            .select(`
                *,
                botA:Bot!botAId(id, name, ownerId),
                botB:Bot!botBId(id, name, ownerId)
            `)
            .order('scheduledFor', { ascending: true });

        if (error) throw error;
        
        return NextResponse.json({ matches });
    } catch (error: any) {
        console.error('Error fetching matches:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { botAId, botBId, gameType, scheduledFor } = body;

        if (!botAId || !botBId) {
            return NextResponse.json({ error: 'Bot A and Bot B are required' }, { status: 400 });
        }

        const { data: match, error } = await supabaseAdmin
            .from('Match')
            .insert({
                botAId,
                botBId,
                gameType: gameType || 'ROCK_PAPER_SCISSORS',
                scheduledFor: scheduledFor || new Date().toISOString(),
                status: 'SCHEDULED'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, match });
    } catch (error: any) {
        console.error('Error scheduling match:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
