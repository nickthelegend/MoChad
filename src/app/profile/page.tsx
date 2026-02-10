"use client";

import { useWallet } from '@/context/WalletContext';
import BotCard from '@/components/BotCard';
import Link from 'next/link';
import { Ghost, Trophy, Wallet, Zap } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-panel p-8 text-center max-w-md w-full">
                    <Wallet size={48} className="mx-auto text-[var(--primary)] mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
                    <p className="text-[var(--text-muted)] mb-6">View your bots and betting history by connecting your wallet.</p>
                    <button onClick={connectWallet} className="btn btn-primary w-full">Connect Wallet</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Stats */}
            <div className="glass-panel p-8 mb-8 border-[var(--primary)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] filter blur-[100px] opacity-10" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Commander Profile</h1>
                        <p className="font-mono text-[var(--accent)] text-sm">{walletAddress}</p>
                    </div>

                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Balance</div>
                            <div className="text-3xl font-bold text-white flex items-center gap-1">
                                {balance} <span className="text-sm text-[var(--text-muted)] font-normal">CR</span>
                            </div>
                        </div>

                        <div className="text-center border-l border-[var(--glass-border)] pl-8">
                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Wins</div>
                            <div className="text-3xl font-bold text-[var(--success)]">
                                $4,200
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs / Sections */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Ghost size={24} className="text-[var(--primary)]" /> My Bots
                    </h2>
                    <Link href="/setup" className="btn btn-secondary text-xs">
                        + Deploy New Bot
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBots.map(bot => (
                        <BotCard key={bot.id} bot={bot} />
                    ))}
                    {/* Add Bot Card */}
                    <Link href="/setup" className="glass-panel p-6 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)] hover:text-white hover:border-[var(--primary)] transition-all cursor-pointer min-h-[200px] border-dashed">
                        <div className="w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center text-3xl font-light">+</div>
                        <span className="font-bold">Deploy New Unit</span>
                    </Link>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Trophy size={24} className="text-[var(--accent)]" /> Recent Activity
                </h2>

                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[rgba(0,0,0,0.2)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold">Match</th>
                                <th className="p-4 font-semibold">Prediction</th>
                                <th className="p-4 font-semibold">Wager</th>
                                <th className="p-4 font-semibold">Result</th>
                                <th className="p-4 font-semibold text-right">Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)]">
                            <tr className="hover:bg-[var(--surface-hover)] transition-colors">
                                <td className="p-4 font-medium">AlphaZero vs ChaosGPT</td>
                                <td className="p-4 text-[var(--primary)]">AlphaZero</td>
                                <td className="p-4">50 CR</td>
                                <td className="p-4 text-[var(--success)] font-bold">WON</td>
                                <td className="p-4 text-right text-[var(--success)] font-mono">+95 CR</td>
                            </tr>
                            <tr className="hover:bg-[var(--surface-hover)] transition-colors">
                                <td className="p-4 font-medium">RPS_King vs Randomizer</td>
                                <td className="p-4 text-[var(--accent)]">Randomizer</td>
                                <td className="p-4">100 CR</td>
                                <td className="p-4 text-[var(--error)] font-bold">LOST</td>
                                <td className="p-4 text-right text-[var(--text-muted)] font-mono">-100 CR</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
