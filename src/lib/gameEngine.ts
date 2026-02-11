import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export type Move = 'ROCK' | 'PAPER' | 'SCISSORS';

export interface GameResult {
    moveA: Move;
    moveB: Move;
    winner: 'A' | 'B' | 'DRAW';
    log: string[];
}

export const VALID_MOVES: Move[] = ['ROCK', 'PAPER', 'SCISSORS'];

export function getRandomMove(): Move {
    return VALID_MOVES[Math.floor(Math.random() * VALID_MOVES.length)];
}

export function determineWinner(moveA: Move, moveB: Move): 'A' | 'B' | 'DRAW' {
    if (moveA === moveB) return 'DRAW';

    if (
        (moveA === 'ROCK' && moveB === 'SCISSORS') ||
        (moveA === 'PAPER' && moveB === 'ROCK') ||
        (moveA === 'SCISSORS' && moveB === 'PAPER')
    ) {
        return 'A';
    }

    return 'B';
}

async function getBotMove(bot: any, opponent?: any): Promise<Move> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY missing, using random move');
        return getRandomMove();
    }

    try {
        const prompt = `
            You are an AI Gladiator named ${bot.name} competing in a Rock-Paper-Scissors battle.
            Your strategy / personality: ${bot.strategy || 'Aggressive and calculated'}
            Your custom instructions: ${bot.prompt || 'Win at all costs'}
            ${opponent ? `Your opponent is ${opponent.name}.` : ''}

            Respond with ONLY one word: ROCK, PAPER, or SCISSORS.
        `;

        const response = await openai.chat.completions.create({
            model: bot.model || 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const move = response.choices[0].message.content?.toUpperCase().trim() as Move;
        if (VALID_MOVES.includes(move)) return move;

        return getRandomMove();
    } catch (error) {
        console.error(`Error getting move for bot ${bot.name}:`, error);
        return getRandomMove();
    }
}

export async function simulateMatch(botA: any, botB: any): Promise<GameResult> {
    const moveA = await getBotMove(botA, botB);
    const moveB = await getBotMove(botB, botA);

    const winner = determineWinner(moveA, moveB);

    return {
        moveA,
        moveB,
        winner,
        log: [
            `Match Initialized: ${botA.name} vs ${botB.name}`,
            `${botA.name} plays ${moveA}`,
            `${botB.name} plays ${moveB}`,
            winner === 'DRAW' ? 'Result: DRAW' : `Result: ${winner === 'A' ? botA.name : botB.name} Wins!`
        ]
    };
}
