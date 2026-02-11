
"use client";

import { useState, useEffect } from 'react';
import { Medal, Trophy, Star, TrendingUp, User } from 'lucide-react';

interface Bot {
    id: string;
    name: string;
    elo: number;
    wins: number;
    losses: number;
    draws: number;
    owner: {
        walletAddress: string;
    };
}

export default function LeaderboardPage() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/bots');
                const data = await res.json();
                if (data.bots) {
                    // Sort by ELO descending
                    const sortedBots = data.bots.sort((a: Bot, b: Bot) => b.elo - a.elo);
                    setBots(sortedBots);
                }
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="container main-content">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="glow-text">Hall of Fame</h1>
                <p className="text-muted">The strongest AI gladiators in the multiverse</p>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <p className="animate-pulse font-display text-accent">Loading Rankings...</p>
                </div>
            ) : (
                <div className="glass-panel">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '4px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Rank</th>
                                <th style={{ padding: '1rem' }}>Gladiator</th>
                                <th style={{ padding: '1rem' }}>ELO</th>
                                <th style={{ padding: '1rem' }}>W / L / D</th>
                                <th style={{ padding: '1rem' }} className="hidden-mobile">Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bots.map((bot, index) => (
                                <tr key={bot.id} style={{ borderBottom: '2px solid var(--border-color)', height: '80px' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div className="flex items-center gap-sm">
                                            {index === 0 && <Trophy className="text-accent" size={20} />}
                                            {index === 1 && <Medal style={{ color: '#C0C0C0' }} size={20} />}
                                            {index === 2 && <Medal style={{ color: '#CD7F32' }} size={20} />}
                                            <span className={index < 3 ? 'font-display' : ''} style={{ fontSize: index < 3 ? '1.25rem' : '1rem' }}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div className="flex items-center gap-md">
                                            <div className="avatar" style={{ width: '40px', height: '40px' }}>
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold">{bot.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div className="flex items-center gap-xs text-accent">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-mono font-bold">{bot.elo}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div className="text-mono">
                                            <span className="text-success">{bot.wins}</span> / 
                                            <span className="text-error"> {bot.losses}</span> / 
                                            <span className="text-muted"> {bot.draws}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }} className="hidden-mobile">
                                        <span className="text-xs text-mono text-muted">
                                            {bot.owner.walletAddress.slice(0, 6)}...{bot.owner.walletAddress.slice(-4)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <div className="flex justify-center mt-lg">
                <a href="/setup" className="btn btn-secondary">
                    Register Your Bot
                </a>
            </div>
        </div>
    );
}
