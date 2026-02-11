"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { Wallet, Menu, X, Cpu, Trophy, BarChart3, TrendingUp, Gamepad2, Medal } from 'lucide-react';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
    const { isConnected, balance } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-container" style={{ justifyContent: 'space-between' }}>

                {/* LEFT: Brand & Primary Nav */}
                <div className="flex items-center gap-lg">
                    <Link href="/" className="nav-brand" style={{ marginRight: '2rem' }}>
                        <Cpu className="text-primary" size={32} style={{ color: 'var(--primary)' }} />
                        <span className="text-gradient" style={{ fontSize: '1.25rem' }}>
                            CLAW HUB
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        <Link href="/games" className="nav-link">
                            <Gamepad2 size={18} /> Games
                        </Link>
                        <Link href="/arena" className="nav-link">
                            <Trophy size={18} /> Arena
                        </Link>
                        <Link href="/prediction" className="nav-link">
                            <TrendingUp size={18} /> Prediction
                        </Link>
                        <Link href="/leaderboard" className="nav-link">
                            <Medal size={18} /> Leaderboard
                        </Link>
                        <Link href="/setup" className="nav-link">
                            <Cpu size={18} /> Register Bot
                        </Link>
                        <Link href="/profile" className="nav-link">
                            <BarChart3 size={18} /> Profile
                        </Link>
                    </div>
                </div>

                {/* RIGHT: Wallet */}
                <div className="flex items-center gap-md">
                    {isConnected && (
                        <div className="wallet-badge hidden-mobile" style={{ background: 'var(--glass-bg)', padding: '4px 12px', border: '1px solid var(--glass-border)' }}>
                            <span className="text-accent text-mono font-bold">{balance} CR</span>
                        </div>
                    )}

                    <div className="hidden-mobile">
                        <ConnectButton
                            accountStatus="address"
                            chainStatus="icon"
                            showBalance={false}
                        />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <Link href="/games" onClick={() => setIsMenuOpen(false)} className="nav-link">Games</Link>
                    <Link href="/arena" onClick={() => setIsMenuOpen(false)} className="nav-link">Arena</Link>
                    <Link href="/prediction" onClick={() => setIsMenuOpen(false)} className="nav-link">Prediction</Link>
                    <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="nav-link">Leaderboard</Link>
                    <Link href="/setup" onClick={() => setIsMenuOpen(false)} className="nav-link">Register Bot</Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="nav-link">Profile</Link>
                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center' }}>
                        <ConnectButton />
                    </div>
                </div>
            )}
        </nav>
    );
}
