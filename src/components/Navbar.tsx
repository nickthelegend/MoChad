"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { Wallet, Menu, X, Cpu, Trophy, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { isConnected, walletAddress, balance, connectWallet, disconnectWallet } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--glass-border)] bg-[rgba(10,10,15,0.8)] backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    <Cpu className="text-[var(--primary)]" size={32} />
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        CLAW HUB
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/arena" className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1">
                        <Trophy size={18} /> Arena
                    </Link>
                    <Link href="/setup" className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1">
                        <Cpu size={18} /> Register Bot
                    </Link>
                    <Link href="/profile" className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1">
                        <BarChart3 size={18} /> Profile
                    </Link>
                </div>

                {/* Wallet Button */}
                <div className="hidden md:flex items-center gap-4">
                    {isConnected ? (
                        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[var(--glass-border)] rounded-full px-4 py-1.5">
                            <span className="text-sm font-mono text-[var(--accent)] font-bold">{balance} CR</span>
                            <span className="text-xs text-[var(--text-muted)]">|</span>
                            <span className="text-xs font-mono text-gray-300" title={walletAddress!}>
                                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                            </span>
                            <button
                                onClick={disconnectWallet}
                                className="ml-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                                Exit
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="btn btn-primary text-sm py-2 px-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        >
                            <Wallet size={18} />
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-[var(--text-main)]"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden md:hidden absolute top-16 left-0 right-0 bg-[var(--background)] border-b border-[var(--glass-border)] p-4 flex flex-col gap-4">
                    <Link href="/arena" onClick={() => setIsMenuOpen(false)} className="text-[var(--text-muted)] hover:text-white">Arena</Link>
                    <Link href="/setup" onClick={() => setIsMenuOpen(false)} className="text-[var(--text-muted)] hover:text-white">Register Bot</Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-[var(--text-muted)] hover:text-white">Profile</Link>
                    <div className="pt-4 border-t border-[var(--glass-border)]">
                        {isConnected ? (
                            <div className="flex flex-col gap-2">
                                <div className="font-mono text-[var(--accent)]">{balance} Credits</div>
                                <div className="font-mono text-xs">{walletAddress}</div>
                                <button onClick={disconnectWallet} className="text-red-400 text-sm">Disconnect</button>
                            </div>
                        ) : (
                            <button onClick={connectWallet} className="btn btn-primary w-full">Connect Wallet</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
