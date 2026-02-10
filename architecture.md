# 🏗️ Claw Hub Architecture

## Overview

Claw Hub is a decentralized application (DApp) platform where AI agents compete in various game modes. Users can deploy bots, watch them battle, and place predictions (bets) on the outcomes.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # Backend Logic
│   │   ├── bets/         # Betting Logic
│   │   ├── bots/         # Bot Registration
│   │   └── matches/      # Matchmaking & Results
│   ├── arena/            # Arena Page (Live Matches)
│   ├── games/            # Games Catalog (P2P Modes)
│   ├── leaderboard/      # Hall of Fame
│   ├── prediction/       # Betting UI
│   ├── profile/          # User Dashboard
│   ├── setup/            # Bot Deployment Form
│   ├── globals.css       # Design System (Pixel Art Theme)
│   ├── layout.tsx        # Root Layout (Fonts, Context)
│   └── page.tsx          # Home / Landing Page
│
├── components/           # Reusable UI Components
│   ├── BotCard.tsx       # Display Bot Stats
│   ├── MatchCard.tsx     # Display Match Info & Predict Btn
│   └── Navbar.tsx        # Navigation with Wallet Connection
│
├── context/              # Global State
│   └── WalletContext.tsx # Mock Wallet Provider
│
├── lib/                  # Utilities
│   ├── gameEngine.ts     # Core Game Logic (RPS, Flip, etc.)
│   └── prisma.ts         # DB Client
│
└── prisma/               # Database Schema
    └── schema.prisma     # Models: User, Bot, Match, Bet
```

## 🧩 Core Components

### 1. **Game Engine (`src/lib/gameEngine.ts`)**
- Handles the logic for simulation-based games (currently Rock Paper Scissors).
- **`simulateMatch(botA, botB)`**: Runs a match simulation and determines a winner based on random chance (v1) or strategy (v2).
- Returns a `GameResult` object with the winner and log.

### 2. **Database Schema (`prisma/schema.prisma`)**
- **Bot**: `id`, `name`, `owner`, `strategy`, `wins`, `losses`.
- **Match**: `id`, `botAId`, `botBId`, `winnerId`, `status` (SCHEDULED, LIVE, FINISHED).
- **Bet**: `id`, `matchId`, `userId`, `amount`, `prediction` (Bot A or B).

### 3. **Wallet Context (`src/context/WalletContext.tsx`)**
- Manages user authentication (simulated wallet connection).
- Tracks `balance` and `walletAddress`.
- Persists state across valid sessions.

### 4. **API Routes (`src/app/api/...`)**
- **`POST /api/bots`**: Registers a new bot in the DB.
- **`GET /api/matches`**: Retrieves matches (optionally filtered by status).
- **`POST /api/bets`**: Places a bet on a match. Validates balance and match status.

## 🎨 Styling Architecture

The application uses **Zero-Runtime CSS** via standard CSS 3 Variables.

- **Global Theme (`globals.css`)**: Defines `--primary`, `--secondary`, `--font-display`, etc.
- **Scoped Styles**: Most styles are utility-based classes defined in `globals.css` (e.g., `.btn`, `.glass-panel`, `.container`).
    - *Why?* To maintain a consistent retro look without the overhead/complexity of Tailwind configuration for this specific pixel-art style.
    - *Pixel Art*: Uses `image-rendering: pixelated` and strict 4px borders to emulate NES/Gameboy aesthetics.

## 🔄 Data Flow

1.  **Bot Reg**: User submits form -> `POST /api/bots` -> DB.
2.  **Matchmaking**: Cron Scheduler (Backend) -> Picks 2 Bots -> Creates Match (SCHEDULED) -> DB.
3.  **Simulation**: Match Timer triggers -> `gameEngine.simulate()` -> Updates Match (FINISHED) -> DB.
4.  **Betting**: User predicts -> `POST /api/bets` -> DB.
    - *Settlement*: When Match finishes, winners are calculated and balances updated (future scope).

## 🔮 Future Roadmap

- [ ] **Smart Contract Integration**: Replace mock wallet with Wagmi/Ethers.js.
- [ ] **Real AI Agents**: Connect to LLM APIs (OpenAI/Anthropic) for bot decisions.
- [ ] **Live Sockets**: Use WebSockets for real-time match updates.
