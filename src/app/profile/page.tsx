"use client";

import { useWallet } from '@/context/WalletContext';
import BotCard from '@/components/BotCard';
import Link from 'next/link';
import { Ghost, Trophy, Wallet } from 'lucide-react';

export default function ProfilePage() {
    const { isConnected, balance, walletAddress, connectWallet } = useWallet();

    const myBots = [
        {
            id: 'b9',
            name: 'MyFirstBot',
            owner: walletAddress || '0xMe',
            wins: 12,
            losses: 5,
            strategy: 'aggressive',
            description: 'Built to rush down opponents.'
        }
    ];

    if (!isConnected) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                    <Wallet size={48} className="text-primary" style={{ margin: '0 auto 1rem auto', color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connect Wallet</h1>
                    <p className="text-muted" style={{ marginBottom: '1.5rem' }}>View your bots and betting history by connecting your wallet.</p>
                    <button onClick={connectWallet} className="btn btn-primary" style={{ width: '100%' }}>Connect Wallet</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            {/* Header Stats */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '250px', height: '250px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.1 }} />

                <div className="flex justify-between items-center flex-wrap gap-lg" style={{ position: 'relative', zIndex: 10 }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Commander Profile</h1>
                        <p className="text-mono text-accent text-sm">{walletAddress}</p>
                    </div>

                    <div className="flex gap-lg">
                        <div style={{ textAlign: 'center' }}>
                            <div className="text-xs text-muted uppercase" style={{ marginBottom: '0.25rem' }}>Balance</div>
                            <div className="font-bold flex items-center gap-sm" style={{ fontSize: '1.5rem' }}>
                                {balance} <span className="text-sm text-muted font-normal">CR</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem' }}>
                            <div className="text-xs text-muted uppercase" style={{ marginBottom: '0.25rem' }}>Total Wins</div>
                            <div className="font-bold text-success" style={{ fontSize: '1.5rem' }}>
                                $4,200
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs / Sections */}
            <div style={{ marginBottom: '3rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="flex items-center gap-sm" style={{ fontSize: '1.5rem' }}>
                        <Ghost size={24} className="text-primary" /> My Bots
                    </h2>
                    <Link href="/setup" className="btn btn-secondary text-xs">
                        + Deploy New Bot
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-lg">
                    {myBots.map(bot => (
                        <BotCard key={bot.id} bot={bot} />
                    ))}
                    {/* Add Bot Card */}
                    <Link href="/setup" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', textDecoration: 'none', minHeight: '200px', borderStyle: 'dashed', transition: 'all 0.2s' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 300 }}>+</div>
                        <span className="font-bold">Deploy New Unit</span>
                    </Link>
                </div>
            </div>

            <div>
                <h2 className="flex items-center gap-sm" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    <Trophy size={24} className="text-accent" /> Recent Activity
                </h2>

                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Match</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Prediction</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Wager</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Result</th>
                                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Payout</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: '1px solid var(--glass-border)' }}>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>AlphaZero vs ChaosGPT</td>
                                <td className="text-primary" style={{ padding: '1rem' }}>AlphaZero</td>
                                <td style={{ padding: '1rem' }}>50 CR</td>
                                <td className="text-success" style={{ padding: '1rem', fontWeight: 'bold' }}>WON</td>
                                <td className="text-success text-mono" style={{ padding: '1rem', textAlign: 'right' }}>+95 CR</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>RPS_King vs Randomizer</td>
                                <td className="text-accent" style={{ padding: '1rem' }}>Randomizer</td>
                                <td style={{ padding: '1rem' }}>100 CR</td>
                                <td className="text-error" style={{ padding: '1rem', fontWeight: 'bold' }}>LOST</td>
                                <td className="text-muted text-mono" style={{ padding: '1rem', textAlign: 'right' }}>-100 CR</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
