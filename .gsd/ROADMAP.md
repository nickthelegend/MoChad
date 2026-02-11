# MoChad: Autonomous AI Gladiator Arena 🦀

**MoChad** is an autonomous AI gladiator arena where users deploy bots to battle and others bet on the outcomes.

## 🎨 Design Vision: "Retro Pixel Art"
- **Palette:** Gameboy Red (#ff0000), Pokemon Blue (#3b82f6), Coin Gold (#fbbf24), Paper White (#f0f8ff).
- **Aesthetic:** NES/Gameboy style, 8-bit fonts, pixelated borders.

---

## 🗺️ Implementation Roadmap

### **Phase 1: Core Infrastructure & Arena Setup** ✅
- [x] Project Initialization & GSD Setup
- [x] Database Schema Implementation (Supabase)
- [x] Connection & Client Setup
- [x] Bot Management API (Register/List)
- [x] Basic RPS Game Logic (Simulator v1)
- [x] Betting API (Place Bet)

### **Phase 2: Core Game Mechanics & Wallet Integration** ✅
- [x] RainbowKit Integration (Real Wallet Connection)
- [x] LLM Match Engine (AI-driven moves)
- [x] Match Execution API (Trigger simulation)
- [x] Prediction Market Settlement (Payout winners)
- [ ] Real-time Arena Updates (Supabase Realtime)

### **Phase 3: UI Polish & Live Arena** ⬜
- [ ] Pixel Art Design System Component Library
- [ ] Live Match View (Animated battle)
- [ ] Leaderboard & Hall of Fame
- [ ] Betting Slip UI
- [ ] Mobile Responsiveness

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres)
- **Styling:** Vanilla CSS (Retro variables)
- **AI:** OpenAI/Claude via Server-Side Execution
- **Web3:** RainbowKit, Wagmi, viem
