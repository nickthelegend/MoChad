"use client";

import { useState } from 'react';
import MatchCard from '@/components/MatchCard';
import { Timer, Zap, History } from 'lucide-react';

const DUMMY_MATCHES = [
    {
        id: '1',
        botA: { id: 'b1', name: 'AlphaZero', owner: '0x12...34ab' },
        botB: { id: 'b2', name: 'ChaosGPT', owner: '0xab...cd56' },
        scheduledFor: new Date().toISOString(), // NOW
        status: 'LIVE'
    },
    {
        id: '2',
        botA: { id: 'b3', name: 'DeepBlue', owner: '0x55...88yy' },
        botB: { id: 'b4', name: 'PaperMaster', owner: '0x99...11zz' },
        scheduledFor: new Date(Date.now() + 3600000).toISOString(),
        status: 'SCHEDULED'
    },
    {
        id: '3',
        botA: { id: 'b5', name: 'RPS_King', owner: '0x22...44aa' },
        botB: { id: 'b6', name: 'Randomizer', owner: '0x77...33bb' },
        scheduledFor: new Date(Date.now() + 7200000).toISOString(),
        status: 'SCHEDULED'
    },
    {
        id: '4',
        botA: { id: 'b7', name: 'LogicBomb', owner: '0x11...22cc' },
        botB: { id: 'b8', name: 'TheCrusher', owner: '0x88...99dd' },
        scheduledFor: new Date(Date.now() - 86400000).toISOString(),
        status: 'FINISHED',
        winnerId: 'b7'
    }
];

export default function ArenaPage() {
    const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');

    const liveMatches = DUMMY_MATCHES.filter(m => m.status === 'LIVE');
    const upcomingMatches = DUMMY_MATCHES.filter(m => m.status === 'SCHEDULED');
    const pastMatches = DUMMY_MATCHES.filter(m => m.status === 'FINISHED');

    const onBet = (matchId: string, botId: string) => {
        alert(`Bet placed on Bot ${botId} for Match ${matchId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">The Arena</h1>
                    <p className="text-[var(--text-muted)]">Watch bots fight. Place your bets.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--glass-border)] mt-4 md:mt-0">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'live' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <Zap size={16} /> Live
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-[var(--surface-hover)] text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <Timer size={16} /> Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-[var(--surface-hover)] text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <History size={16} /> Past
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'live' && liveMatches.map(match => (
                    <MatchCard key={match.id} match={match} onBet={onBet} />
                ))}
                {activeTab === 'upcoming' && upcomingMatches.map(match => (
                    <MatchCard key={match.id} match={match} onBet={onBet} />
                ))}
                {activeTab === 'past' && pastMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>

            {/* Empty States */}
            {activeTab === 'live' && liveMatches.length === 0 && (
                <div className="text-center py-20 text-[var(--text-muted)]">
                    <Zap size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No live matches right now.</p>
                </div>
            )}

            {activeTab === 'upcoming' && upcomingMatches.length === 0 && (
                <div className="text-center py-20 text-[var(--text-muted)]">
                    <Timer size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No upcoming matches scheduled.</p>
                </div>
            )}

        </div>
    );
}
