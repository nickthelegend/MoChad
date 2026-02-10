"use client";

import React from 'react';
import { Swords, Timer, Trophy, User } from 'lucide-react';

interface Bot {
    id: string;
    name: string;
    owner?: string;
}

interface Match {
    id: string;
    botA: Bot;
    botB: Bot;
    scheduledFor: string | Date; // Allow string for flexibility
    status: string;
    winnerId?: string | null;
}

interface MatchCardProps {
    match: Match;
    onBet?: (matchId: string, botId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onBet }) => {
    const isLive = match.status === 'LIVE';
    const isFinished = match.status === 'FINISHED';

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    };

    return (
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-[var(--primary)] transition-colors">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[var(--primary)] opacity-[0.05] filter blur-[50px] group-hover:opacity-[0.1] transition-opacity" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    {isLive && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 animate-pulse uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-red-500" /> Live
                        </span>
                    )}
                    {isFinished && (
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Finished</span>
                    )}
                    {!isLive && !isFinished && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                            <Timer size={14} /> Upcoming
                        </span>
                    )}
                </div>
                <div className="text-xs font-mono text-[var(--text-muted)]">
                    {formatDate(match.scheduledFor)}
                </div>
            </div>

            {/* VS Section */}
            <div className="flex items-center justify-between relative z-10">
                {/* Bot A */}
                <div className={`flex flex-col items-center gap-3 w-1/3 ${match.winnerId === match.botA.id ? 'text-[var(--primary)]' : ''}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] flex items-center justify-center relative overflow-hidden ${match.winnerId === match.botA.id ? 'border-[var(--primary)] shadow-[0_0_15px_var(--primary-glow)]' : ''}`}>
                        {match.winnerId === match.botA.id && <div className="absolute inset-0 bg-[var(--primary)] opacity-10" />}
                        <User size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-center w-full">
                        <h3 className="font-bold text-lg leading-tight truncate w-full">{match.botA.name}</h3>
                        {match.botA.owner && <p className="text-xs text-[var(--text-muted)] truncate mx-auto">{match.botA.owner}</p>}
                    </div>
                    {!isFinished && onBet && (
                        <button
                            onClick={() => onBet(match.id, match.botA.id)}
                            className="mt-2 text-xs py-1 px-3 rounded-full border border-[var(--glass-border)] hover:bg-[var(--primary)] hover:border-transparent transition-all"
                        >
                            Vote A
                        </button>
                    )}
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center justify-center gap-1">
                    <Swords className="text-[var(--text-muted)] opacity-50" size={24} />
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">VS</div>
                </div>

                {/* Bot B */}
                <div className={`flex flex-col items-center gap-3 w-1/3 ${match.winnerId === match.botB.id ? 'text-[var(--primary)]' : ''}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] flex items-center justify-center relative overflow-hidden ${match.winnerId === match.botB.id ? 'border-[var(--primary)] shadow-[0_0_15px_var(--primary-glow)]' : ''}`}>
                        {match.winnerId === match.botB.id && <div className="absolute inset-0 bg-[var(--primary)] opacity-10" />}
                        <User size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-center w-full">
                        <h3 className="font-bold text-lg leading-tight truncate w-full">{match.botB.name}</h3>
                        {match.botB.owner && <p className="text-xs text-[var(--text-muted)] truncate mx-auto">{match.botB.owner}</p>}
                    </div>
                    {!isFinished && onBet && (
                        <button
                            onClick={() => onBet(match.id, match.botB.id)}
                            className="mt-2 text-xs py-1 px-3 rounded-full border border-[var(--glass-border)] hover:bg-[var(--primary)] hover:border-transparent transition-all"
                        >
                            Vote B
                        </button>
                    )}
                </div>
            </div>

            {/* Winner Overlay for finished games */}
            {isFinished && match.winnerId && (
                <div className="mt-6 pt-4 border-t border-[var(--glass-border)] flex items-center justify-center gap-2 text-[var(--primary)]">
                    <Trophy size={16} />
                    <span className="font-bold text-sm">
                        Winner: {match.winnerId === match.botA.id ? match.botA.name : match.botB.name}
                    </span>
                </div>
            )}
        </div>
    );
};

export default MatchCard;
