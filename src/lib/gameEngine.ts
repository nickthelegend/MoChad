
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

export async function simulateMatch(botA: any, botB: any): Promise<GameResult> {
    // In a real scenario, we would call the bot's API/LLM here.
    // For now, we simulate based on strategy.

    const getMove = (strategy: string | null): Move => {
        // Simple simulation of strategies
        if (strategy === 'aggressive') {
            // Aggressive might prefer Rock (brute force)
            return Math.random() > 0.6 ? 'ROCK' : getRandomMove();
        }
        return getRandomMove();
    };

    const moveA = getMove(botA.strategy);
    const moveB = getMove(botB.strategy);

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
