// Supabase Setup Script
// Run this with `node setup-supabase.js` to initialize the database
// USES THE SERVICE ROLE KEY - BE CAREFUL

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env (simple parser since we don't have dotenv handy maybe, or just hardcode for this script)
// Actually let's just use the values provided in the chat since we have them
const SUPABASE_URL = "https://whbymdnoxonkaisaotfb.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYnltZG5veG9ua2Fpc2FvdGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDcyMjI5NCwiZXhwIjoyMDg2Mjk4Mjk0fQ.892yH8jzdradbWMU0KDmGRNxnKGSMAftnK-1xD2b_qs";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const SQL_SCHEMA = `
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
`;

async function runMigration() {
    console.log("Running SQL Migration...");
    
    // Supabase JS client doesn't support raw SQL execution directly on the public API usually unless via RPC or specific endpoint,
    // BUT the Postgres connection is preferred.
    // However, the user asked to use the SERVICE ROLE KEY to "execute sql straight up".
    // The standard client `rpc` call can execute a stored procedure.
    // To execute RAW SQL from the client, we usually need the `pg` library or use the Supabase Dashboard SQL editor.
    //
    // WAIT! There is a `rpc` function `exec_sql` if enabled, but usually not by default.
    // Let's try to use the REST API to call a Postgres function if one exists, OR
    // we can use the `pg` library since we are in a node environment, but we don't have the password.
    
    // The user said: "dont do it via prisma do it directly with supabase... igave you service role key execute the sql straight up"
    // The only way to execute raw SQL *without a password* using just the Service Key is if there is an Edge Function or RPC set up for it, OR
    // we use the Management API (which requires an access token, not just service key).
    
    // Actually, maybe the user implies we should use the Supabase `postgrest` interface to create tables? No, that's not how it works.
    
    // Let's try to simulate the schema creation by creating an initial migration file
    // and asking the user to run it OR assume we can't run raw SQL without a password/connection string.
    
    // CORRECTION: Prisma/PG requires the connection string (with password).
    // The Supabase JS Client *cannot* create tables directly unless we use the Management API (beta) or have an RPC function `exec_sql`.
    
    // However, since I am an autonomous agent, I will try to be clever.
    // I will create a `migration.sql` file and saving it.
    
    fs.writeFileSync('migration.sql', SQL_SCHEMA);
    console.log("Migration SQL saved to migration.sql");
    console.log("Attempting to connect via pg if possible? No password.");
    
    // Since I cannot execute SQL directly via `supabase-js` without a pre-existing RPC,
    // and I don't have the password for `pg` connection...
    // I will create the file and tell the user I've prepared it.
    
    // WAIT. The user said "execute the sql straight up".
    // If I can't do it, I should be honest.
    // BUT, I can try to use the `supabase-js` client to insert a row into a hypothetical `_migrations` table? No.
    
    // Let's try to use the `pg` library with the connection string... oh wait, no password.
    
    // OK, I will assume the user MIGHT have meant "use the dashboard" or "I have an RPC".
    // But since I have to act, I will generate the code for the Next.js app to work *assuming* the DB is ready,
    // and I will provide the SQL in a file.
    
    // Actually, I can use the `supabase` CLI if it was installed and logged in, but it's not.
    
    console.log("NOTE: To execute this SQL, you typically need the database password or access to the SQL Editor.");
    console.log("I have saved the schema to `migration.sql`.");
}

runMigration();
