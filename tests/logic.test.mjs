import assert from "node:assert/strict";
import {
  calculateRound,
  chooseLanguage,
  computeNarrativeScore,
  rankFromXp,
  resolvePrediction,
  shouldApplyDetectedLanguage,
  updateMissionProgress,
} from "../src/logic.mjs";

assert.equal(chooseLanguage({ countryCode: "CN", browserLanguage: "en-US" }), "zh");
assert.equal(chooseLanguage({ countryCode: "JP", browserLanguage: "en-US" }), "ja");
assert.equal(chooseLanguage({ countryCode: "BR", browserLanguage: "ko-KR" }), "ko");
assert.equal(chooseLanguage({ countryCode: "DE", browserLanguage: "fr-FR" }), "en");
assert.equal(shouldApplyDetectedLanguage({ hasManualPreference: false, requestId: 2, activeRequestId: 2 }), true);
assert.equal(shouldApplyDetectedLanguage({ hasManualPreference: true, requestId: 2, activeRequestId: 2 }), false);
assert.equal(shouldApplyDetectedLanguage({ hasManualPreference: false, requestId: 1, activeRequestId: 2 }), false);

const narrative = computeNarrativeScore({
  momentum: 74,
  social: 62,
  volatility: 41,
  whaleFlow: 68,
});
assert.equal(narrative.score, 63);
assert.equal(narrative.tier, "hot");

const bullWin = resolvePrediction({
  choice: "bull",
  sentiment: 71,
  volatility: 30,
  whaleFlow: 67,
  seed: 7,
});
assert.equal(bullWin.outcome, "win");
assert.equal(bullWin.delta, 6);

const bearLoss = resolvePrediction({
  choice: "bear",
  sentiment: 72,
  volatility: 35,
  whaleFlow: 64,
  seed: 4,
});
assert.equal(bearLoss.outcome, "loss");
assert.equal(bearLoss.delta, -5);

const round = calculateRound({
  choice: "bull",
  budget: 120,
  confidence: 3,
  balance: 1000,
  signal: { sentiment: 76, volatility: 28, whaleFlow: 74 },
  seed: 9,
});
assert.equal(round.outcome, "win");
assert.equal(round.pnl, 144);
assert.equal(round.nextBalance, 1144);
assert.equal(round.xp, 42);
assert.equal(round.highRiskEvent, false);

const riskyRound = calculateRound({
  choice: "bull",
  budget: 180,
  confidence: 5,
  balance: 1000,
  signal: { sentiment: 28, volatility: 86, whaleFlow: 22 },
  seed: 2,
});
assert.equal(riskyRound.outcome, "loss");
assert.equal(riskyRound.pnl, -180);
assert.equal(riskyRound.nextBalance, 820);
assert.equal(riskyRound.highRiskEvent, true);

assert.deepEqual(rankFromXp(0), { label: "Signal Rookie", level: 1, next: 80 });
assert.deepEqual(rankFromXp(190), { label: "Narrative Hunter", level: 3, next: 320 });

const missions = updateMissionProgress(
  [
    { id: "firstWin", type: "win", target: 1, progress: 0, reward: 25 },
    { id: "highConfidence", type: "confidence", target: 2, progress: 1, reward: 40 },
  ],
  { outcome: "win", confidence: 5 }
);
assert.equal(missions.completed.length, 2);
assert.equal(missions.reward, 65);
assert.equal(missions.items[0].progress, 1);
assert.equal(missions.items[1].progress, 2);

console.log("logic tests passed");
