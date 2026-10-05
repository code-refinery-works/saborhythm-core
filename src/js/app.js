/* =====================================================
   SABORHYTHM — MAIN JS
   ===================================================== */

// ---- CONSTANTS ----
const BOT_PHRASES = [
  "やはりマイクロサービスの境界づけられたコンテキスト設計が本質だな…",
  "認知負荷の低減、これに尽きる。",
  "DDD × CQRSの組み合わせ、改めて考えさせられる。",
  "アウトカム思考でKPIを再定義する必要がある。メモメモ。",
  "技術的負債は複利で積み上がる。今日の判断が未来のスプリントを決める。",
  "オブザーバビリティなき本番環境は目隠し運転と同義。",
  "結局、コンウェイの法則に回帰する。組織設計がアーキテクチャを規定する。",
  "ドメインエキスパートとのコンテキスト共有、これが最大のボトルネックだ。",
  "サービスメッシュ導入のROI、今一度試算してみる価値がある。",
  "イミュータブルインフラストラクチャの哲学、深い。",
  "心理的安全性とデプロイ頻度は相関する。Accelerateの知見は正しかった。",
  "フィーチャーフラグ、使いこなせているチームとそうでないチームの差は歴然。",
  "カオスエンジニアリング、うちのチームに導入すべきか… 要検討。",
  "結局のところ、ソフトウェアは人が書く。人間系の問題が全ての根本。",
  "非同期コミュニケーション文化の醸成、一朝一夕にはいかない。",
  "プラットフォームエンジニアリング、開発者体験への投資は長期的に効く。",
];

const EXCUSE_TEMPLATES = {
  late: [
    "愛猫がキーボードの上で液体化して動かせないため、{N}分遅れます。",
    "ルンバが私の足首を捕食しようとしており、救出のため{N}分遅れます。",
    "隣家から漂う謎のカレーの香りで意識が飛んでおりました。{N}分お待ちください。",
    "朝の通勤ルートにカラスの縄張り争いが勃発し、迂回を余儀なくされました。遅延{N}分。",
    "スマートスピーカーが「おはようございます」を無限ループしており、電源を探すのに時間を要しました。",
    "ベランダのプランターが{N}月の強風で飛翔し、緊急回収作業が発生しました。",
  ],
  early: [
    "愛猫の定期健診が急遽ブッキングされました。17時に離席いたします。",
    "行政の申請書類の締切を本日と勘違いしており、15時に離脱させてください。",
    "宅配便が「本日中に再配達しないと宇宙に送る」という最終通告を受けております。",
    "自宅の Wi-Fi ルーターが爆発の前兆音（ピー音）を発しており、業者対応が必要です。",
    "歯医者を2ヶ月前に予約してそのまま忘れていたことを先ほど思い出しました。",
  ],
  away: [
    "ルンバが私の足首を捕食しようとしており、救出のため離席します。",
    "コーヒーメーカーが全力で抵抗しているため、交渉に10分いただきます。",
    "Zoom背景用の本棚が崩壊しました。復旧のため少々お時間を。",
    "宅急便の呼び鈴が聞こえないふりをし続けて3回目に心が折れました。",
    "立ち眩みが起き、一時横になります（5分以内に復帰します）。",
  ],
  mute: [
    "すみません！家のルーターが爆発しました！少々お待ちください！",
    "ﾌﾞﾂｯ…ｻﾞｻﾞ…… （※マイクが突然の死を迎えました。テキストで参加します）",
    "音声が聞こえていない模様です。ネコがマイクのミュートボタンを踏みました。",
    "オーディオドライバが自我に目覚めアップデートを開始したため、再起動します。5分お待ちを。",
  ],
  disconnect: [
    "すみません！家のルーターが爆発しました！Slackで継続します！",
    "回線が突如として哲学的な問いを発し始め、応答を停止しました。",
    "ISPから「本日は曇りのためパケットをお断りしております」との通知が届きました。",
    "マンションの共用回線が隣人の4Kゲーム配信に吸収されました。モバイル回線に切り替えます。",
  ],
};

const REPLY_TEMPLATES = [
  "すみません、今ちょうど顧客とのチャット対応中でして…！30分後には折り返せます！",
  "申し訳ないです、今まさに集中して設計ドキュメントを詰めているところで…！あと20分いただけますか？",
  "タイミングが悪く、今プルリクのレビューコメントに返信しているところです。少々お待ちを！",
  "今ちょっと本番のアラートを追っておりまして…！落ち着いたらすぐ連絡します！",
  "はい！少しだけお時間ください。今MTGのアクションアイテムをまとめていたので。",
  "了解です！今手が離せない状況でして、15分後でよろしいでしょうか？",
];

const TERMINAL_LINES = [
  "$ sudo systemctl restart saborhythm-daemon",
  "[  OK  ] Stopping Work Monitoring Agent...",
  "[  OK  ] Mounting Alibi Volume /dev/nap0...",
  "$ ./optimize_laziness.sh --level=MAX --stealth",
  "Scanning for boss presence... [██████████] 100% — CLEAR",
  "Injecting busy-signal into Slack API endpoint...",
  "AES-256 encrypting naptime_log_2024.db... done",
  "$ git commit -m 'refactor: definitely did real work'",
  "Activating VirtualCam module (nodding.mp4)...",
  "Boss-key latency: 42ms — within SLA (50ms)",
  "$ ps aux | grep 'System_Critical_Kernel_Update'",
  "root     1337  0.0  0.0  ACTIVE  System_Critical_Kernel_Update.exe",
  "Cognitive load nominal. Productivity index: MAXIMUM(FAKE)",
  "$ tail -f /var/log/saborhythm/alibi.log",
  "[INFO] Excuse generated: cat liquefied on keyboard",
  "[WARN] Boss approaching vector detected (probability: 12%)",
  "[INFO] Mouse jiggle pattern: 'deep-thinking-scroll' applied",
];

// ---- STATE ----
let typingCamoActive = false;
let typingIntervalId = null;
let typingPhrase = "";
let typingIdx = 0;
let typingCountdown = 0;
let typingCountdownId = null;
let typingErasing = false;

let botIntervalId = null;
let botCountdown = 60;
let botCountdownId = null;

let noddingCamActive = false;

let jigglerActive = false;
let jigglerRafId = null;
let jigglerX = 50, jigglerY = 60;
let jigglerVX = 0, jigglerVY = 0;
let jigglerTime = 0;
let jigglerStatusTimeout = null;

let bossKeyActive = false;
let termIntervalId = null;
let termLineIdx = 0;

let excuseHistory = [];

// ---- UPTIME / CLOCK ----
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('uptime-clock').textContent = `${h}:${m}:${s}`;

  const day = now.getDay();
  const hour = now.getHours();
  const dot = document.getElementById('uptime-dot');
  const label = document.getElementById('uptime-label');
  const isWeekend = (day === 0 || day === 6);
  const isFridayEvening = (day === 5 && hour >= 17);
  const isOutOfHours = (hour < 9 || hour >= 18);

  if (isWeekend || isFridayEvening) {
    dot.className = 'uptime-indicator red';
    label.textContent = '完全停止中 — システムメンテナンス（休日に仕事するな）';
  } else if (isOutOfHours) {
    dot.className = 'uptime-indicator';
    dot.style.background = '#f5a623';
    label.textContent = '業務時間外 — スタンバイモード';
  } else {
    dot.className = 'uptime-indicator';
    dot.style.background = '#4caf50';
    label.textContent = '稼働中 — 全システム正常運転';
  }
}
setInterval(updateClock, 1000);
updateClock();

// Footer day message
(function() {
  const msgs = {
    0: '☀️ 日曜日です。絶対に仕事するな。',
    1: '😔 月曜日… 生存するだけで十分です。',
    2: '🙂 火曜日。週の山場まで耐えろ。',
    3: '😐 水曜日。折り返し
地点です。',
    4: '😤 木曜日。明日が金曜日という希望を胸に。',
    5: '🎉 金曜日！17時まで生き延びろ！',
    6: '🎮 土曜日です。今日は全力でサボれ。',
  };
  const day = new Date().getDay();
  document.getElementById('footer-day-msg').textContent = msgs[day] || '';
})();

// ---- PROGRESS BAR (永遠に87%で止まる) ----
(function() {
  const bar = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-label');
  let pct = 0;
  const messages = [
    '処理中… 最適化しています…',
    'インデックス再構築中…',
    'キャッシュウォームアップ中…',
    '認知負荷を低減しています…',
    'マイクロサービス境界を調整中…',
    '本質的な何かを処理中…',
  ];
  let msgIdx = 0;
  const interval = setInterval(() => {
    if (pct < 87) {
      pct += Math.random() * 3;
      if (pct > 87) pct = 87;
      bar.style.width = pct.toFixed(1) + '%';
      bar.textContent = pct.toFixed(0) + '%';
    } else {
      // 87%で止まって微振動
      const jitter = (Math.random() - 0.5) * 0.4;
      bar.style.width = (87 + jitter).toFixed(2) + '%';
      bar.textContent = '87%';
      if (Math.random() < 0.05) {
        msgIdx = (msgIdx + 1) % messages.length;
        label.textContent = messages[msgIdx];
      }
    }
  }, 200);
})();

// ---- F-01: タイピング・カモフラージュ ----
function startTypingCamo() {
  if (typingCamoActive) return;
  typingCamoActive = true;
  document.getElementById('btn-typing-camo').textContent = '▶ 稼働中...';
  document.getElementById('btn-typing-camo').disabled = true;
  _nextTypingCycle();
}

function _nextTypingCycle() {
  if (!typingCamoActive) return;
  typingPhrase = TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)];
  typingIdx = 0;
  typingErasing = false;
  const display = document.getElementById('typing-display');
  display.textContent = '';
  document.getElementById('typing-status').textContent = '💬 入力中シグナル送信中...';

  // countdown 180s
  typingCountdown = 180;
  document.getElementById('typing-countdown').textContent = `次の送信キャンセルまで: ${typingCountdown}s`;

  clearInterval(typingIntervalId);
  typingIntervalId = setInterval(() => {
    if (!typingErasing) {
      if (typingIdx < typingPhrase.length) {
        typingIdx++;
        display.textContent = typingPhrase.slice(0, typingIdx) + '|';
      } else {
        // pause then erase
        setTimeout(() => {
          typingErasing = true;
        }, 2000);
      }
    } else {
      if (typingIdx > 0) {
        typingIdx--;
        display.textContent = typingPhrase.slice(0, typingIdx) + (typingIdx > 0 ? '|' : '');
      } else {
        display.textContent = '';
        clearInterval(typingIntervalId);
        document.getElementById('typing-status').textContent = '✅ 「長文を推敲の結果、送信をやめた思慮深い人」を演出完了';
        // next cycle after 8s
        setTimeout(_nextTypingCycle, 8000);
      }
    }
  }, 80);

  clearInterval(typingCountdownId);
  typingCountdownId = setInterval(() => {
    typingCountdown--;
    document.getElementById('typing-countdown').textContent = `次の送信キャンセルまで: ${typingCountdown}s`;
    if (typingCountdown <= 0) {
      clearInterval(typingCountdownId);
    }
  }, 1000);
}

function stopTypingCamo() {
  typingCamoActive = false;
  clearInterval(typingIntervalId);
  clearInterval(typingCountdownId);
  document.getElementById('typing-display').textContent = '';
  document.getElementById('typing-status').textContent = '— 停止中 —';
  document.getElementById('typing-countdown').textContent = '';
  document.getElementById('btn-typing-camo').textContent = '▶ 起動する';
  document.getElementById('btn-typing-camo').disabled = false;
}

// ---- F-02: 意識高い系Bot ----
function startBot() {
  if (botIntervalId) return;
  _postBotMessage();
  botCountdown = 60;
  document.getElementById('bot-countdown').textContent = `次の投稿まで: ${botCountdown}s`;

  botIntervalId = setInterval(_postBotMessage, 60000);
  botCountdownId = setInterval(() => {
    botCountdown--;
    document.getElementById('bot-countdown').textContent = `次の投稿まで: ${botCountdown}s`;
    if (botCountdown <= 0) botCountdown = 60;
  }, 1000);
  document.getElementById('btn-bot').textContent = '▶ 稼働中...';
  document.getElementById('btn-bot').disabled = true;
}

function stopBot() {
  clearInterval(botIntervalId);
  clearInterval(botCountdownId);
  botIntervalId = null;
  document.getElementById('bot-countdown').textContent = '';
  document.getElementById('btn-bot').textContent = '▶ 起動する';
  document.getElementById('btn-bot').disabled = false;
}

function _postBotMessage() {
  const msg = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
  const feed = document.getElementById('bot-feed');
  const now = new Date();
  const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const item = document.createElement('div');
  item.className = 'bot-feed-item';
  item.innerHTML = `<span class="bot-time">${t}</span><span class="bot-nick">意識低男</span> ${msg}`;
  feed.insertBefore(item, feed.firstChild);
  // keep max 6
  while (feed.children.length > 6) feed.removeChild(feed.lastChild);
  botCountdown = 60;
}

// ---- F-03: 緊急脱出ボタン ----
function triggerParachute() {
  const btn = document.getElementById('btn-parachute');
  btn.disabled = true;
  btn.textContent = '💥 脱出中...';
  const statusEl = document.getElementById('parachute-status');

  const steps = [
    { t: 0,    msg: '📡 パケットロス注入中… ﾌﾞﾂｯ…ｻﾞｻﾞ…' },
    { t: 800,  msg: '📹 映像コマ落ち発生中… █▒░▒█' },
    { t: 1600, msg: '🔇 マイクノイズ増幅中… ﾋﾞｰｰｰｰｰ…' },
    { t: 2400, msg: '📨 Slack送信中: 「家のルーターが爆発しました！」' },
    { t: 3200, msg: '✅ 脱出完了！現在あなたは「通信障害の被害者」です。' },
  ];

  steps.forEach(({ t, msg }) => {
    setTimeout(() => {
      statusEl.textContent = msg;
    }, t);
  });

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '🚨 緊急脱出ボタン';
    const slackLog = document.getElementById('slack-log');
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const entry = document.createElement('div');
    entry.className = 'slack-log-entry';
    entry.innerHTML = `<span class="slack-ts">${ts}</span> <b>意識低男</b>: すみません！家のルーターが爆発しました！ 🔥`;
    slackLog.insertBefore(entry, slackLog.firstChild);
    while (slackLog.children.length > 4) slackLog.removeChild(slackLog.lastChild);
  }, 4000);
}

// ---- F-04: うなづきカメラ ----
function toggleNoddingCam() {
  noddingCamActive = !noddingCamActive;
  const cam = document.getElementById('nodding-cam');
  const btn = document.getElementById('btn-nodding');
  const status = document.getElementById('nodding-status');
  if (noddingCamActive) {
    cam.classList.add('active');
    btn.textContent = '⏹ 停止';
    _runNoddingAnimation();
    status.textContent = '🎥 仮想カメラ出力中 — 本人はカップ麺を啜っています';
  } else {
    cam.classList.remove('active');
    btn.textContent = '▶ 仮想カメラ起動';
    status.textContent = '— 停止中 —';
  }
}

function _runNoddingAnimation() {
  if (!noddingCamActive) return;
  const face = document.getElementById('nodding-face');
  const actions = ['😐', '🤔', '😶', '🧐', '😑'];
  // random nod
  const nodFrames = [0, -8, -3, -10, -5, 0];
  let fi = 0;
  const nodInterval = setInterval(() => {
    if (!noddingCamActive) { clearInterval(nodInterval); return; }
    if (fi < nodFrames.length) {
      face.style.marginTop = nodFrames[fi] + 'px';
      fi++;
    } else {
      clearInterval(nodInterval);
      face.style.marginTop = '0px';
      // change expression occasionally
      if (Math.random() < 0.3) {
        face.textContent = actions[Math.floor(Math.random() * actions.length)];
      }
      // schedule next nod
      setTimeout(_runNoddingAnimation, 2000 + Math.random() * 4000);
    }
  }, 80);
}

// ---- F-05: ボス・キー ----
function activateBossKey() {
  if (bossKeyActive) return;
  bossKeyActive = true;
  const overlay = document.getElementById('boss-overlay');
  overlay.classList.add('active');
  _startTerminal();
  document.getElementById('boss-status').textContent = '🛡️ ボス・キー発動中 — 解除するには「解除」ボタンを押してください';
}

function deactivateBossKey() {
  bossKeyActive = false;
  const overlay = document.getElementById('boss-overlay');
  overlay.classList.remove('active');
  clearInterval(termIntervalId);
  document.getElementById('boss-status').textContent = '— 待機中 —';
}

function _startTerminal() {
  termLineIdx = 0;
  const term = document.getElementById('terminal-output');
  term.innerHTML = '';
  clearInterval(termIntervalId);
  termIntervalId = setInterval(() => {
    if (termLineIdx < TERMINAL_LINES.length) {
      const line = document.createElement('div');
      line.textContent = TERMINAL_LINES[termLineIdx];
      term.appendChild(line);
      termLineIdx++;
      term.scrollTop = term.scrollHeight;
    } else {
      termLineIdx = 0;
      setTimeout(() => { term.innerHTML = ''; }, 500);
    }
  }, 300);
}

// keyboard shortcut B for boss key
document.addEventListener('keydown', (e) => {
  if (e.key === 'b' || e.key === 'B') {
    if (!bossKeyActive) activateBossKey();
  }
  if (e.key === 'Escape' && bossKeyActive) {
    deactivateBossKey();
  }
});

// ---- F-06: マウス・ジグラー ----
function toggleJiggler() {
  jigglerActive = !jigglerActive;
  const btn = document.getElementById('btn-jiggler');
  const status = document.getElementById('jiggler-status');
  if (jigglerActive) {
    btn.textContent = '⏹ 停止';
    status.textContent = '🖱️ 有機的微動パターン適用中…';
    _jigglerLoop();
  } else {
    btn.textContent = '▶ 起動する';
    status.textContent = '— 停止中 —';
    cancelAnimationFrame(jigglerRafId);
  }
}

function _jigglerLoop() {
  if (!jigglerActive) return;
  jigglerTime += 0.02;

  // Human-like organic movement
  const noiseX = Math.sin(jigglerTime * 1.3) * 18 + Math.sin(jigglerTime * 3.7) * 6 + Math.sin(jigglerTime * 0.4) * 25;
  const noiseY = Math.cos(jigglerTime * 1.1) * 15 + Math.cos(jigglerTime * 2.9) * 8 + Math.cos(jigglerTime * 0.6) * 20;

  // occasional "typo + backspace" pause
  if (Math.floor(jigglerTime * 10) % 47 === 0) {
    // simulate backspace stutter
    jigglerX += (Math.random() - 0.5) * 3;
    jigglerY += (Math.random() - 0.5) * 3;
  }

  jigglerX = Math.max(5, Math.min(95, 50 + noiseX));
  jigglerY = Math.max(5, Math.min(95, 55 + noiseY));

  const cursor = document.getElementById('jiggler-cursor');
  cursor.style.left = jigglerX + '%';
  cursor.style.top = jigglerY + '%';

  // status pattern label
  const patterns = ['deep-thinking-scroll', 'tab-switching-anxiety', 'reading-rereading', 'backspace-frenzy', 'hover-hesitation'];
  const patIdx = Math.floor(jigglerTime / 5) % patterns.length;
  if (!jigglerStatusTimeout) {
    document.getElementById('jiggler-pattern').textContent = `パターン: ${patterns[patIdx]}`;
  }

  jigglerRafId = requestAnimationFrame(_jigglerLoop);
}

// ---- F-07: 言い訳ジェネレーター ----
function generateExcuse() {
  const btn = document.getElementById('btn-excuse');
  btn.disabled = true;
  btn.textContent = '⚙️ AI生成中...';

  const typeSelect = document.getElementById('excuse-type');
  const type = typeSelect.value;

  // filter by type
  let pool = EXCUSES;
  if (type === 'late') pool = EXCUSES.filter((_, i) => i % 3 === 0);
  else if (type === 'leave') pool = EXCUSES.filter((_, i) => i % 3 === 1);
  else if (type === 'away') pool = EXCUSES.filter((_, i) => i % 3 === 2);

  if (pool.length === 0) pool = EXCUSES;

  // avoid recent history
  let candidate;
  let attempts = 0;
  do {
    candidate = pool[Math.floor(Math.random() * pool.length)];
    attempts++;
  } while (excuseHistory.includes(candidate) && attempts < 20);

  excuseHistory.push(candidate);
  if (excuseHistory.length > 5) excuseHistory.shift();

  // "AI thinking" delay
  setTimeout(() => {
    document.getElementById('excuse-output').textContent = candidate;
    document.getElementById('excuse-confidence').textContent =
      `信頼度スコア: ${(85 + Math.random() * 14).toFixed(1)}% — 上司が信じる確率: 推定${(60 + Math.random() * 35).toFixed(0)}%`;
    btn.disabled = false;
    btn.textContent = '🤖 AI言い訳を生成する';
  }, 1200 + Math.random() * 800);
}

function copyExcuse() {
  const text = document.getElementById('excuse-output').textContent;
  if (!text || text.startsWith('←')) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy-excuse');
    btn.textContent = '✅ コピー済み';
    setTimeout(() => { btn.textContent = '📋 コピー'; }, 2000);
  });
}

// generate "now I'm busy" reply
function generateBusyReply() {
  const reply = BUSY_REPLIES[Math.floor(Math.random() * BUSY_REPLIES.length)];
  document.getElementById('busy-reply-output').textContent = reply;
}

function copyBusyReply() {
  const text = document.getElementById('busy-reply-output').textContent;
  if (!text || text.startsWith('←')) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy-reply');
    btn.textContent = '✅ コピー済み';
    setTimeout(() => { btn.textContent = '📋 コピー'; }, 2000);
  });
}

// ---- TABS ----
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}

// ---- DISCLAIMER MODAL ----
function closeDisclaimer() {
  document.getElementById('disclaimer-modal').style.display = 'none';
}