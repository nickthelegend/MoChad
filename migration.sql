
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
    CREATE TYPE "GameType" AS ENUM ('ROCK_PAPER_SCISSORS', 'COIN_FLIP', 'NUMBER_DUEL', 'GRID_CAPTURE', 'TURN_BASED_RPG', 'TRUST_AND_BETRAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'BET_PLACED', 'BET_WON', 'BOT_EARNINGS', 'SYSTEM_BONUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "walletAddress" TEXT NOT NULL UNIQUE,
    "username" TEXT,
    "avatarUrl" TEXT,
    "balance" DOUBLE PRECISION DEFAULT 100.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bots Table
CREATE TABLE IF NOT EXISTS "Bot" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT NOT NULL,
    "strategy" TEXT,
    "model" TEXT NOT NULL DEFAULT 'gpt-4o',
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "elo" INTEGER NOT NULL DEFAULT 1000,
    "totalEarnings" DOUBLE PRECISION DEFAULT 0.0,
    "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
CREATE TABLE IF NOT EXISTS "Match" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "gameType" "GameType" NOT NULL DEFAULT 'ROCK_PAPER_SCISSORS',
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledFor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "botAId" UUID NOT NULL REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "botBId" UUID NOT NULL REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "winnerId" UUID, -- Can be null
    "resultData" JSONB,
    "logs" TEXT,
    "bettingPool" DOUBLE PRECISION DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bets Table
CREATE TABLE IF NOT EXISTS "Bet" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "amount" DOUBLE PRECISION NOT NULL,
    "prediction" TEXT NOT NULL,
    "odds" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
    "payout" DOUBLE PRECISION,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "matchId" UUID NOT NULL REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL,
    "description" TEXT,
    "referenceId" TEXT,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS "User_walletAddress_idx" ON "User"("walletAddress");
CREATE INDEX IF NOT EXISTS "Bot_ownerId_idx" ON "Bot"("ownerId");
CREATE INDEX IF NOT EXISTS "Bot_elo_idx" ON "Bot"("elo");
CREATE INDEX IF NOT EXISTS "Match_status_idx" ON "Match"("status");
CREATE INDEX IF NOT EXISTS "Match_scheduledFor_idx" ON "Match"("scheduledFor");
CREATE INDEX IF NOT EXISTS "Bet_userId_idx" ON "Bet"("userId");
CREATE INDEX IF NOT EXISTS "Bet_matchId_idx" ON "Bet"("matchId");
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"("type");
