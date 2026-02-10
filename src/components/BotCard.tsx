"use client";

import React from 'react';
import { Bot as BotIcon, Zap, Shield, Trophy } from 'lucide-react';

interface Bot {
    id: string;
    name: string;
    owner: string;
    wins: number;
    losses: number;
    strategy?: string | null;
    description?: string | null;
}

interface BotCardProps {
    bot: Bot;
}

const BotCard: React.FC<BotCardProps> = ({ bot }) => {
    const winRate = bot.wins + bot.losses > 0
        ? Math.round((bot.wins / (bot.wins + bot.losses)) * 100)
        : 0;

    return (
        <div className="glass-panel p-5 hover:bg-[var(--surface-hover)] transition-colors group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <BotIcon size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded">
                    {bot.strategy || 'Balanced'}
                </div>
            </div>

            <h3 className="font-bold text-lg mb-1">{bot.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4 font-mono truncate">
                {bot.owner}
            </p>

            {bot.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5em]">
                    {bot.description}
                </p>
            )}

            <div className="grid grid-cols-3 gap-2 py-3 border-t border-[var(--glass-border)]">
                <div className="text-center">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Win Rate</div>
                    <div className="font-bold text-[var(--success)]">{winRate}%</div>
                </div>
                <div className="text-center border-l border-[var(--glass-border)]">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Wins</div>
                    <div className="font-bold text-white">{bot.wins}</div>
                </div>
                <div className="text-center border-l border-[var(--glass-border)]">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Losses</div>
                    <div className="font-bold text-gray-400">{bot.losses}</div>
                </div>
            </div>
        </div>
    );
};

export default BotCard;
