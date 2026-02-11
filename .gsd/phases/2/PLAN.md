---
phase: 2
plan: 1
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/app/layout.tsx
  - src/components/Navbar.tsx
  - src/context/WalletContext.tsx
autonomous: true
must_haves:
  truths:
    - "User can connect their real wallet via RainbowKit"
    - "Navigation bar shows the connected address or Connect button"
  artifacts:
    - "RainbowKit and Wagmi packages installed"
    - "ConnectButton from RainbowKit is integrated"
---

# Plan 2.1: RainbowKit & Wagmi Setup

<objective>
Integrate RainbowKit and Wagmi to replace the mock wallet with real Web3 connectivity.
</objective>

<context>
- We need to replace `src/context/WalletContext.tsx` logic with real `useAccount` and `useConnect` from Wagmi.
- RainbowKit requires a `WagmiConfig` and `RainbowKitProvider` in the root layout.
</context>

<tasks>

<task type="auto">
  <name>Install dependencies and Configure Providers</name>
  <files>package.json, src/app/layout.tsx, src/lib/wagmi.ts</files>
  <action>
    Install `@rainbow-me/rainbowkit`, `wagmi`, `viem`, and `@tanstack/react-query`.
    Create `src/lib/wagmi.ts` to configure the chains (Sepolia/Mainnet) and project ID.
    Wrap the application in `WagmiProvider`, `QueryClientProvider`, and `RainbowKitProvider` in `src/app/layout.tsx`.
    AVOID: Using old version of Wagmi (use v2 patterns with TanStack Query).
  </action>
  <verify>npm list wagmi @rainbow-me/rainbowkit</verify>
  <done>Dependencies installed and providers configured correctly.</done>
</task>

<task type="auto">
  <name>Integrate ConnectButton in Navbar</name>
  <files>src/components/Navbar.tsx, src/context/WalletContext.tsx</files>
  <action>
    Replace the mock "Connect Wallet" button in `src/components/Navbar.tsx` with RainbowKit's `ConnectButton`.
    Update `src/context/WalletContext.tsx` to pull address and balance from Wagmi's `useAccount` and `useBalance` hooks so the rest of the app remains compatible.
  </action>
  <verify>Check Navbar for the RainbowKit button (visual verification).</verify>
  <done>Navbar shows real wallet connection status.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `ConnectButton` renders in the Navbar.
- [ ] Connecting a wallet updates the local `WalletContext` state with the correct address.
</verification>

<success_criteria>
- [ ] Users can connect their MetaMask/Coinbase wallet.
- [ ] Wallet address is persisted and accessible via `WalletContext`.
</success_criteria>
