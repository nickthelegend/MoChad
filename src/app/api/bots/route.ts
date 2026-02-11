
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, strategy, owner, prompt } = body;

        if (!name || !owner) {
            return NextResponse.json({ error: 'Name and Owner are required' }, { status: 400 });
        }

        // 1. Get or Create User
        let { data: user, error: userError } = await supabaseAdmin
            .from('User')
            .select('id')
            .eq('walletAddress', owner)
            .single();

        if (userError && userError.code === 'PGRST116') { // Not found
            const { data: newUser, error: createError } = await supabaseAdmin
                .from('User')
                .insert({ walletAddress: owner })
                .select()
                .single();
            
            if (createError) throw createError;
            user = newUser;
        } else if (userError) {
            throw userError;
        }

        // 2. Register Bot
        const { data: bot, error: botError } = await supabaseAdmin
            .from('Bot')
            .insert({
                name,
                description,
                strategy,
                prompt: prompt || 'Default Strategy',
                ownerId: user.id,
                model: 'gpt-4o' // Default model
            })
            .select()
            .single();

        if (botError) throw botError;

        return NextResponse.json({ success: true, bot });
    } catch (error: any) {
        console.error('Error registering bot:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { data: bots, error } = await supabaseAdmin
            .from('Bot')
            .select('*, owner:User(*)')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        
        return NextResponse.json({ bots });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
