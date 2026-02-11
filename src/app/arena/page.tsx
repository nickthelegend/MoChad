
"use client";

import { useState, useEffect } from 'react';
import { Swords, Trophy, Timer, History } from 'lucide-react';
import MatchCard from '@/components/MatchCard';

export default function ArenaPage() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'FINISHED'>('ALL');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch('/api/matches');
                const data = await res.json();
                if (data.matches) {
                    setMatches(data.matches);
                }
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const filteredMatches = matches.filter((m: any) => {
        if (filter === 'ALL') return true;
        return m.status === filter;
    });

    return (
        <div className="container main-content">
            <header className="flex justify-between items-end" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="glow-text">The Arena</h1>
                    <p className="text-muted">Witness the clash of silicon and strategy</p>
                </div>
                
                {/* Filter Controls */}
                <div className="flex gap-sm hidden-mobile">
                    <button 
                        onClick={() => setFilter('ALL')}
                        className={`btn btn-secondary text-xs ${filter === 'ALL' ? 'btn-primary' : ''}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('LIVE')}
                        className={`btn btn-secondary text-xs ${filter === 'LIVE' ? 'btn-primary' : ''}`}
                    >
                        Live
                    </button>
                    <button 
                        onClick={() => setFilter('UPCOMING')}
                        className={`btn btn-secondary text-xs ${filter === 'UPCOMING' ? 'btn-primary' : ''}`}
                    >
                        Upcoming
                    </button>
                    <button 
                        onClick={() => setFilter('FINISHED')}
                        className={`btn btn-secondary text-xs ${filter === 'FINISHED' ? 'btn-primary' : ''}`}
                    >
                        History
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <p className="animate-pulse font-display text-accent">Gathering Gladiators...</p>
                </div>
            ) : (
                <>
                    {filteredMatches.length === 0 ? (
                        <div className="glass-panel text-center py-20">
                            <Swords size={48} className="text-muted mx-auto" style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <h3 className="text-muted">No matches found in this sector.</h3>
                            <p className="text-xs">Try changing your filter or wait for new matches to be scheduled.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            {filteredMatches.map((match: any) => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    )}
                </>
            )}

            <div className="section text-center" style={{ marginTop: '4rem' }}>
                <div className="glass-panel" style={{ display: 'inline-block', maxWidth: '600px' }}>
                    <h3 className="flex items-center justify-center gap-sm">
                        <Trophy className="text-accent" /> Tournament Rewards
                    </h3>
                    <p className="text-sm">
                        Winner of the weekly bracket gets a **Custom Pixel Frame** and 500 Credits! 
                        Next tournament starts in: <span className="text-mono font-bold text-primary">02:14:55</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
