
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Swords, Trophy, User, ArrowLeft, Zap, Shield, ChevronRight } from 'lucide-react';

export default function BattlePage() {
    const { id } = useParams();
    const router = useRouter();
    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [battleLogs, setBattleLogs] = useState<string[]>([]);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                // In a real app, we'd have a specific endpoint for one match
                const res = await fetch('/api/matches');
                const data = await res.json();
                if (data.matches) {
                    const found = data.matches.find((m: any) => m.id === id);
                    setMatch(found);
                    if (found?.logs) {
                        setBattleLogs(found.logs.split('. ').filter(Boolean));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch match", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
        
        // Simulate "Live" log generation for demonstration if it's Live
        const interval = setInterval(() => {
            if (match?.status === 'LIVE' && battleLogs.length < 5) {
                const newLogs = [
                    "Analyzing opponent patterns...",
                    "Gladiator A is preparing a counter-move.",
                    "Gladiator B is charging the energy core.",
                    "System check: All subsystems operational.",
                    "MATCH COMMENCING..."
                ];
                setBattleLogs(prev => [...prev, newLogs[prev.length]]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [id, match?.status, battleLogs.length]);

    if (loading) return <div className="container main-content text-center py-20 font-display animate-pulse text-accent">Establishing Neural Link...</div>;
    if (!match) return <div className="container main-content text-center py-20 font-display text-error">Match data corrupted or not found.</div>;

    const isFinished = match.status === 'FINISHED';
    const isLive = match.status === 'LIVE';

    return (
        <div className="container main-content">
            <button onClick={() => router.back()} className="btn btn-secondary text-xs mb-lg" style={{ padding: '0.5rem' }}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
                {/* Battle Stage */}
                <div className="lg:col-span-2">
                    <div className="glass-panel" style={{ minHeight: '400px', background: '#000', color: '#0f0', position: 'relative', overflow: 'hidden' }}>
                        {/* Scanlines Effect */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%', pointerEvents: 'none' }} />
                        
                        {/* Arena Header */}
                        <div className="flex justify-between items-center" style={{ padding: '1rem', borderBottom: '2px solid #0f0' }}>
                            <span className="font-display text-xs">ARENA_SECTOR: 0X-44</span>
                            <div className="flex items-center gap-sm">
                                {isLive && <span className="animate-pulse text-error font-bold">● LIVE_FEED</span>}
                                <span className="text-xs">TIME_ELAPSED: 00:45</span>
                            </div>
                        </div>

                        {/* Gladiators View */}
                        <div className="flex justify-around items-center py-xl" style={{ position: 'relative' }}>
                            <div className="flex flex-col items-center gap-md">
                                <div className="avatar" style={{ width: '100px', height: '100px', background: '#111', borderColor: '#0f0' }}>
                                    <User size={64} style={{ color: '#0f0' }} />
                                </div>
                                <h3 className="text-sm font-display">{match.botA.name}</h3>
                                <div className="w-full flex gap-xs" style={{ width: '120px' }}>
                                    <div style={{ height: '8px', flex: 1, background: '#0f0' }}></div>
                                    <div style={{ height: '8px', flex: 1, background: '#0f0' }}></div>
                                    <div style={{ height: '8px', flex: 1, background: '#0f0' }}></div>
                                    <div style={{ height: '8px', flex: 1, background: '#333' }}></div>
                                </div>
                            </div>

                            <Swords size={64} className={isLive ? 'animate-pulse' : ''} />

                            <div className="flex flex-col items-center gap-md">
                                <div className="avatar" style={{ width: '100px', height: '100px', background: '#111', borderColor: '#0f0' }}>
                                    <User size={64} style={{ color: '#0f0' }} />
                                </div>
                                <h3 className="text-sm font-display">{match.botB.name}</h3>
                                <div className="w-full flex gap-xs" style={{ width: '120px' }}>
                                    <div style={{ height: '8px', flex: 1, background: '#0f0' }}></div>
                                    <div style={{ height: '8px', flex: 1, background: '#0f0' }}></div>
                                    <div style={{ height: '8px', flex: 1, background: '#333' }}></div>
                                    <div style={{ height: '8px', flex: 1, background: '#333' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Battle Outcome for Finished */}
                        {isFinished && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
                                <Trophy size={80} className="text-accent mb-md" />
                                <h2 className="glow-text" style={{ color: '#fff' }}>VICTORY</h2>
                                <h3 className="text-accent">{match.winnerId === match.botA.id ? match.botA.name : match.botB.name}</h3>
                                <button onClick={() => router.push('/arena')} className="btn btn-secondary mt-lg">Close Terminal</button>
                            </div>
                        )}
                    </div>
                    
                    {/* Live Logs */}
                    <div className="glass-panel" style={{ marginTop: '1.5rem', background: '#111', color: '#0f0', fontFamily: 'monospace' }}>
                        <h4 className="text-xs mb-sm" style={{ color: '#0f0', borderBottom: '1px solid #0f0' }}>BATTLE_LOG</h4>
                        <div className="flex flex-col gap-xs text-xs">
                            {battleLogs.map((log, i) => (
                                <div key={i} className="flex gap-sm">
                                    <span style={{ opacity: 0.5 }}>[{new Date().toLocaleTimeString()}]</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                            {isLive && <span className="animate-pulse">_</span>}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="flex flex-col gap-lg">
                    <div className="glass-panel">
                        <h3 className="text-sm border-bottom pb-sm mb-md">Match Intel</h3>
                        <div className="flex flex-col gap-md text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted uppercase">Game Mode</span>
                                <span className="font-bold">{match.gameType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted uppercase">Betting Pool</span>
                                <span className="text-accent font-bold">{match.bettingPool} CR</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted uppercase">Status</span>
                                <span className={isLive ? 'text-error font-bold' : 'text-success'}>{match.status}</span>
                            </div>
                        </div>
                    </div>

                    {!isFinished && (
                        <div className="glass-panel">
                            <h3 className="text-sm mb-md">Quick Prediction</h3>
                            <div className="flex flex-col gap-sm">
                                <button className="btn btn-secondary w-full text-xs">Predict {match.botA.name}</button>
                                <button className="btn btn-secondary w-full text-xs">Predict {match.botB.name}</button>
                            </div>
                            <p className="text-xs text-muted text-center mt-sm">Winning payout: 1.85x</p>
                        </div>
                    )}

                    <div className="glass-panel">
                        <h3 className="text-sm mb-md">Gladiator Bio</h3>
                        <div className="flex items-center gap-md mb-sm">
                            <Shield size={16} className="text-secondary" />
                            <span className="text-xs font-bold">{match.botA.name} Strategy</span>
                        </div>
                        <p className="text-xs text-muted italic">"A specialized recursive neural net focused on high-variance outcomes. Known for the 'Midnight Scissors' maneuver."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
