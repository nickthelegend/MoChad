
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, Save, Shield, Zap, Info } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

export default function SetupPage() {
    const router = useRouter();
    const { isConnected, walletAddress, connectWallet } = useWallet();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [prompt, setPrompt] = useState('');
    const [strategy, setStrategy] = useState('BALANCED');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            setError("Connect your wallet first, gladiator.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/bots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    prompt,
                    strategy,
                    owner: walletAddress
                }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/profile');
            } else {
                setError(data.error || 'Failed to register bot');
            }
        } catch (err) {
            setError('System failure. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container main-content">
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="glow-text">Forge Your Gladiator</h1>
                <p className="text-muted">Upload the system prompt that will guide your bot in the arena.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
                {/* Form Section */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
                        <div className="glass-panel">
                            <h3 className="flex items-center gap-sm" style={{ marginBottom: '1.5rem' }}>
                                <Info size={18} className="text-secondary" /> Basic Identity
                            </h3>
                            <div className="flex flex-col gap-md">
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted block" style={{ marginBottom: '0.5rem' }}>Bot Name</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="e.g. Mecha-Destroyer"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted block" style={{ marginBottom: '0.5rem' }}>Short Description</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="A ruthless pattern-matcher."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel">
                            <h3 className="flex items-center gap-sm" style={{ marginBottom: '1.5rem' }}>
                                <Shield size={18} className="text-primary" /> Strategy Engine
                            </h3>
                            <div className="flex flex-col gap-md">
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted block" style={{ marginBottom: '0.5rem' }}>System Prompt (The Brain)</label>
                                    <textarea 
                                        className="input-field" 
                                        rows={6} 
                                        placeholder="Describe how your bot should think. E.g., 'You are a Rock Paper Scissors master. You analyze opponent history and prefer Scissors when you sense hesitation.'"
                                        style={{ resize: 'none' }}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold text-muted block" style={{ marginBottom: '0.5rem' }}>Pre-set Strategy</label>
                                    <select 
                                        className="input-field"
                                        value={strategy}
                                        onChange={(e) => setStrategy(e.target.value)}
                                    >
                                        <option value="AGGRESSIVE">Aggressive (Favor heavy moves)</option>
                                        <option value="BALANCED">Balanced (Randomized with bias)</option>
                                        <option value="DEFENSIVE">Defensive (Reactive patterns)</option>
                                        <option value="CHAOTIC">Chaotic (Pure noise)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-error text-sm font-bold animate-pulse">
                                [ERROR]: {error}
                            </div>
                        )}

                        {!isConnected ? (
                            <button type="button" onClick={connectWallet} className="btn btn-primary" style={{ padding: '1rem' }}>
                                <Zap size={18} /> Connect Wallet to Forge
                            </button>
                        ) : (
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1rem' }}>
                                {loading ? 'Forging...' : <><Save size={18} /> Forge Gladiator</>}
                            </button>
                        )}
                    </form>
                </div>

                {/* Info Section */}
                <div className="flex flex-col gap-lg">
                    <div className="glass-panel" style={{ background: 'var(--surface-hover)' }}>
                        <h3 className="text-sm">Gladiator Rules</h3>
                        <ul className="text-xs flex flex-col gap-sm" style={{ listStyle: 'none' }}>
                            <li className="flex gap-sm"><span className="text-primary">▶</span> Prompts are fed directly to the LLM during matches.</li>
                            <li className="flex gap-sm"><span className="text-primary">▶</span> Registration fee is 10 Credits.</li>
                            <li className="flex gap-sm"><span className="text-primary">▶</span> Bots earn ELO based on performance.</li>
                            <li className="flex gap-sm"><span className="text-primary">▶</span> Owner receives 5% of all bets placed on their bot.</li>
                        </ul>
                    </div>

                    <div className="glass-panel">
                        <div className="avatar mx-auto" style={{ width: '120px', height: '120px', marginBottom: '1rem' }}>
                            <Cpu size={64} className="text-muted" />
                        </div>
                        <p className="text-center text-xs text-muted italic">"A gladiator is only as strong as its prompt."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
