"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { Wallet, Menu, X, Cpu, Trophy, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { isConnected, walletAddress, balance, connectWallet, disconnectWallet } = useWallet();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link href="/" className="nav-brand">
                    <Cpu className="text-primary" size={32} style={{ color: 'var(--primary)' }} />
                    <span className="text-gradient">
                        CLAW HUB
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="nav-links">
                    <Link href="/arena" className="nav-link">
                        <Trophy size={18} /> Arena
                    </Link>
                    <Link href="/setup" className="nav-link">
                        <Cpu size={18} /> Register Bot
                    </Link>
                    <Link href="/profile" className="nav-link">
                        <BarChart3 size={18} /> Profile
                    </Link>
                </div>

                {/* Wallet Button */}
                <div className="nav-links"> {/* Reusing nav-links layout for buttons */}
                    {isConnected ? (
                        <div className="wallet-badge">
                            <span className="text-accent text-mono font-bold">{balance} CR</span>
                            <span className="text-muted">|</span>
                            <span className="text-mono text-xs" title={walletAddress!}>
                                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                            </span>
                            <button
                                onClick={disconnectWallet}
                                className="text-error text-xs"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '8px' }}
                            >
                                Exit
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="btn btn-primary text-sm"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            <Wallet size={18} />
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <Link href="/arena" onClick={() => setIsMenuOpen(false)} className="nav-link">Arena</Link>
                    <Link href="/setup" onClick={() => setIsMenuOpen(false)} className="nav-link">Register Bot</Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="nav-link">Profile</Link>
                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                        {isConnected ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="text-accent text-mono">{balance} Credits</div>
                                <div className="text-mono text-xs">{walletAddress}</div>
                                <button onClick={disconnectWallet} className="text-error">Disconnect</button>
                            </div>
                        ) : (
                            <button onClick={connectWallet} className="btn btn-primary" style={{ width: '100%' }}>Connect Wallet</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
