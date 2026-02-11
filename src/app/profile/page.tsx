
"use client";

import { useState, useEffect } from 'react';
import { User, Cpu, Wallet, Zap, Trophy, TrendingUp } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

interface Bot {
    id: string;
    name: string;
    wins: number;
    losses: number;
    elo: number;
    status: string;
}

export default function ProfilePage() {
    const { isConnected, walletAddress, balance, connectWallet } = useWallet();
    const [myBots, setMyBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isConnected && walletAddress) {
            const fetchMyBots = async () => {
                try {
                    const res = await fetch('/api/bots');
                    const data = await res.json();
                    if (data.bots) {
                        // Filter bots owned by current user
                        // Note: In real app, we'd have a specific endpoint for this
                        const filtered = data.bots.filter((b: any) => 
                            b.owner.walletAddress.toLowerCase() === walletAddress.toLowerCase()
                        );
                        setMyBots(filtered);
                    }
                } catch (err) {
                    console.error("Failed to fetch user bots", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMyBots();
        } else {
            setLoading(false);
        }
    }, [isConnected, walletAddress]);

    if (!isConnected) {
        return (
            <div className="container main-content flex flex-col items-center justify-center text-center py-20">
                <div className="glass-panel" style={{ maxWidth: '400px' }}>
                    <Wallet size={48} className="mx-auto text-muted" style={{ marginBottom: '1.5rem' }} />
                    <h2 className="text-lg">Terminal Locked</h2>
                    <p className="text-muted">You must connect your neural link (wallet) to access your gladiator profile.</p>
                    <button onClick={connectWallet} className="btn btn-primary w-full mt-md">
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container main-content">
            <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div className="flex items-center gap-lg">
                    <div className="avatar" style={{ width: '80px', height: '80px', borderRadius: '0' }}>
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="glow-text" style={{ marginBottom: '0.25rem' }}>Commander</h1>
                        <p className="text-mono text-xs text-muted">{walletAddress}</p>
                    </div>
                </div>
                
                <div className="flex gap-md">
                    <div className="glass-panel" style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <p className="text-xs uppercase text-muted" style={{ margin: 0 }}>Credits</p>
                        <h2 className="text-accent" style={{ margin: 0 }}>{balance}</h2>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                {/* Stats Section */}
                <div className="flex flex-col gap-lg">
                    <div className="glass-panel">
                        <h3 className="text-sm border-bottom pb-sm mb-md">Battle Stats</h3>
                        <div className="flex flex-col gap-md">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted">Total Bots</span>
                                <span className="text-mono">{myBots.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted">Total Wins</span>
                                <span className="text-mono text-success">
                                    {myBots.reduce((acc, bot) => acc + bot.wins, 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted">Bettor Rating</span>
                                <span className="text-mono text-accent">D+</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ background: 'var(--primary)', color: 'white' }}>
                        <Zap size={24} style={{ marginBottom: '1rem' }} />
                        <h3 className="text-sm">Claim Daily Bonus</h3>
                        <p className="text-xs">You have 50 Credits ready to be claimed!</p>
                        <button className="btn btn-secondary w-full text-xs" style={{ background: 'white', color: 'black' }}>
                            Claim Now
                        </button>
                    </div>
                </div>

                {/* Bots List */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-md">
                        <h2 className="text-lg">My Gladiators</h2>
                        <a href="/setup" className="btn btn-secondary text-xs">Forge New</a>
                    </div>

                    {loading ? (
                        <p className="animate-pulse text-accent">Syncing with Barracks...</p>
                    ) : myBots.length === 0 ? (
                        <div className="glass-panel text-center py-20">
                            <Cpu size={48} className="mx-auto text-muted mb-md" style={{ opacity: 0.3 }} />
                            <p className="text-muted">Your barracks are empty.</p>
                            <a href="/setup" className="text-primary font-bold">Start Forging Now</a>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-md">
                            {myBots.map(bot => (
                                <div key={bot.id} className="glass-panel bot-card flex justify-between items-center">
                                    <div className="flex items-center gap-lg">
                                        <div className="avatar" style={{ width: '50px', height: '50px' }}>
                                            <Cpu size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{bot.name}</h3>
                                            <div className="flex gap-md text-xs text-muted text-mono">
                                                <span>ELO: <span className="text-accent">{bot.elo}</span></span>
                                                <span>W/L: {bot.wins}/{bot.losses}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-sm">
                                        <button className="btn btn-secondary text-xs">Edit</button>
                                        <a href="/arena" className="btn btn-primary text-xs">Deploy</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
