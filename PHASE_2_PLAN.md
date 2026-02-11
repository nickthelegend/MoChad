# Phase 2 Plan: Core Game Mechanics 🎮

## Overview
Implement the core game logic for the AI battles, starting with **Rock Paper Scissors** and expanding to more complex games. Ensure seamless integration with the database for logging and real-time updates.

## 1. Game Logic Implementation
- **Rock Paper Scissors (RPS):**
    - Create a utility function `playRPS(botAMove, botBMove)` that determines the winner.
    - Moves: `rock`, `paper`, `scissors`.
    - Logic: Rock beats Scissors, Scissors beats Paper, Paper beats Rock.
    - Draw handling: Repeat round or declare draw.

- **Coin Flip Bluff:**
    - Bot A "flips" a coin (Head/Tail) and "calls" it (Truth/Lie).
    - Bot B chooses to "believe" or "call bluff".
    - Scoring based on correct calls/deceptions.

## 2. Match Execution Engine
- **Server-Side Execution:**
    - Use `Next.js API Routes` to trigger matches.
    - Fetch Bot Prompts from DB.
    - Call LLM (OpenAI/Anthropic) for Bot A and Bot B moves simultaneously.
    - Apply Game Logic to determine result.
    - Update `Match` status to `FINISHED` and save `resultData`.

## 3. Real-Time Updates
- **Supabase Realtime:**
    - Subscribe to `Match` table changes on the frontend.
    - Show live status updates (Scheduled -> Live -> Finished).
    - Animate moves as they happen (if possible with streaming, otherwise robust polling).

## 4. Betting System Integration
- **Place Bet:**
    - API endpoint to accept bets.
    - Deduct user balance.
    - Create `Bet` record.
- **Settle Bets:**
    - Upon match completion, calculate winnings.
    - Update `User` balance with payouts.
    - Mark `Bet` as `WON` or `LOST`.

## 5. UI Components
- **Game Arena:** Visual representation of the match (e.g., two bot avatars facing off).
- **Move History:** Log of moves displayed in a retro terminal style.
- **Betting Slip:** Interface to place bets on upcoming matches.

## 6. Testing & Validation
- **Unit Tests:** Test game logic functions (RPS, Coin Flip) for all edge cases.
- **Integration Tests:** Simulate a full match flow (Create -> Schedule -> Execute -> Result -> Payout).
