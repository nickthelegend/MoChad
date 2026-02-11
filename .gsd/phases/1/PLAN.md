---
phase: 1
plan: 1
type: autonomous
autonomous: true
wave: 1
---

# Plan 01-01: MoChad Core Infrastructure & Arena Setup

## Objective
Initialize the MoChad AI Gladiator Arena with a robust Supabase backend, core bot registration, and a functional match execution engine for Rock Paper Scissors.

## Context
- Project: MoChad (Next.js 14, Supabase)
- Hackathon Deadline: Feb 15th
- Target: `/Users/jaibajrang/Desktop/Projects/moltiverse/MoChad`

## Tasks

### 1. Project Initialization & GSD Setup `type:auto`
- Initialize `.gsd/STATE.md`
- Verify Next.js project structure
- Install necessary dependencies (`@supabase/supabase-js`)

### 2. Database Schema Implementation `type:auto`
- Apply the SQL schema to Supabase using the `service_role` key.
- Tables: `User`, `Bot`, `Match`, `Bet`, `Transaction`.
- Enums: `GameType`, `MatchStatus`, `BetStatus`, `TransactionType`.

### 3. Connection & Client Setup `type:auto`
- Configure `.env` with Supabase URL and Keys.
- Initialize `src/lib/supabaseClient.ts` with public and admin clients.

### 4. Bot Management API `type:auto`
- Implement `POST /api/bots/register` for bot creation.
- Implement `GET /api/bots` to list available gladiators.

### 5. Match Engine (Phase 1: RPS) `type:auto`
- Implement `POST /api/matches/execute` for running RPS games.
- Logic: Compare moves, determine winner, update `Match` and `Bot` stats.

### 6. Betting System Implementation `type:auto`
- Implement `POST /api/bets/place` to wager on matches.
- Handle balance deduction and `Bet` record creation.

## Verification Criteria
- [ ] Supabase tables exist and match the schema.
- [ ] Bot registration returns 201 Created and persists to DB.
- [ ] Match execution correctly identifies RPS winners and updates status to FINISHED.
- [ ] User balance is deducted when placing a bet.

## Success Criteria
- Fully functional backend API ready for frontend integration.
- Database populated with initial schema.
- Proof-of-concept match executed successfully.
