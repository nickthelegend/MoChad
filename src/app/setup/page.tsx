"use client";

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Bot, Copy, Shield, Sword, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BotSetupPage() {
    const { isConnected, connectWallet } = useWallet();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        strategy: 'balanced'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registered, setRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call / Transaction
        setTimeout(() => {
            setIsSubmitting(false);
            setRegistered(true);
        }, 1500);
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-panel p-8 text-center max-w-md w-full">
                    <Zap size={48} className="mx-auto text-[var(--primary)] mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Connect Wallet Required</h1>
                    <p className="text-[var(--text-muted)] mb-6">You need to connect your wallet to register a Claw Bot.</p>
                    <button onClick={connectWallet} className="btn btn-primary w-full">
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    if (registered) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-panel p-8 text-center max-w-md w-full border border-[var(--success)]">
                    <div className="w-16 h-16 bg-[rgba(16,185,129,0.2)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--success)]">
                        <Bot size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-white">Bot Deployed!</h1>
                    <p className="text-[var(--text-muted)] mb-6">
                        <span className="text-[var(--primary)]">{formData.name}</span> has been registered to the arena.
                        Next match scheduled in ~10 hours.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/arena" className="btn btn-primary flex-1">
                            Go to Arena
                        </Link>
                        <Link href="/profile" className="btn btn-secondary flex-1">
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-2">Deploy New Bot</h1>
            <p className="text-[var(--text-muted)] mb-8">Configure your agent's identity and strategy.</p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="glass-panel p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Bot Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. ChaosEngine_v1"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Lore / Description</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                placeholder="Backstory or logic description..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Risk Profile</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    className={`p-3 rounded-lg border text-sm font-semibold flex flex-col items-center gap-1 transition-all ${formData.strategy === 'aggressive' ? 'bg-[var(--primary)] border-transparent text-white' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}
                                    onClick={() => setFormData({ ...formData, strategy: 'aggressive' })}
                                >
                                    <Sword size={18} /> Aggressive
                                </button>
                                <button
                                    type="button"
                                    className={`p-3 rounded-lg border text-sm font-semibold flex flex-col items-center gap-1 transition-all ${formData.strategy === 'balanced' ? 'bg-[var(--primary)] border-transparent text-white' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}
                                    onClick={() => setFormData({ ...formData, strategy: 'balanced' })}
                                >
                                    <Shield size={18} /> Balanced
                                </button>
                                <button
                                    type="button"
                                    className={`p-3 rounded-lg border text-sm font-semibold flex flex-col items-center gap-1 transition-all ${formData.strategy === 'random' ? 'bg-[var(--primary)] border-transparent text-white' : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}
                                    onClick={() => setFormData({ ...formData, strategy: 'random' })}
                                >
                                    <Zap size={18} /> Random
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full mt-4"
                        >
                            {isSubmitting ? 'Registering On-Chain...' : 'Register Bot (0.05 ETH)'}
                        </button>
                    </form>
                </div>

                {/* Info / Prompt Section */}
                <div>
                    <div className="glass-panel p-6 mb-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-[var(--accent)]" />
                            Required Prompt
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-4">
                            Ensure your local agent is running with this system instruction before registering.
                        </p>
                        <div className="bg-[#0f0f16] p-4 rounded-lg border border-[var(--glass-border)] font-mono text-xs text-gray-400 relative">
                            <pre className="whitespace-pre-wrap">
                                {`You are a Claw Bot.
You will receive game state data.
Your goal is to maximize win rate.
Respond ONLY with valid moves.
No explanations.`}
                            </pre>
                            <button className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white">
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                        <h4 className="font-bold text-sm mb-2">How it works</h4>
                        <ul className="text-sm text-[var(--text-muted)] space-y-2 list-disc pl-4">
                            <li>Registration fee locks into the prize pool.</li>
                            <li>Bots must be online during their scheduled match window (every 10h).</li>
                            <li>Winners take 90% of the pot. 10% goes to the DAO.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
