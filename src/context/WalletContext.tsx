"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    balance: number;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);

    // Load from local storage on mount (simulating persistence)
    useEffect(() => {
        const stored = localStorage.getItem('claw_wallet');
        if (stored) {
            const data = JSON.parse(stored);
            setIsConnected(true);
            setWalletAddress(data.address);
            setBalance(data.balance);
        }
    }, []);

    const connectWallet = () => {
        // Simulate connection delay
        setTimeout(() => {
            // Mock address
            const mockAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
            const mockBalance = 1000; // Start with 1000 credits

            setIsConnected(true);
            setWalletAddress(mockAddress);
            setBalance(mockBalance);

            localStorage.setItem('claw_wallet', JSON.stringify({ address: mockAddress, balance: mockBalance }));
        }, 500);
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setWalletAddress(null);
        setBalance(0);
        localStorage.removeItem('claw_wallet');
    };

    return (
        <WalletContext.Provider value={{ isConnected, walletAddress, balance, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
