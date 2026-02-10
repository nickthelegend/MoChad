"use client";

import { Swords, Zap, Divide, MousePointer2, Skull, Users, Play } from 'lucide-react';

export default function GamesPage() {
    const p2pGames = [
        {
            title: "Rock Paper Scissors",
            icon: <Swords size={48} className="text-primary" />,
            desc: "Pattern detection & randomness. High-frequency betting.",
            tags: ["Instant", "Elo Ranked"]
        },
        {
            title: "Coin Flip Bluff",
            icon: <Zap size={48} className="text-accent" />,
            desc: "Heads or Tails with a twist. Bluff your opponent.",
            tags: ["Psychology", "Double-or-Nothing"]
        },
        {
            title: "Number Duel (1-10)",
            icon: <Divide size={48} className="text-secondary" />,
            desc: "Pick the closest number to the hidden target.",
            tags: ["Simple", "Strategy"]
        },
        {
            title: "Grid Capture (3x3)",
            icon: <MousePointer2 size={48} className="text-success" />,
            desc: "Claim the most territory. Like Tic-Tac-Toe but complex.",
            tags: ["Territory", "Memory"]
        },
        {
            title: "Turn-Based RPG",
            icon: <Skull size={48} className="text-error" />,
            desc: "Attack, Defend, or Charge. Manage your HP.",
            tags: ["Simulation", "RPG"]
        },
        {
            title: "Trust & Betray",
            icon: <Users size={48} className="text-muted" />,
            desc: "Cooperate for rewards or betray for the jackpot.",
            tags: ["Narrative", "Drama"]
        }
    ];

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="glow-text" style={{ fontSize: '3rem' }}>Arcade</h1>
                <p className="text-muted">P2P Games. Pure Skill & Luck.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
                {p2pGames.map((game, idx) => (
                    <div key={idx} className="glass-panel flex flex-col items-center justify-between text-center" style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', border: '4px solid var(--border-color)', minHeight: '220px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            {/* Clone element to adjust size if needed, or manually adjust in data above. 
                    Since icons are in the data array, I'll update the data array instead for cleaner code or just wrap them.
                    Actually, I'll update the data array in a separate edit or just use a wrapper class? 
                    The icons are defined in the array with size={48}. I should update the array.
                */}
                            <div style={{ transform: 'scale(0.8)' }}>
                                {game.icon}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{game.title}</h3>
                            <p className="text-xs text-muted" style={{ lineHeight: 1.2 }}>{game.desc}</p>
                        </div>

                        <button className="btn btn-primary text-xs" style={{ width: '100%', padding: '0.5rem' }}>
                            <Play size={14} /> Play
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
