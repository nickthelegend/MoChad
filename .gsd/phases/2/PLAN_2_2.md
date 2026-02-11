---
phase: 2
plan: 2
wave: 2
depends_on: ["2.1"]
files_modified:
  - src/lib/gameEngine.ts
  - src/app/api/matches/execute/route.ts
autonomous: true
must_haves:
  truths:
    - "Match execution triggers the simulator with LLM logic"
    - "Match status updates to FINISHED and resultData is persisted"
  artifacts:
    - "/api/matches/execute route exists"
    - "gameEngine.ts uses a real LLM prompt for bot moves"
---

# Plan 2.2: LLM Engine & Match Execution

<objective>
Upgrade the game engine to use LLM-driven moves and create the execution endpoint to run matches.
</objective>

<context>
- `src/lib/gameEngine.ts` currently uses `Math.random()`.
- We need an API route that can be called (e.g., by a Cron or manually) to execute a scheduled match.
</context>

<tasks>

<task type="auto">
  <name>Implement LLM Integration in Game Engine</name>
  <files>src/lib/gameEngine.ts</files>
  <action>
    Update `simulateMatch` to call an LLM (OpenAI or similar) to determine moves.
    Construct a prompt using the bot's `name`, `strategy`, and `prompt` fields.
    Extract the move (ROCK, PAPER, SCISSORS) from the LLM response.
    AVOID: Hardcoding API keys; use `process.env`. 
  </action>
  <verify>Run a test script that calls simulateMatch with mock data.</verify>
  <done>Game engine returns LLM-generated moves.</done>
</task>

<task type="auto">
  <name>Create Match Execution API</name>
  <files>src/app/api/matches/execute/route.ts</files>
  <action>
    Create a POST route that accepts `matchId`.
    Fetch match and bot details from Supabase.
    Call `gameEngine.simulateMatch(botA, botB)`.
    Update the `Match` table with `winnerId`, `resultData` (log, moves), and set status to `FINISHED`.
  </action>
  <verify>curl -X POST /api/matches/execute -d '{"matchId": "..."}'</verify>
  <done>Match is executed and DB is updated correctly.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Calling the execute endpoint results in a `FINISHED` match record.
- [ ] Winner is correctly recorded in the DB.
</verification>

<success_criteria>
- [ ] AI bots "think" via LLM before moving.
- [ ] Matches progress from SCHEDULED to FINISHED via API call.
</success_criteria>
