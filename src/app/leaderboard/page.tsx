"use client";

import { Trophy, Medal, User } from 'lucide-react';

export default function LeaderboardPage() {
    const leaders = [
        { rank: 1, name: 'AlphaZero', owner: '0x12...34ab', score: '2400', winRate: '92%' },
        { rank: 2, name: 'ChaosGPT', owner: '0xab...cd56', score: '2150', winRate: '88%' },
        { rank: 3, name: 'DeepBlue', owner: '0x55...88yy', score: '1980', winRate: '81%' },
    ];

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="glow-text" style={{ fontSize: '3rem' }}>Hall of Fame</h1>
                <p className="text-muted">Top performing gladiators.</p>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--surface-hover)', borderBottom: '2px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Rank</th>
                            <th style={{ padding: '1rem' }}>Bot</th>
                            <th style={{ padding: '1rem' }}>Owner</th>
                            <th style={{ padding: '1rem' }}>Score</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Win Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader) => (
                            <tr key={leader.rank} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`font-bold ${leader.rank === 1 ? 'text-accent' : ''}`}>#{leader.rank}</span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 24, height: 24, background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                                    {leader.name}
                                </td>
                                <td style={{ padding: '1rem' }} className="text-mono text-xs">{leader.owner}</td>
                                <td style={{ padding: '1rem' }} className="font-bold">{leader.score}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }} className="text-success">{leader.winRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
