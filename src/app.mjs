import {
  calculateRound,
  chooseLanguage,
  computeNarrativeScore,
  rankFromXp,
  shouldApplyDetectedLanguage,
  updateMissionProgress,
} from "./logic.mjs";

const copy = {
  en: {
    language: "Language",
    bankroll: "Points",
    eyebrow: "Educational market sentiment lab",
    headline: "Explore market cycles.",
    lede: "Read neutral signals, compare narratives, and complete short simulation rounds for learning points.",
    start: "Start Lab",
    shuffle: "Refresh Signals",
    rank: "Rank",
    round: "Round",
    streak: "Streak",
    pulse: "Pulse",
    missionsEyebrow: "Learning goals",
    missionsTitle: "Complete neutral analysis tasks",
    radarEyebrow: "Narrative radar",
    radarTitle: "Choose a topic to inspect",
    scenarioEyebrow: "Scenario panel",
    scenarioTitle: "Set your confidence",
    momentum: "Momentum",
    social: "Social",
    volatility: "Volatility",
    whales: "Large-flow signal",
    budget: "Point budget",
    confidenceLow: "Low",
    confidenceMid: "Mid",
    confidenceHigh: "High",
    bull: "Expansion",
    bear: "Cooling",
    bullHint: "Signal improves",
    bearHint: "Signal cools",
    execute: "Run Simulation",
    roundHint: "Choose a scenario and run the learning simulation.",
    chartEyebrow: "Pulse path",
    chartTitle: "Scenario replay",
    alertsEyebrow: "Signal notes",
    alertsTitle: "Educational observations",
    timelineEyebrow: "Session log",
    timelineTitle: "Recent simulations",
    win: "{name} scenario: {move}. Points {pnl}. XP +{xp}.",
    loss: "{name} scenario: {move}. Points {pnl}. XP +{xp}.",
    highRisk: "High volatility reduced the score. This is an educational simulation only.",
    emptyLog: "No simulations yet. Start with a neutral scenario.",
    missionWin: "Complete one accurate scenario",
    missionLev: "Use medium or high confidence twice",
    missionWhale: "Inspect a strong large-flow signal",
    missionRisk: "Analyze a high-volatility topic",
    disclaimer:
      "Educational simulation only. No financial advice, no real-money transactions, and no promise of results.",
  },
  zh: {
    language: "语言",
    bankroll: "积分",
    eyebrow: "市场情绪教育实验室",
    headline: "探索市场周期。",
    lede: "读取中性信号，比较不同叙事，用短回合模拟学习市场情绪。",
    start: "开始体验",
    shuffle: "刷新信号",
    rank: "段位",
    round: "回合",
    streak: "连击",
    pulse: "脉冲",
    missionsEyebrow: "学习目标",
    missionsTitle: "完成中性分析任务",
    radarEyebrow: "叙事雷达",
    radarTitle: "选择一个主题查看",
    scenarioEyebrow: "场景面板",
    scenarioTitle: "设置你的判断强度",
    momentum: "动量",
    social: "社交热度",
    volatility: "波动率",
    whales: "大额流向信号",
    budget: "积分预算",
    confidenceLow: "低",
    confidenceMid: "中",
    confidenceHigh: "高",
    bull: "扩张",
    bear: "冷却",
    bullHint: "信号增强",
    bearHint: "信号降温",
    execute: "运行模拟",
    roundHint: "选择一个场景，再运行学习模拟。",
    chartEyebrow: "脉冲路径",
    chartTitle: "场景回放",
    alertsEyebrow: "信号笔记",
    alertsTitle: "教育观察",
    timelineEyebrow: "体验日志",
    timelineTitle: "最近模拟",
    win: "{name} 场景：{move}。积分 {pnl}。XP +{xp}。",
    loss: "{name} 场景：{move}。积分 {pnl}。XP +{xp}。",
    highRisk: "高波动降低了本轮得分。这里只是教育模拟。",
    emptyLog: "还没有模拟。先开始一个中性场景。",
    missionWin: "完成一次准确场景",
    missionLev: "使用中/高判断强度两次",
    missionWhale: "查看大额流向较强的主题",
    missionRisk: "分析一个高波动主题",
    disclaimer: "仅用于教育模拟。不构成财务建议，不涉及真实资产操作，也不承诺任何结果。",
  },
  ja: {
    language: "言語",
    bankroll: "ポイント",
    eyebrow: "市場センチメント学習ラボ",
    headline: "市場サイクルを観察。",
    lede: "中立的なシグナルを読み、テーマを比較し、短い学習シミュレーションを行います。",
    start: "ラボ開始",
    shuffle: "更新",
    rank: "ランク",
    round: "ラウンド",
    streak: "連続",
    pulse: "パルス",
    missionsEyebrow: "学習目標",
    missionsTitle: "中立的な分析タスク",
    radarEyebrow: "ナラティブレーダー",
    radarTitle: "テーマを選択",
    scenarioEyebrow: "シナリオパネル",
    scenarioTitle: "判断強度を設定",
    momentum: "勢い",
    social: "話題性",
    volatility: "変動率",
    whales: "大口フロー信号",
    budget: "ポイント予算",
    confidenceLow: "低",
    confidenceMid: "中",
    confidenceHigh: "高",
    bull: "拡大",
    bear: "冷却",
    bullHint: "信号が改善",
    bearHint: "信号が低下",
    execute: "シミュレーション実行",
    roundHint: "シナリオを選んで学習シミュレーションを実行。",
    chartEyebrow: "パルス経路",
    chartTitle: "シナリオ再生",
    alertsEyebrow: "シグナルメモ",
    alertsTitle: "学習用観察",
    timelineEyebrow: "セッションログ",
    timelineTitle: "最近のシミュレーション",
    win: "{name} シナリオ：{move}。ポイント {pnl}。XP +{xp}。",
    loss: "{name} シナリオ：{move}。ポイント {pnl}。XP +{xp}。",
    highRisk: "高い変動によりスコアが低下。これは学習用シミュレーションです。",
    emptyLog: "まだシミュレーションはありません。",
    missionWin: "正確なシナリオを1回完了",
    missionLev: "中/高の判断強度を2回使用",
    missionWhale: "大口フロー信号の強いテーマを確認",
    missionRisk: "高変動テーマを分析",
    disclaimer:
      "教育用シミュレーションのみ。金融助言、実際の資金取引、結果の保証はありません。",
  },
  ko: {
    language: "언어",
    bankroll: "포인트",
    eyebrow: "시장 심리 학습 랩",
    headline: "시장 사이클 탐색.",
    lede: "중립 신호를 읽고 주제를 비교하며 짧은 학습 시뮬레이션을 진행하세요.",
    start: "랩 시작",
    shuffle: "신호 갱신",
    rank: "랭크",
    round: "라운드",
    streak: "연속",
    pulse: "펄스",
    missionsEyebrow: "학습 목표",
    missionsTitle: "중립 분석 과제 완료",
    radarEyebrow: "내러티브 레이더",
    radarTitle: "검토할 주제 선택",
    scenarioEyebrow: "시나리오 패널",
    scenarioTitle: "판단 강도 설정",
    momentum: "모멘텀",
    social: "소셜",
    volatility: "변동성",
    whales: "대규모 흐름 신호",
    budget: "포인트 예산",
    confidenceLow: "낮음",
    confidenceMid: "중간",
    confidenceHigh: "높음",
    bull: "확장",
    bear: "냉각",
    bullHint: "신호 개선",
    bearHint: "신호 둔화",
    execute: "시뮬레이션 실행",
    roundHint: "시나리오를 선택하고 학습 시뮬레이션을 실행하세요.",
    chartEyebrow: "펄스 경로",
    chartTitle: "시나리오 리플레이",
    alertsEyebrow: "신호 메모",
    alertsTitle: "교육용 관찰",
    timelineEyebrow: "세션 로그",
    timelineTitle: "최근 시뮬레이션",
    win: "{name} 시나리오: {move}. 포인트 {pnl}. XP +{xp}.",
    loss: "{name} 시나리오: {move}. 포인트 {pnl}. XP +{xp}.",
    highRisk: "높은 변동성으로 점수가 낮아졌습니다. 학습용 시뮬레이션입니다.",
    emptyLog: "아직 시뮬레이션이 없습니다.",
    missionWin: "정확한 시나리오 1회 완료",
    missionLev: "중/고 판단 강도 두 번 사용",
    missionWhale: "대규모 흐름 신호가 강한 주제 확인",
    missionRisk: "고변동 주제 분석",
    disclaimer: "교육용 시뮬레이션입니다. 금융 조언, 실제 자금 거래, 결과 보장은 없습니다.",
  },
};

const narratives = [
  { id: "btc", name: "BTC", x: 52, y: 31, momentum: 72, social: 58, volatility: 34, whaleFlow: 74 },
  { id: "eth", name: "ETH", x: 69, y: 54, momentum: 66, social: 62, volatility: 43, whaleFlow: 61 },
  { id: "sol", name: "SOL", x: 31, y: 53, momentum: 81, social: 71, volatility: 64, whaleFlow: 55 },
  { id: "ai", name: "AI", x: 76, y: 25, momentum: 84, social: 84, volatility: 67, whaleFlow: 49 },
  { id: "meme", name: "MEME", x: 25, y: 77, momentum: 71, social: 91, volatility: 84, whaleFlow: 38 },
  { id: "rwa", name: "RWA", x: 52, y: 78, momentum: 58, social: 46, volatility: 30, whaleFlow: 67 },
  { id: "defi", name: "DeFi", x: 82, y: 73, momentum: 63, social: 51, volatility: 47, whaleFlow: 68 },
  { id: "gaming", name: "GAME", x: 43, y: 63, momentum: 69, social: 75, volatility: 59, whaleFlow: 44 },
];

const eventFeeds = {
  en: [
    ["BTC", "Long-term holder activity changed"],
    ["ETH", "Layer-2 activity increased"],
    ["SOL", "Network attention moved higher"],
    ["AI", "Topic mentions accelerated"],
    ["MEME", "Retail attention entered a high-risk zone"],
    ["RWA", "Tokenized-asset discussion rotated higher"],
    ["DeFi", "Liquidity discussion returned"],
    ["GAME", "On-chain user activity reached a weekly high"],
  ],
  zh: [
    ["BTC", "长期持有者活动出现变化"],
    ["ETH", "二层活动有所提升"],
    ["SOL", "网络关注度上移"],
    ["AI", "主题提及速度加快"],
    ["MEME", "散户关注进入高风险区"],
    ["RWA", "代币化资产讨论升温"],
    ["DeFi", "流动性讨论回归"],
    ["GAME", "链上用户活动达到周内高位"],
  ],
  ja: [
    ["BTC", "長期保有者の活動に変化"],
    ["ETH", "レイヤー2活動が増加"],
    ["SOL", "ネットワーク注目度が上昇"],
    ["AI", "テーマ言及が加速"],
    ["MEME", "個人投資家の注目が高リスク域"],
    ["RWA", "トークン化資産の議論が上昇"],
    ["DeFi", "流動性の議論が戻る"],
    ["GAME", "オンチェーン利用が週内高水準"],
  ],
  ko: [
    ["BTC", "장기 보유자 활동 변화"],
    ["ETH", "레이어2 활동 증가"],
    ["SOL", "네트워크 관심 상승"],
    ["AI", "주제 언급 속도 증가"],
    ["MEME", "개인 관심이 고위험 구간 진입"],
    ["RWA", "토큰화 자산 논의 상승"],
    ["DeFi", "유동성 논의 회복"],
    ["GAME", "온체인 사용자 활동 주간 고점"],
  ],
};

let language = "en";
let selected = narratives[0];
let selectedDirection = "bull";
let confidence = 1;
let balance = 1000;
let xp = 0;
let streak = 0;
let round = 1;
let seed = 11;
let languageDetectionRequestId = 0;
let lastResult = null;
let log = [];
let missions = [
  { id: "firstWin", type: "win", target: 1, progress: 0, reward: 25, key: "missionWin" },
  { id: "highConfidence", type: "confidence", target: 2, progress: 0, reward: 40, key: "missionLev" },
  { id: "flowRead", type: "whale", target: 1, progress: 0, reward: 35, key: "missionWhale" },
  { id: "riskReview", type: "risk", target: 1, progress: 0, reward: 45, key: "missionRisk" },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

init();

function init() {
  renderRadar();
  bindEvents();
  startBackgroundCanvas();
  startClock();
  drawChart();
  updateAlerts();
  updateTimeline();

  const saved = localStorage.getItem("cryptoPulseLanguage");
  language = saved || chooseLanguage({ browserLanguage: navigator.language });
  applyLanguage(language);
  detectLanguageByIp();
  updateSelected(narratives[0]);
  renderAccount();
}

function bindEvents() {
  $("#language-select").addEventListener("change", (event) => {
    language = event.target.value;
    localStorage.setItem("cryptoPulseLanguage", language);
    applyLanguage(language);
  });

  $("#shuffle-btn").addEventListener("click", () => {
    pulseMarket();
    updateSelected(selected);
    updateAlerts();
    drawChart();
  });

  $("#budget-slider").addEventListener("input", updateBudgetLabel);

  $$(".lev-button").forEach((button) => {
    button.addEventListener("click", () => {
      confidence = Number(button.dataset.lev);
      $$(".lev-button").forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });

  $$(".direction-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDirection = button.dataset.direction;
      $$(".direction-button").forEach((item) =>
        item.classList.toggle("is-active", item.dataset.direction === selectedDirection)
      );
    });
  });

  $("#execute-btn").addEventListener("click", executeRound);
}

async function detectLanguageByIp() {
  const requestId = ++languageDetectionRequestId;
  if (localStorage.getItem("cryptoPulseLanguage")) return;
  try {
    const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (
      !shouldApplyDetectedLanguage({
        hasManualPreference: Boolean(localStorage.getItem("cryptoPulseLanguage")),
        requestId,
        activeRequestId: languageDetectionRequestId,
      })
    ) {
      return;
    }
    language = chooseLanguage({ countryCode: data.country_code, browserLanguage: navigator.language });
    applyLanguage(language);
  } catch {
    // Browser-language fallback is already active.
  }
}

function applyLanguage(nextLanguage) {
  const dictionary = copy[nextLanguage] || copy.en;
  document.documentElement.lang = nextLanguage;
  $("#language-select").value = nextLanguage;
  $$("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key]) node.textContent = dictionary[key];
  });
  if (lastResult) renderResult(lastResult);
  updateTimeline();
  renderMissions();
  renderAccount();
  updateAlerts();
}

function renderRadar() {
  const radar = $("#radar");
  radar.innerHTML = "";
  for (const item of narratives) {
    const computed = computeNarrativeScore(item);
    const button = document.createElement("button");
    button.className = "narrative-node";
    button.type = "button";
    button.style.left = `${item.x}%`;
    button.style.top = `${item.y}%`;
    button.setAttribute("aria-pressed", item.id === selected.id ? "true" : "false");
    button.innerHTML = `<span class="node-symbol">${item.name}</span><span class="node-score">${computed.score}</span>`;
    button.addEventListener("click", () => updateSelected(item));
    radar.append(button);
  }
}

function updateSelected(item) {
  selected = item;
  const computed = computeNarrativeScore(item);
  $("#selected-name").textContent = item.name;
  $("#selected-score").textContent = computed.score;
  $("#selected-tier").textContent = computed.tier.toUpperCase();

  for (const key of ["momentum", "social", "volatility", "whaleFlow"]) {
    $(`#metric-${key}`).value = item[key];
    $(`#metric-${key}-value`).textContent = item[key];
  }

  updatePulseIndex();
  renderRadar();
  drawChart();
}

function executeRound() {
  const pointBudget = Number($("#budget-slider").value);
  const result = calculateRound({
    choice: selectedDirection,
    budget: pointBudget,
    confidence,
    balance,
    signal: {
      sentiment: selected.momentum,
      volatility: selected.volatility,
      whaleFlow: selected.whaleFlow,
    },
    seed: seed++,
  });

  balance = result.nextBalance;
  xp += result.xp;
  streak = result.outcome === "win" ? streak + 1 : 0;
  round += 1;

  const missionEvent = {
    ...result,
    whaleFlow: selected.whaleFlow,
    volatility: selected.volatility,
  };
  const missionResult = updateMissionProgress(missions, missionEvent);
  missions = missionResult.items;
  xp += missionResult.reward;

  lastResult = { ...result, name: selected.name, missionReward: missionResult.reward };
  log.unshift(lastResult);
  log = log.slice(0, 5);

  renderResult(lastResult);
  renderAccount();
  renderMissions();
  updateTimeline();
  pulseMarket();
  updateSelected(selected);
  updateAlerts();
  drawChart(lastResult);
}

function renderResult(result) {
  const dictionary = copy[language] || copy.en;
  const text = template(dictionary[result.outcome], {
    name: result.name,
    move: scenarioLabel(result.marketMove),
    pnl: formatPoints(result.pnl),
    xp: result.xp + (result.missionReward || 0),
  });
  $("#round-result").textContent = result.highRiskEvent ? `${text} ${dictionary.highRisk}` : text;
  $("#round-result").classList.toggle("is-win", result.outcome === "win");
  $("#round-result").classList.toggle("is-loss", result.outcome === "loss");
}

function renderAccount() {
  const rank = rankFromXp(xp);
  const progress = Math.min(100, Math.round((xp / rank.next) * 100));
  $("#top-balance").textContent = formatPoints(balance);
  $("#rank-label").textContent = localizedRank(rank.label);
  $("#xp-value").textContent = xp;
  $("#xp-next").textContent = rank.next;
  $("#xp-bar").style.width = `${progress}%`;
  $("#round-count").textContent = round;
  $("#streak-count").textContent = streak;
  updateBudgetLabel();
}

function renderMissions() {
  const dictionary = copy[language] || copy.en;
  const list = $("#mission-list");
  list.innerHTML = "";
  for (const mission of missions) {
    const done = mission.progress >= mission.target;
    const item = document.createElement("div");
    item.className = "mission-card";
    item.classList.toggle("is-complete", done);
    item.innerHTML = `
      <strong>${dictionary[mission.key]}</strong>
      <span>${mission.progress}/${mission.target} · XP +${mission.reward}</span>
      <div class="mission-track"><i style="width:${Math.min(100, (mission.progress / mission.target) * 100)}%"></i></div>
    `;
    list.append(item);
  }
}

function updateTimeline() {
  const dictionary = copy[language] || copy.en;
  const list = $("#timeline-list");
  list.innerHTML = "";
  if (log.length === 0) {
    const item = document.createElement("li");
    item.textContent = dictionary.emptyLog;
    list.append(item);
    return;
  }
  for (const item of log) {
    const row = document.createElement("li");
    row.innerHTML = `<strong>${item.name} ${scenarioLabel(item.marketMove)}</strong><span>${formatPoints(item.pnl)} · XP +${item.xp + (item.missionReward || 0)}</span>`;
    list.append(row);
  }
}

function updatePulseIndex() {
  const average = Math.round(
    narratives.map(computeNarrativeScore).reduce((sum, item) => sum + item.score, 0) / narratives.length
  );
  $("#pulse-index").textContent = average;
}

function updateBudgetLabel() {
  const slider = $("#budget-slider");
  const max = Math.max(40, Math.min(300, Math.floor(balance / 2)));
  slider.max = max;
  if (Number(slider.value) > max) slider.value = max;
  $("#budget-value").textContent = formatPoints(Number(slider.value));
}

function updateAlerts() {
  const list = $("#alerts-list");
  list.innerHTML = "";
  const eventFeed = eventFeeds[language] || eventFeeds.en;
  const offset = seed % eventFeed.length;
  for (let index = 0; index < 5; index++) {
    const [symbol, text] = eventFeed[(index + offset) % eventFeed.length];
    const item = document.createElement("li");
    item.innerHTML = `<strong>${symbol}</strong><span>${text}</span>`;
    list.append(item);
  }
}

function pulseMarket() {
  for (const item of narratives) {
    item.momentum = drift(item.momentum, 18);
    item.social = drift(item.social, 22);
    item.volatility = drift(item.volatility, 20);
    item.whaleFlow = drift(item.whaleFlow, 18);
    item.x = drift(item.x, 10, 16, 84);
    item.y = drift(item.y, 10, 18, 82);
  }
}

function drawChart(result = lastResult) {
  const canvas = $("#chart-canvas");
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(8, 12, 14, 0.92)";
  context.fillRect(0, 0, width, height);

  for (let x = 0; x < width; x += 48) {
    context.strokeStyle = "rgba(255,255,255,0.06)";
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y < height; y += 42) {
    context.strokeStyle = "rgba(255,255,255,0.06)";
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  const direction = result?.marketMove === "bear" ? -1 : 1;
  const color = result?.outcome === "loss" ? "#ff5f79" : "#4be09d";
  context.strokeStyle = color;
  context.lineWidth = 4;
  context.beginPath();
  for (let index = 0; index < 32; index++) {
    const x = (index / 31) * width;
    const wave = Math.sin(index * 0.8 + seed) * 24 + Math.cos(index * 0.35) * 16;
    const trend = direction * (index - 16) * 2.2;
    const y = height / 2 - trend - wave;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

function startClock() {
  const tick = () => {
    $("#market-clock").textContent = `${new Date().toISOString().slice(11, 19)} UTC`;
  };
  tick();
  setInterval(tick, 1000);
}

function startBackgroundCanvas() {
  const canvas = $("#pulse-canvas");
  const context = canvas.getContext("2d");
  const particles = Array.from({ length: 110 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.6 + Math.random() * 1.8,
    vx: (Math.random() - 0.5) * 0.0008,
    vy: (Math.random() - 0.5) * 0.0008,
    hue: [42, 150, 190, 330][index % 4],
  }));

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
    canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "lighter";
    particles.forEach((particle, index) => {
      particle.x = (particle.x + particle.vx + 1) % 1;
      particle.y = (particle.y + particle.vy + 1) % 1;
      const x = particle.x * canvas.width;
      const y = particle.y * canvas.height;
      context.fillStyle = `hsla(${particle.hue}, 90%, 62%, 0.42)`;
      context.beginPath();
      context.arc(x, y, particle.r * devicePixelRatio, 0, Math.PI * 2);
      context.fill();
      for (let j = index + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = x - other.x * canvas.width;
        const dy = y - other.y * canvas.height;
        const distance = Math.hypot(dx, dy);
        if (distance < 120 * devicePixelRatio) {
          context.strokeStyle = `rgba(245, 184, 75, ${0.1 - distance / (1400 * devicePixelRatio)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(other.x * canvas.width, other.y * canvas.height);
          context.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function drift(value, range, min = 18, max = 92) {
  return Math.round(Math.max(min, Math.min(max, value + (Math.random() - 0.5) * range)));
}

function formatPoints(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
}

function scenarioLabel(move) {
  if (language === "zh") return move === "bull" ? "扩张" : "冷却";
  if (language === "ja") return move === "bull" ? "拡大" : "冷却";
  if (language === "ko") return move === "bull" ? "확장" : "냉각";
  return move === "bull" ? "Expansion" : "Cooling";
}

function localizedRank(label) {
  const ranks = {
    zh: {
      "Signal Rookie": "信号新手",
      "Pulse Scout": "脉冲观察员",
      "Narrative Hunter": "叙事研究员",
      "Risk Architect": "风险分析师",
      "Whale Whisperer": "大额流向观察员",
    },
    ja: {
      "Signal Rookie": "シグナル初心者",
      "Pulse Scout": "パルス観察者",
      "Narrative Hunter": "テーマ研究者",
      "Risk Architect": "リスク分析者",
      "Whale Whisperer": "大口フロー観察者",
    },
    ko: {
      "Signal Rookie": "신호 입문자",
      "Pulse Scout": "펄스 관찰자",
      "Narrative Hunter": "내러티브 연구자",
      "Risk Architect": "리스크 분석가",
      "Whale Whisperer": "대규모 흐름 관찰자",
    },
  };
  return ranks[language]?.[label] || label;
}

function template(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}
