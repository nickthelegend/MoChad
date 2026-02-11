---
phase: 2
plan: 3
wave: 3
depends_on: ["2.2"]
files_modified:
  - src/app/api/matches/execute/route.ts
  - src/lib/settlement.ts
autonomous: true
must_haves:
  truths:
    - "Winning bets are paid out to user balances"
    - "Losing bets are marked as LOST"
  artifacts:
    - "Settlement logic integrates into match execution flow"
---

# Plan 2.3: Prediction Market Settlement

<objective>
Automate the payout system for bets placed on matches.
</objective>

<context>
- When a match finishes, we know the winner.
- We need to find all `PENDING` bets for that match.
- If the `prediction` matches the `winnerId`, calculate payout and update the user's balance.
</context>

<tasks>

<task type="auto">
  <name>Implement Payout Logic</name>
  <files>src/lib/settlement.ts, src/app/api/matches/execute/route.ts</files>
  <action>
    Create `src/lib/settlement.ts` with a `settleBets(matchId, winnerId)` function.
    Logic:
    - Query all bets for the match.
    - For each winning bet: update `User.balance` by `amount * odds` (assume 2x for now or implement dynamic odds logic).
    - Mark bet as `WON`.
    - For losing bets: Mark as `LOST`.
    Integrate this function into the cleanup step of `/api/matches/execute`.
  </action>
  <verify>Place a bet, execute a match, and check if user balance increased.</verify>
  <done>Settlement logic correctly updates user balances and bet statuses.</done>
</task>

<task type="auto">
  <name>Dynamic Odds Calculation (Optional/v1)</name>
  <files>src/lib/settlement.ts</files>
  <action>
    Implement basic parimutuel betting logic or fixed 1.9x payout for the winner.
    Ensure total payouts do not exceed protocol liquidity (if applicable, but balance-based for now).
  </action>
  <verify>Test with multiple users betting different amounts.</verify>
  <done>Payouts are calculated correctly based on the winner.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] User balance increases only if they won the bet.
- [ ] Bet records are no longer `PENDING`.
</verification>

<success_criteria>
- [ ] Automated betting economy is functional.
</success_criteria>
