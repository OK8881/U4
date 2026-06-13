const COUNTRY_LANGUAGE = {
  CN: "zh",
  HK: "zh",
  MO: "zh",
  TW: "zh",
  SG: "zh",
  JP: "ja",
  KR: "ko",
};

const SUPPORTED = new Set(["en", "zh", "ja", "ko"]);

export function chooseLanguage({ countryCode, browserLanguage } = {}) {
  const country = String(countryCode || "").trim().toUpperCase();
  if (COUNTRY_LANGUAGE[country]) return COUNTRY_LANGUAGE[country];

  const browser = String(browserLanguage || "").toLowerCase();
  const prefix = browser.split(/[-_]/)[0];
  return SUPPORTED.has(prefix) ? prefix : "en";
}

export function shouldApplyDetectedLanguage({
  hasManualPreference = false,
  requestId = 0,
  activeRequestId = 0,
} = {}) {
  return !hasManualPreference && requestId === activeRequestId;
}

export function computeNarrativeScore({
  momentum = 0,
  social = 0,
  volatility = 0,
  whaleFlow = 0,
} = {}) {
  const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0));
  const score = Math.floor(
    clamp(momentum) * 0.35 +
      clamp(social) * 0.25 +
      clamp(whaleFlow) * 0.3 +
      clamp(volatility) * 0.05
  );

  let tier = "cold";
  if (score >= 72) tier = "mania";
  else if (score >= 58) tier = "hot";
  else if (score >= 42) tier = "watch";

  return { score, tier };
}

export function resolvePrediction({
  choice,
  sentiment = 50,
  volatility = 50,
  whaleFlow = 50,
  seed = Date.now(),
} = {}) {
  const normalizedChoice = choice === "bear" ? "bear" : "bull";
  const pulse =
    Number(sentiment) * 0.45 +
    Number(whaleFlow) * 0.35 -
    Number(volatility) * 0.2 +
    deterministicNoise(seed);
  const marketMove = pulse >= 47 ? "bull" : "bear";
  const outcome = marketMove === normalizedChoice ? "win" : "loss";
  const edge = Math.max(1, Math.min(9, Math.round(Math.abs(pulse - 35) / 3)));
  const delta = outcome === "win" ? edge : -edge;

  return { outcome, delta, marketMove, pulse: Math.round(pulse) };
}

export function calculateRound({
  choice,
  budget = 100,
  confidence = 1,
  balance = 1000,
  signal = {},
  seed = Date.now(),
} = {}) {
  const normalizedBudget = Math.max(10, Math.min(Number(budget) || 10, Number(balance) || 0));
  const normalizedConfidence = Math.max(1, Math.min(Number(confidence) || 1, 5));
  const prediction = resolvePrediction({ choice, ...signal, seed });
  const riskPressure = (Number(signal.volatility) || 0) * normalizedConfidence;
  const highRiskEvent = prediction.outcome === "loss" && riskPressure >= 360;
  const winRate = prediction.outcome === "win" ? 0.4 : -0.32;
  const pnl = highRiskEvent
    ? -Math.round(normalizedBudget)
    : Math.round(normalizedBudget * normalizedConfidence * winRate);
  const nextBalance = Math.max(0, Math.round((Number(balance) || 0) + pnl));
  const xp =
    prediction.outcome === "win"
      ? Math.round(18 + normalizedConfidence * 8)
      : highRiskEvent
        ? 4
        : 8;

  return {
    ...prediction,
    budget: normalizedBudget,
    confidence: normalizedConfidence,
    highRiskEvent,
    pnl,
    nextBalance,
    xp,
  };
}

export function rankFromXp(xp = 0) {
  const value = Math.max(0, Number(xp) || 0);
  if (value >= 520) return { label: "Whale Whisperer", level: 5, next: 800 };
  if (value >= 320) return { label: "Risk Architect", level: 4, next: 520 };
  if (value >= 160) return { label: "Narrative Hunter", level: 3, next: 320 };
  if (value >= 80) return { label: "Pulse Scout", level: 2, next: 160 };
  return { label: "Signal Rookie", level: 1, next: 80 };
}

export function updateMissionProgress(missions = [], event = {}) {
  const completed = [];
  let reward = 0;
  const items = missions.map((mission) => {
    const wasComplete = mission.progress >= mission.target;
    let progress = mission.progress;

    if (!wasComplete && missionMatches(mission, event)) {
      progress = Math.min(mission.target, progress + 1);
    }

    const isComplete = progress >= mission.target;
    if (!wasComplete && isComplete) {
      completed.push(mission.id);
      reward += mission.reward || 0;
    }

    return { ...mission, progress };
  });

  return { items, completed, reward };
}

function missionMatches(mission, event) {
  if (mission.type === "win") return event.outcome === "win";
  if (mission.type === "confidence") return Number(event.confidence) >= 3;
  if (mission.type === "whale") return Number(event.whaleFlow) >= 70;
  if (mission.type === "risk") return event.highRiskEvent === false && Number(event.volatility) >= 65;
  return false;
}

export function deterministicNoise(seed) {
  const x = Math.sin(Number(seed) * 999.77) * 10000;
  return (x - Math.floor(x)) * 10 - 5;
}
