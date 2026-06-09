/* ═══════════════════════════════════════════════════════════
   AI AGENT — Main Script
   ═══════════════════════════════════════════════════════════ */

/* ── Scroll Animations & Intro Sequence ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show'); 
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach((el) => scrollObserver.observe(el));

  const intro = document.getElementById('cinematic-intro');
  const landing = document.getElementById('landing-page');
  const globalToggle = document.getElementById('global-theme-toggle');

  if (intro && landing) {
    landing.style.opacity = '0';
    landing.style.transform = 'scale(0.98)';
    landing.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)';
    if (globalToggle) globalToggle.style.opacity = '0';

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    async function playSequence() {
      await delay(400);
      const lines = [
        document.getElementById('intro-1'),
        document.getElementById('intro-2'),
        document.getElementById('intro-3'),
        document.getElementById('intro-4')
      ];

      for (let i = 0; i < lines.length; i++) {
        if (!lines[i]) continue;
        lines[i].classList.add('show');
        await delay(1600); 
        lines[i].classList.remove('show');
        lines[i].classList.add('hide');
        await delay(500); 
      }

      intro.style.opacity = '0';
      landing.style.opacity = '1';
      landing.style.transform = 'scale(1)';
      if (globalToggle) {
        globalToggle.style.transition = 'opacity 1.2s ease';
        globalToggle.style.opacity = '1';
      }

      await delay(800);
      intro.remove();
    }

    playSequence();
  }
});


/* ── Theme Management ────────────────────────────────────────────── */
function initTheme() {
  const isDark = localStorage.getItem('dracula_theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  updateThemeLabels(isDark);
}
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('dracula_theme', isDark ? 'dark' : 'light');
  updateThemeLabels(isDark);
}
function updateThemeLabels(isDark) {
  const labels = document.querySelectorAll('.theme-text-label');
  labels.forEach(l => {
    l.innerText = isDark ? 'Light Mode' : 'Dark Mode';
  });
  const iconContainers = document.querySelectorAll('#theme-icon-container');
  iconContainers.forEach(container => {
    if (isDark) {
      container.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      container.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
  });
}
initTheme();

function updateSettingsLabel() {
  const isDark = document.body.classList.contains('dark-mode');
  const lbl = document.getElementById('settings-theme-label');
  if (lbl) lbl.textContent = isDark ? 'Currently: Dark Mode' : 'Currently: Light Mode';
}

/* ── Drawer ────────────────────────────────────────────────────── */
function openDrawer() {
  const d = document.getElementById('nav-drawer');
  const b = document.getElementById('nav-drawer-backdrop');
  d.style.display = 'flex';
  b.style.display = 'block';
  d.style.animation = 'drawerIn .28s cubic-bezier(.16,1,.3,1) forwards';
}
function closeDrawer() {
  document.getElementById('nav-drawer').style.display = 'none';
  document.getElementById('nav-drawer-backdrop').style.display = 'none';
}

/* -- Account dropdown -- */
function toggleAcctDropdown() {
  const d = document.getElementById('acct-dropdown');
  d.style.display = d.style.display === 'block' ? 'none' : 'block';
}
function closeAcctDropdown() {
  document.getElementById('acct-dropdown').style.display = 'none';
}
document.addEventListener('click', e => {
  const dd = document.getElementById('acct-dropdown');
  if (dd && dd.style.display === 'block') {
    if (!dd.contains(e.target) && !e.target.closest('.dsh-avatar-wrap')) {
      closeAcctDropdown();
    }
  }
  const d = document.getElementById('nav-drawer');
  if (d && d.style.display === 'flex') {
    if (!d.contains(e.target) && !e.target.closest('[onclick="openDrawer()"]')) {
      closeDrawer();
    }
  }
});

/* ── Modal helpers ──────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'flex';
  if (id === 'profile-modal') {
    const name  = document.getElementById('acct-name')?.textContent  || 'Agent';
    const email = document.getElementById('acct-email')?.textContent || '—';
    const elN  = document.getElementById('profile-name');     if (elN)  elN.textContent  = name;
    const elFN = document.getElementById('profile-fullname'); if (elFN) elFN.textContent = name;
    const elE  = document.getElementById('profile-email');    if (elE)  elE.textContent  = email;
    const src = document.getElementById('acct-avatar-mini');
    const dst = document.getElementById('profile-avatar');
    if (src && dst) dst.innerHTML = src.innerHTML;
  }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/* ── Google One Tap callback ─────────────────────────────── */
function handleGoogleOneTapResponse(response) {
  console.log('Google One Tap Authentication Payload received:', response);
  setDash('Narendra Modi');
  showPage('home-page');
}

/* ────────────────────────────────────────
   INIT: Populate dot-grid decorations
   ──────────────────────────────────────── */

['dgl', 'dgr'].forEach(id => {
  const grid = document.getElementById(id);
  if(!grid) return;
  for (let i = 0; i < 70; i++) {
    const dot = document.createElement('span');
    dot.style.animationDelay = (Math.random() * 4) + 's';
    grid.appendChild(dot);
  }
});


/* ────────────────────────────────────────
   PAGE NAVIGATION
   ──────────────────────────────────────── */

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const target = document.getElementById(id);
  target.style.display = '';
  target.classList.add('active');
  target.style.animation = 'none';
  target.offsetHeight;
  target.style.animation = '';
  
  const gt = document.getElementById('global-theme-toggle');
  if (gt) {
    gt.style.display = (id === 'dashboard-page' || id === 'home-page') ? 'none' : 'flex';
  }

  const appPage = (id === 'dashboard-page' || id === 'home-page');
  document.body.classList.toggle('app-mode', appPage);
  
  if (id === 'dashboard-page') initDashboard(false);

  
  if (id === 'landing-page') {
    target.scrollTop = 0;
    DRC._dashboardInited = false;
    DRC.scanCount = 0;
    DRC.vulnCount = 0;
    DRC.secScore = null;
    DRC.findings = [];
    if (DRC._sessionTimer) {
      clearInterval(DRC._sessionTimer);
      DRC._sessionTimer = null;
      const timerEl = document.getElementById('session-timer');
      if (timerEl) timerEl.textContent = '00:00:00';
    }
  }
}


/* ────────────────────────────────────────
   DASHBOARD HELPERS
   ──────────────────────────────────────── */

function setDash(name) {
  const formatted = name.charAt(0).toUpperCase() + name.slice(1);
  
  const wName = document.getElementById('welcome-name');
  if (wName) wName.textContent = 'Hello, ' + formatted;

  const hwName = document.getElementById('home-welcome-name');
  if (hwName) hwName.textContent = 'Hello, ' + formatted;
  
  const avatarContainer = document.getElementById('avatar-initial');
  const homeAvatarContainer = document.getElementById('home-avatar-initial');
  
  const checkName = name.toLowerCase().trim();
  let imgUrl = "";

  if (checkName.includes("narendra") || checkName.includes("modi")) {
    imgUrl = "https://i1-e.pinimg.com/736x/94/91/b5/9491b525931aa28f9a2d4322f23987dc.jpg"; 
  } else if (checkName.includes("giorgia") || checkName.includes("meloni")) {
    imgUrl = "https://i1-e.pinimg.com/1200x/a5/fd/f9/a5fdf9b61fedfcc07fa16f8aecc240ee.jpg";
  } else {
    imgUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_xV9gN1fB2g90G_C7V735BAn1f2B9Oa2v_A&s"; 
  }

  function makeAvatarImg(url, alt) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;';
    return img;
  }

  [avatarContainer, homeAvatarContainer].forEach(c => {
    if (!c) return;
    c.innerHTML = '';
    c.appendChild(makeAvatarImg(imgUrl, formatted));
  });

  const mini = document.getElementById('acct-avatar-mini');
  if (mini) {
    mini.innerHTML = '';
    mini.appendChild(makeAvatarImg(imgUrl, formatted));
  }
  
  const acctName = document.getElementById('acct-name');
  if (acctName) acctName.textContent = formatted;
  
  const acctEmail = document.getElementById('acct-email');
  if (acctEmail) {
    const emailMap = {
      'narendra modi': 'narendra.modi@gmail.com',
      'giorgia meloni': 'giorgia.meloni@gmail.com',
    };
    acctEmail.textContent = emailMap[name.toLowerCase().trim()] || name.toLowerCase().replace(' ','.')+'@gmail.com';
  }

  // Start session timer on login (only if not already running)
  if (!DRC._sessionTimer) {
    DRC._sessionStart = Date.now();
    const timerEl = document.getElementById('session-timer');
    DRC._sessionTimer = setInterval(() => {
      const s = Math.floor((Date.now() - DRC._sessionStart) / 1000);
      const h   = String(Math.floor(s / 3600)).padStart(2, '0');
      const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = h + ':' + m + ':' + sec;
    }, 1000);
  }
}

/* ────────────────────────────────────────
   LOGIN FORM
   ──────────────────────────────────────── */

function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const pass     = document.getElementById('login-pass').value;
  const emailErr = document.getElementById('email-err');
  const passErr  = document.getElementById('pass-err');
  let valid = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErr.style.display = 'block';
    valid = false;
  } else {
    emailErr.style.display = 'none';
  }

  if (pass.length < 6) {
    passErr.style.display = 'block';
    valid = false;
  } else {
    passErr.style.display = 'none';
  }

  if (!valid) return;

  setDash(email.split('@')[0]);
  showPage('home-page');
}

function googleLogin() {
  showGoogleModal();
}


/* ────────────────────────────────────────
   SIGNUP FORM
   ──────────────────────────────────────── */

function handleSignup() {
  const fname     = document.getElementById('fname').value.trim();
  const email     = document.getElementById('su-email').value.trim();
  const pass      = document.getElementById('su-pass').value;
  const pass2     = document.getElementById('su-pass2').value;
  const terms     = document.getElementById('terms').checked;
  const matchErr  = document.getElementById('pass-match-err');

  const fnameEl = document.getElementById('fname');
  const emailEl = document.getElementById('su-email');
  let valid = true;
  if (!fname) { fnameEl.style.borderBottomColor = 'var(--danger)'; valid = false; } else { fnameEl.style.borderBottomColor = ''; }
  if (!email) { emailEl.style.borderBottomColor = 'var(--danger)'; valid = false; } else { emailEl.style.borderBottomColor = ''; }
  if (!valid) return;
  if (pass !== pass2) {
    matchErr.style.display = 'block';
    return;
  } else {
    matchErr.style.display = 'none';
  }
  if (!terms) {
    matchErr.textContent = 'Please accept the Terms of Service.';
    matchErr.style.display = 'block';
    return;
  }
  matchErr.textContent = 'Passwords do not match.';

  setDash(fname);
  showPage('home-page');
}

function checkStrength(value) {
  let score = 0;
  if (value.length >= 8)          score++;
  if (/[A-Z]/.test(value))        score++;
  if (/[0-9]/.test(value))        score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const segColors = [
    'transparent',
    '#ff5a7e',   
    '#f0a04a',   
    '#00d4ff',   
    '#7cb38a',   
  ];

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  for (let i = 1; i <= 4; i++) {
    const seg = document.getElementById('seg-' + i);
    if (seg) {
      seg.style.background = i <= score
        ? segColors[score]
        : 'rgba(196,93,133,0.08)';
      seg.style.boxShadow = (i <= score && score >= 3)
        ? `0 0 8px ${segColors[score]}66`
        : 'none';
    }
  }

  const label = document.getElementById('strength-label');
  if (label) {
    label.textContent = value.length > 0 ? labels[score] : '';
    label.style.color = segColors[score] || 'var(--text-light)';
  }
}


/* ────────────────────────────────────────
   GOOGLE ACCOUNT CHOOSER MODAL
   ──────────────────────────────────────── */

function showGoogleModal() {
  const modal = document.getElementById('google-modal');
  modal.style.display = 'flex';
  document.getElementById('gm-accounts').style.display   = 'block';
  document.getElementById('gm-email-form').style.display = 'none';
  document.getElementById('gm-loading').style.display    = 'none';

  const box = document.getElementById('gm-box');
  box.style.animation = 'none';
  box.offsetHeight;
  box.style.animation = '';
}

function closeGoogleModal() {
  document.getElementById('google-modal').style.display = 'none';
}

function showGoogleEmailInput() {
  document.getElementById('gm-accounts').style.display   = 'none';
  document.getElementById('gm-email-form').style.display = 'block';
  setTimeout(() => document.getElementById('gm-custom-email').focus(), 80);
}

function submitCustomGoogle() {
  const email = document.getElementById('gm-custom-email').value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('gm-custom-email').style.borderBottomColor = '#EA4335';
    return;
  }
  const name = email.split('@')[0];
  selectGoogleAccount(name, email, name.slice(0, 2).toUpperCase());
}

function selectGoogleAccount(name, email, initials) {
  document.getElementById('gm-accounts').style.display   = 'none';
  document.getElementById('gm-email-form').style.display = 'none';

  const loading = document.getElementById('gm-loading');
  loading.style.display = 'flex';
  document.getElementById('gm-loading-email').textContent = email;

  setTimeout(() => {
    closeGoogleModal();
    setDash(name);
    showPage('home-page');
  }, 1800);
}

/* ────────────────────────────────────────
   STATE
   ──────────────────────────────────────── */

const DRC = {
  mode: 'web',        
  depth: 1,
  scanning: false,
  scanCount: 0,
  vulnCount: 0,
  secScore: null,
  termInterval: null,
  gaugeAnimFrame: null,
  findings: [],
  _sessionTimer: null,
  _sessionStart: null,
  _dashboardInited: false,
};


/* ────────────────────────────────────────
   HOME PAGE TAB SWITCHING
   ──────────────────────────────────────── */

function setHpMode(mode) {
  const webTab = document.getElementById('hp-tab-web');
  const gitTab = document.getElementById('hp-tab-git');
  const prefix = document.getElementById('hp-prefix');
  const input  = document.getElementById('hp-target');
  const gitOpts = document.getElementById('hp-opts-git');

  if (mode === 'web') {
    webTab.classList.add('active');
    gitTab.classList.remove('active');
    prefix.textContent = 'https://';
    input.placeholder  = 'enter target domain .....';
    gitOpts.style.display = 'none';
  } else {
    gitTab.classList.add('active');
    webTab.classList.remove('active');
    prefix.textContent = 'github.com/';
    input.placeholder  = 'username/repository';
    gitOpts.style.display = 'block';
  }
}

function toggleHpChk(chkId, tglId) {
  const tgl = document.getElementById(tglId);
  tgl.classList.toggle('hp-tgl--on');
}

/* ────────────────────────────────────────
   MODE TOGGLE
   ──────────────────────────────────────── */

function setMode(mode) {
  DRC.mode = mode;
  document.getElementById('mode-web').classList.toggle('mode-btn--active', mode === 'web');
  document.getElementById('mode-git').classList.toggle('mode-btn--active', mode === 'git');

  const prefix = document.getElementById('target-prefix');
  const input  = document.getElementById('target-input');

  if (mode === 'web') {
    prefix.textContent = 'https://';
    input.placeholder  = 'enter target domain…';
    document.getElementById('target-options-web').style.display = 'block';
    document.getElementById('target-options-git').style.display = 'none';
  } else {
    prefix.textContent = 'github.com/';
    input.placeholder  = 'username/repository';
    document.getElementById('target-options-web').style.display = 'none';
    document.getElementById('target-options-git').style.display = 'block';
  }
}


/* ────────────────────────────────────────
   DEPTH SELECTOR
   ──────────────────────────────────────── */

function setDepth(n, el) {
  DRC.depth = n;
  document.querySelectorAll('.depth-btn').forEach(b => b.classList.remove('depth-btn--active'));
  el.classList.add('depth-btn--active');
}


/* ────────────────────────────────────────
   TERMINAL HELPERS
   ──────────────────────────────────────── */

function termLog(text, cls = 'term-line--info') {
  const body = document.getElementById('terminal-body');
  const cursor = body.querySelector('.term-cursor-line');
  if (cursor) body.removeChild(cursor);

  const line = document.createElement('div');
  line.className = 'term-line ' + cls;
  line.textContent = text;
  body.appendChild(line);

  const cl = document.createElement('div');
  cl.className = 'term-cursor-line';
  cl.innerHTML = '<span class="term-prompt">dracula@core:~$</span> <span class="term-cursor">▋</span>';
  body.appendChild(cl);

  body.scrollTop = body.scrollHeight;
}

function clearTerminal() {
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';
  const comment = document.createElement('div');
  comment.className = 'term-line term-line--comment';
  comment.textContent = '── DRACULA ENGINE v2.4.1 ─ Headless Chromium 131 ─ Playwright v1.49 ──';
  const info = document.createElement('div');
  info.className = 'term-line term-line--info';
  info.textContent = 'Terminal cleared. Awaiting next target.';
  const cl = document.createElement('div');
  cl.className = 'term-cursor-line';
  const prompt = document.createElement('span');
  prompt.className = 'term-prompt';
  prompt.textContent = 'dracula@core:~$';
  const cursor = document.createElement('span');
  cursor.className = 'term-cursor';
  cursor.textContent = '▋';
  cl.appendChild(prompt);
  cl.appendChild(document.createTextNode(' '));
  cl.appendChild(cursor);
  body.appendChild(comment);
  body.appendChild(info);
  body.appendChild(cl);
}

function setTermStatus(active) {
  const lbl = document.getElementById('term-status-label');
  const dot = document.querySelector('.term-blink-indicator .status-dot');
  if (active) {
    lbl.textContent = 'SCANNING';
    lbl.style.color = 'var(--sakura)';
    dot.style.background = 'var(--sakura)';
    dot.style.boxShadow  = '0 0 8px var(--sakura)';
  } else {
    lbl.textContent = 'IDLE';
    lbl.style.color = 'var(--text-light)';
    dot.style.background = 'var(--success)';
    dot.style.boxShadow  = '0 0 8px var(--success)';
  }
}


/* ────────────────────────────────────────
   KPI COUNTER ANIMATIONS
   ──────────────────────────────────────── */

function animateCounter(id, to, duration) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent) || 0;
  const diff  = to - start;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + diff * ease);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateGauge(targetPct) {
  const arc    = document.getElementById('gauge-arc');
  const pctEl  = document.getElementById('gauge-pct');
  const total  = 207.3;

  let current = parseFloat(pctEl.textContent) || 0;
  const start = performance.now();
  const duration = 1400;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(current + (targetPct - current) * ease);
    const offset = total - (total * val / 100);
    arc.style.strokeDashoffset = offset;
    pctEl.textContent = val;

    let color = val >= 80 ? '#7cb38a' : val >= 55 ? '#e8a5b8' : val >= 35 ? '#e8b38a' : '#d4607a';
    arc.style.stroke = color;
    pctEl.style.color = color;

    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const scoreStatus = document.getElementById('kpi-score-status');
  if (targetPct >= 80) { scoreStatus.textContent = 'Excellent'; scoreStatus.className = 'kpi-delta kpi-delta--up'; }
  else if (targetPct >= 55) { scoreStatus.textContent = 'Moderate'; scoreStatus.className = 'kpi-delta'; }
  else { scoreStatus.textContent = 'Critical'; scoreStatus.className = 'kpi-delta kpi-delta--down'; }
}


/* ────────────────────────────────────────
   SCAN SIMULATION
   ──────────────────────────────────────── */

const WEB_SCAN_LOGS = [
  ['cmd',     t => `[INIT]   Resolving target → ${t}`],
  ['data',    () => `[DNS ]   Resolved. TTL 300s. A record → 104.21.${rnd(1,254)}.${rnd(1,254)}`],
  ['info',    () => `[HTTP]   Connecting via TLS 1.3… handshake OK`],
  ['cmd',     () => `[CHROM]  Launching headless Chromium 131.0.${rnd(6770,6800)}.0…`],
  ['data',    () => `[ENV  ]  Node.js v22.${rnd(0,5)}.0 · Playwright v1.49.${rnd(0,3)} · npm 10.${rnd(2,9)}.0`],
  ['success', () => `[CHROM]  Browser context initialised ✔`],
  ['info',    () => `[CRAWL]  Page 1 — Navigating to root…`],
  ['data',    () => `[DOM  ]  ${rnd(40,180)} DOM nodes parsed, ${rnd(2,12)} iframes detected`],
  ['warn',    () => `[SEC  ]  ⚠  Missing Content-Security-Policy header`],
  ['data',    () => `[A11Y ]  ${rnd(0,8)} WCAG 2.1 AA violations found`],
  ['info',    () => `[CRAWL]  Page 2 — Following internal links…`],
  ['data',    () => `[NET  ]  ${rnd(20,80)} requests captured — ${rnd(2,14)} cross-origin`],
  ['warn',    () => `[SEC  ]  ⚠  Cookie set without Secure or SameSite flags`],
  ['cmd',     () => `[SCRN ]  Capturing full-page screenshot…`],
  ['success', () => `[SCRN ]  Screenshot saved ✔  (${rnd(1200,2400)}×${rnd(600,1100)}px)`],
  ['data',    () => `[PERF ]  LCP ${(Math.random()*3+0.5).toFixed(2)}s · FID ${rnd(10,120)}ms · CLS ${(Math.random()*0.3).toFixed(3)}`],
  ['cmd',     () => `[AI   ]  Sending corpus to analysis engine…`],
  ['success', () => `[AI   ]  Report generated ✔  — Findings compiled`],
];

const GIT_SCAN_LOGS = [
  ['cmd',     t => `[INIT]   Cloning repository → ${t}`],
  ['data',    () => `[GIT ]   Fetching object pack… ${rnd(200,1800)} objects`],
  ['success', () => `[GIT ]   Clone complete ✔`],
  ['data',    () => `[ENV  ]  Node.js v22.${rnd(0,5)}.0 · npm 10.${rnd(2,9)}.0 · Python 3.${rnd(11,13)}.${rnd(0,4)}`],
  ['cmd',     () => `[DEP ]   Parsing package manifests…`],
  ['data',    () => `[DEP ]   ${rnd(30,300)} packages resolved, ${rnd(0,15)} with known CVEs`],
  ['warn',    () => `[SEC ]   ⚠  ${rnd(1,4)} high-severity dependency advisories`],
  ['cmd',     () => `[SEC ]   Running secret-pattern scanner…`],
  ['data',    () => `[SEC ]   Scanning ${rnd(120,800)} files…`],
  ['warn',    () => `[SEC ]   ⚠  Potential API key pattern in .env.example`],
  ['cmd',     () => `[BUILD]  Attempting build with detected config…`],
  ['success', () => `[BUILD]  Build completed in ${(Math.random()*30+5).toFixed(1)}s ✔`],
  ['cmd',     () => `[AI   ]  Sending corpus to analysis engine…`],
  ['success', () => `[AI   ]  Report generated ✔  — Findings compiled`],
];

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function executeScan() {
  if (DRC.scanning) return;

  const raw    = document.getElementById('target-input').value.trim();
  const target = raw || (DRC.mode === 'web' ? 'example.com' : 'user/repo');

  DRC.scanning = true;

  const btn   = document.getElementById('btn-execute');
  const label = document.getElementById('btn-execute-label');
  btn.classList.add('btn-execute--scanning');
  label.textContent = 'SCANNING…';

  const badge = document.querySelector('#dashboard-page .dsh-badge--online');
  if (badge) { badge.textContent = 'SCANNING'; badge.className = 'dsh-badge dsh-badge--scanning'; }

  setTermStatus(true);
  termLog('');
  termLog(`── New Scan Initiated ─────────────────────────────────────────`, 'term-line--comment');

  const logs = DRC.mode === 'web' ? WEB_SCAN_LOGS : GIT_SCAN_LOGS;
  let i = 0;

  function step() {
    if (i >= logs.length) {
      finishScan(target);
      return;
    }
    const [cls, fn] = logs[i++];
    termLog(fn(target), 'term-line--' + cls);
    DRC.termInterval = setTimeout(step, rnd(220, 620));
  }

  step();
}

function finishScan(target) {
  DRC.scanning = false;
  DRC.scanCount++;

  const score  = rnd(28, 97);
  const vulns  = rnd(0, 12);
  const issues = rnd(0, 6);
  const pages  = DRC.mode === 'web' ? rnd(1, DRC.depth) : null;
  const status = score >= 75 ? 'pass' : score >= 45 ? 'warn' : 'fail';

  DRC.vulnCount += vulns;
  DRC.secScore = score;

  animateCounter('kpi-scans', DRC.scanCount, 600);
  document.getElementById('kpi-scans-delta').textContent = `+1 this session`;

  animateGauge(score);

  animateCounter('kpi-vulns', DRC.vulnCount, 800);
  if (DRC.vulnCount > 0) {
    document.getElementById('kpi-vulns-delta').textContent = `${vulns} new from last scan`;
    document.getElementById('kpi-vulns-delta').className   = 'kpi-delta kpi-delta--down';
  }

  const pipeEl = document.getElementById('kpi-pipes');
  pipeEl.textContent = '1';
  document.getElementById('kpi-pipes-delta').textContent = 'Active';
  document.getElementById('kpi-pipes-delta').className   = 'kpi-delta kpi-delta--up';
  setTimeout(() => {
    pipeEl.textContent = '0';
    document.getElementById('kpi-pipes-delta').textContent = 'Idle';
    document.getElementById('kpi-pipes-delta').className   = 'kpi-delta kpi-delta--neutral';
  }, 4000);

  termLog('');
  termLog(`── Scan Complete ─ Score: ${score}/100 ─ Vulns: ${vulns} ─ Issues: ${issues} ──`, 'term-line--comment');

  const btn   = document.getElementById('btn-execute');
  const label = document.getElementById('btn-execute-label');
  btn.classList.remove('btn-execute--scanning');
  label.textContent = 'EXECUTE SCAN';

  setTermStatus(false);

  const badge = document.querySelector('#dashboard-page .dsh-badge--scanning');
  if (badge) { badge.textContent = 'READY'; badge.className = 'dsh-badge dsh-badge--online'; }

  addFindingNode({
    target: (DRC.mode === 'web' ? 'https://' : 'github.com/') + target,
    type:   DRC.mode === 'web' ? 'WEB SCAN' : 'REPO SCAN',
    status,
    score,
    vulns,
    issues,
    pages,
    ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  });
}


/* ────────────────────────────────────────
   FINDINGS GALLERY
   ──────────────────────────────────────── */

function addFindingNode(f) {
  DRC.findings.unshift(f);

  document.getElementById('findings-empty').style.display = 'none';

  document.getElementById('findings-count-badge').textContent = `${DRC.findings.length} REPORT${DRC.findings.length !== 1 ? 'S' : ''}`;

  const list = document.getElementById('findings-list');

  const colors = {
    pass: ['#7cb38a', '#e8a5b8', '#d4a373'],
    warn: ['#f0a04a', '#00d4ff', '#7b61ff'],
    fail: ['#ff5a7e', '#f0a04a', '#7b61ff'],
  };
  const c = colors[f.status];

  const bars = Array.from({length: rnd(3,6)}, (_, i) => {
    const w = rnd(30, 100);
    return `<div class="finding-viewport-bar" style="width:${w}%;background:${c[i%c.length]}"></div>`;
  }).join('');

  const dots = Array.from({length: 5}, (_, i) =>
    `<div class="finding-viewport-dot" style="background:${c[i%c.length]}"></div>`
  ).join('');

  const tagText = f.status.toUpperCase();

  const node = document.createElement('div');
  node.className = `finding-node finding-node--${f.status}`;
  node.innerHTML = `
    <div class="finding-node-inner">
      <div class="finding-header">
        <div class="finding-target" title="${f.target}">${f.target}</div>
        <div class="finding-tag finding-tag--${f.status}">${tagText}</div>
      </div>
      <div class="finding-meta">
        <div class="finding-meta-item">TYPE <span>${f.type}</span></div>
        <div class="finding-meta-item">SCORE <span>${f.score}/100</span></div>
        <div class="finding-meta-item">TIME <span>${f.ts}</span></div>
        ${f.pages !== null ? `<div class="finding-meta-item">PAGES <span>${f.pages}</span></div>` : ''}
      </div>
      <div class="finding-viewport">
        <div class="finding-viewport-screen">
          <div class="finding-viewport-dot-row">${dots}</div>
          ${bars}
        </div>
        <div class="finding-viewport-label">PAGE CAPTURE</div>
      </div>
      <div class="finding-stats-row">
        <div class="finding-stat">
          <div class="finding-stat-val" style="color:${f.vulns > 0 ? 'var(--danger)' : 'var(--success)'}">${f.vulns}</div>
          <div class="finding-stat-key">Vulnerabilities</div>
        </div>
        <div class="finding-stat">
          <div class="finding-stat-val" style="color:${f.issues > 0 ? '#f0a04a' : 'var(--success)'}">${f.issues}</div>
          <div class="finding-stat-key">Issues</div>
        </div>
        <div class="finding-stat">
          <div class="finding-stat-val">${f.score}</div>
          <div class="finding-stat-key">Sec Score</div>
        </div>
      </div>
    </div>
  `;

  const empty = document.getElementById('findings-empty');
  list.insertBefore(node, empty.nextSibling || list.firstChild);
}


/* ────────────────────────────────────────
   DEVICE PREVIEW CONTROLS
   ──────────────────────────────────────── */

const PREVIEW_PAGES = [
  { src: 'preview.html', label: 'dracula.ai — Light' },
  { src: 'preview.html?dark=1', label: 'dracula.ai — Dark' },
];
let _previewIdx = 0;
let _isMac = false;

function _getActiveIframe() {
  return _isMac
    ? document.getElementById('preview-iframe-mac')
    : document.getElementById('preview-iframe');
}

function _loadPreview(idx) {
  _previewIdx = (idx + PREVIEW_PAGES.length) % PREVIEW_PAGES.length;
  const p = PREVIEW_PAGES[_previewIdx];
  const iframe = _getActiveIframe();
  if (iframe) iframe.src = p.src;
  const bar = document.getElementById('mac-addressbar');
  if (bar) bar.textContent = p.label;
}

function previewPrev() { _loadPreview(_previewIdx - 1); }
function previewNext() { _loadPreview(_previewIdx + 1); }

function switchDevice() {
  _isMac = !_isMac;
  const phoneFrame = document.getElementById('phone-frame');
  const macFrame   = document.getElementById('mac-frame');
  const btn        = document.getElementById('switch-btn');

  if (_isMac) {
    phoneFrame.style.display = 'none';
    macFrame.style.display   = 'flex';
    btn.textContent = '📱 SWITCH';
    // sync current page to mac iframe
    const p = PREVIEW_PAGES[_previewIdx];
    const macIframe = document.getElementById('preview-iframe-mac');
    if (macIframe) macIframe.src = p.src;
    const bar = document.getElementById('mac-addressbar');
    if (bar) bar.textContent = p.label;
  } else {
    macFrame.style.display   = 'none';
    phoneFrame.style.display = 'block';
    btn.textContent = '⇄ SWITCH';
    const p = PREVIEW_PAGES[_previewIdx];
    const phoneIframe = document.getElementById('preview-iframe');
    if (phoneIframe) phoneIframe.src = p.src;
  }
}

function initDashboard(force) {
  if (DRC._dashboardInited && !force) {
    // Re-sync KPIs from state without resetting
    const scansEl = document.getElementById('kpi-scans');
    const vulnsEl = document.getElementById('kpi-vulns');
    if (scansEl) scansEl.textContent = DRC.scanCount;
    if (vulnsEl) vulnsEl.textContent = DRC.vulnCount;
    if (DRC.secScore !== null) animateGauge(DRC.secScore);
    // Re-render findings
    const list = document.getElementById('findings-list');
    const empty = document.getElementById('findings-empty');
    if (list && DRC.findings.length > 0) {
      empty.style.display = 'none';
      document.getElementById('findings-count-badge').textContent =
        `${DRC.findings.length} REPORT${DRC.findings.length !== 1 ? 'S' : ''}`;
    }
    return;
  }
  DRC._dashboardInited = true;

  const arc = document.getElementById('gauge-arc');
  if (arc) {
    arc.style.strokeDashoffset = '207.3';
    arc.style.stroke = 'url(#gaugeGrad)';
  }
  const pctEl = document.getElementById('gauge-pct');
  if (pctEl) pctEl.textContent = '--';
  document.getElementById('kpi-score-status').textContent = 'No scans yet';

  ['kpi-scans','kpi-pipes','kpi-vulns'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0';
  });

  setTimeout(() => {
    termLog(`System armed. Welcome, ${document.getElementById('welcome-name').textContent.replace('Hello, ','')}`, 'term-line--success');
  }, 500);
}