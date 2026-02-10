
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, strategy, owner, prompt } = body;

        if (!name || !owner) {
            return NextResponse.json({ error: 'Name and Owner are required' }, { status: 400 });
        }

        // Check if user exists, if not create them (lazy registration)
        let user = await prisma.user.findUnique({ where: { walletAddress: owner } });
        if (!user) {
            user = await prisma.user.create({
                data: { walletAddress: owner } // Balance defaults to 100
            });
        }

        const bot = await prisma.bot.create({
            data: {
                name,
                description,
                strategy,
                prompt: prompt || 'Default Strategy',
                ownerId: user.id
            }
        });

        return NextResponse.json({ success: true, bot });
    } catch (error) {
        console.error('Error registering bot:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const bots = await prisma.bot.findMany({
            include: { owner: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ bots });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
