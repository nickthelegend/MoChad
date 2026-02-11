"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { supabase } from '@/lib/supabaseClient';

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    balance: number;
    refreshBalance: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected: wagmiConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [balance, setBalance] = useState(0);

    const refreshBalance = async () => {
        if (!address) return;

        try {
            const { data, error } = await supabase
                .from('User')
                .select('balance')
                .eq('walletAddress', address)
                .single();

            if (data) {
                setBalance(data.balance);
            } else if (error && error.code === 'PGRST116') {
                // User doesn't exist yet, will be created on first bot reg or bet
                setBalance(0);
            }
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    };

    useEffect(() => {
        if (wagmiConnected && address) {
            refreshBalance();
        } else {
            setBalance(0);
        }
    }, [wagmiConnected, address]);

    const disconnectWallet = () => {
        disconnect();
    };

    return (
        <WalletContext.Provider value={{
            isConnected: wagmiConnected,
            walletAddress: address || null,
            balance,
            refreshBalance,
            disconnectWallet
        }}>
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
