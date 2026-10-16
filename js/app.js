/* =========================================================
   MUZZUP — by Frutopy · présentation interactive
   Toutes les données sont fictives (démo).
   ========================================================= */
(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const nf = (n, d = 0) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/[\u202F\u00A0]/g, '\u00A0');
  const money = n => nf(n, 3) + ' DT';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  /* ---------- icons (lucide-style paths) ---------- */
  const P = {
    logo: '<path d="M4 19V7l6.5 7.5L18 5"/><path d="M13.5 5H18v4.5"/><path d="M18 12.5V19"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowD: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    menu: '<line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/>',
    chevU: '<path d="m18 15-6-6-6 6"/>',
    chevD: '<path d="m6 9 6 6 6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    trend: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    signal: '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/>',
    battery: '<rect width="16" height="10" x="2" y="7" rx="2"/><line x1="22" x2="22" y1="11" y2="13"/><rect x="4" y="9" width="10" height="6" rx="1" fill="currentColor" stroke="none"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="8" height="8" x="8" y="8" rx="1"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2V7"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    layout: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  };
  const ic = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${name === 'logo' ? 2.6 : 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
  const paintIcons = (root = document) => $$('i[data-i]', root).forEach(el => { if (!el.dataset.done) { el.innerHTML = ic(el.dataset.i); el.dataset.done = '1'; } });

  /* ---------- toasts & confetti ---------- */
  function toast(msg, icon = 'check') {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = ic(icon) + `<span>${msg}</span>`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3000);
  }

  const cv = $('#confetti'), cx = cv.getContext('2d');
  let parts = [], confRaf = 0;
  function sizeCanvas() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
  sizeCanvas();
  function confetti(x = innerWidth / 2, y = innerHeight / 2, n = 90) {
    const cols = ['#E3263F', '#FF6A3D', '#F3C47A', '#5ED3B5', '#FFFFFF', '#9C8CFF'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, r: 3 + Math.random() * 5, c: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 1 });
    }
    if (!confRaf) confRaf = requestAnimationFrame(tickConfetti);
  }
  function tickConfetti() {
    const d = devicePixelRatio;
    cx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .011;
      cx.save(); cx.globalAlpha = Math.max(0, p.life); cx.translate(p.x * d, p.y * d); cx.rotate(p.rot);
      cx.fillStyle = p.c; cx.fillRect(-p.r * d / 2, -p.r * d / 4, p.r * d, p.r * d / 2); cx.restore();
    });
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
    confRaf = parts.length ? requestAnimationFrame(tickConfetti) : 0;
    if (!parts.length) cx.clearRect(0, 0, cv.width, cv.height);
  }
  const burstFrom = el => { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2); };

  /* ---------- fake QR ---------- */
  function drawQR(canvas, seed = 7, color = '#1D1113') {
    const g = canvas.getContext('2d'), N = 25, W = canvas.width, m = W / N, r = rng(seed);
    g.clearRect(0, 0, W, W);
    g.fillStyle = color;
    const finder = (fx, fy) => {
      g.fillRect(fx * m, fy * m, 7 * m, 7 * m);
      g.clearRect((fx + 1) * m, (fy + 1) * m, 5 * m, 5 * m);
      g.fillRect((fx + 2) * m, (fy + 2) * m, 3 * m, 3 * m);
    };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const inF = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
      if (!inF && r() > .52) g.fillRect(x * m, y * m, Math.ceil(m), Math.ceil(m));
    }
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  }

  /* =========================================================
     GLOBAL UI: nav, progress, reveal, counters, spotlight
     ========================================================= */
  const nav = $('#nav');
  const sections = $$('[data-title]');
  const navLinks = $$('#navLinks a');

  function onScroll() {
    const h = document.documentElement;
    $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 30);
    const mid = innerHeight * .35;
    let cur = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top <= mid) cur = s; });
    navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id));
    $$('#dotsNav a').forEach(a => a.classList.toggle('on', a.dataset.id === cur.id));
    $('#pCount').textContent = `${sections.indexOf(cur) + 1} / ${sections.length}`;
  }
  addEventListener('scroll', onScroll, { passive: true });

  $('#burger').addEventListener('click', () => nav.classList.toggle('open'));
  navLinks.forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  // dots nav
  $('#dotsNav').innerHTML = sections.map(s => `<a href="#${s.id}" data-id="${s.id}"><span>${s.dataset.title}</span></a>`).join('');

  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  // counters
  function countUp(el) {
    const to = +el.dataset.count, dur = 1600, t0 = performance.now();
    const step = t => { const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 4); el.textContent = nf(Math.round(to * e)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  // spotlight on cards
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // hero card tilt
  const stage = $('#stage'), hcard = $('#heroCard');
  if (stage && matchMedia('(hover:hover)').matches) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      hcard.style.setProperty('--ry', (px * 28 - 6) + 'deg');
      hcard.style.setProperty('--rx', (-py * 22 + 4) + 'deg');
      hcard.style.setProperty('--sx', (30 + px * 80) + '%');
    });
    stage.addEventListener('pointerleave', () => { ['--rx', '--ry', '--sx'].forEach(p => hcard.style.removeProperty(p)); });
  }

  // steps autoplay
  const steps = $$('.step');
  let stepIdx = 0, stepTimer = null;
  function setStep(i) {
    stepIdx = i;
    steps.forEach((s, k) => s.classList.toggle('on', k <= i));
    $('#stepsLine').style.width = (i / (steps.length - 1) * 100) + '%';
  }
  steps.forEach((s, i) => s.addEventListener('click', () => { setStep(i); clearInterval(stepTimer); stepTimer = null; }));
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !stepTimer) stepTimer = setInterval(() => setStep((stepIdx + 1) % steps.length), 2200);
    if (!e.isIntersecting && stepTimer) { clearInterval(stepTimer); stepTimer = null; }
  }), { threshold: .4 }).observe($('#steps'));

  /* ---------- presentation mode ---------- */
  const curIndex = () => { const mid = innerHeight * .35; let i = 0; sections.forEach((s, k) => { if (s.getBoundingClientRect().top <= mid) i = k; }); return i; };
  const goSection = d => { const i = clamp(curIndex() + d, 0, sections.length - 1); sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  function setPres(on) {
    document.body.classList.toggle('pres', on);
    try {
      if (on && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    } catch (_) { /* fullscreen non disponible */ }
    if (on) toast('Mode présentation : ↑ ↓ ou Espace pour naviguer, Échap pour quitter', 'play');
  }
  $('#presBtn').addEventListener('click', () => setPres(!document.body.classList.contains('pres')));
  $('#pExit').addEventListener('click', () => setPres(false));
  $('#pNext').addEventListener('click', () => goSection(1));
  $('#pPrev').addEventListener('click', () => goSection(-1));
  document.addEventListener('keydown', e => {
    if (!document.body.classList.contains('pres')) return;
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (['ArrowDown', 'PageDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); goSection(1); }
    if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); goSection(-1); }
    if (e.key === 'Escape') setPres(false);
  });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) document.body.classList.remove('pres'); });

  $('#partnerBtn').addEventListener('click', e => { toast("Merci ! L'équipe Frutopy vous recontacte sous 24 h.", 'store'); burstFrom(e.currentTarget); });

  /* =========================================================
     PHONE — app client
     ========================================================= */
  const S = {
    points: 486, stamps: 7, screen: 'welcome', rwCat: 'all', exFilter: 'all', lang: 0,
    activity: [
      { e: '🍖', t: "Gigot d'agneau · 1,2 kg", d: "Aujourd'hui · 10:24", v: 34 },
      { e: '🎁', t: 'Marinade maison offerte', d: 'Hier · 18:02', v: -120 },
      { e: '🥩', t: 'Entrecôtes × 2', d: 'Samedi · 09:12', v: 41 },
      { e: '🌭', t: 'Merguez maison · 0,5 kg', d: 'Mardi · 17:40', v: 15 }
    ]
  };
  const REWARDS = [
    { id: 'dec', e: '🔪', n: 'Découpe & préparation offertes', c: 80, cat: 'service' },
    { id: 'mar', e: '🫙', n: 'Marinade maison offerte', c: 120, cat: 'service' },
    { id: 'mer', e: '🌭', n: '1 kg de merguez maison', c: 300, cat: 'viande' },
    { id: 'bro', e: '🍢', n: 'Kit brochettes 1 kg', c: 450, cat: 'bbq' },
    { id: 'cdb', e: '🥩', n: 'Côte de bœuf maturée 1 kg', c: 600, cat: 'viande' },
    { id: 'bbq', e: '🔥', n: 'Panier barbecue famille', c: 900, cat: 'bbq' }
  ];
  const SHOPS = [
    { n: 'Dar El Lham', a: 'La Marsa · 0,4 km', r: 4.8, e: '🥩', bg: '#FDECEC', halal: 1, open: 1, delivery: 1, fav: 1, mine: 1 },
    { n: 'Boucherie Ennour', a: 'Le Kram · 2,1 km', r: 4.6, e: '🐑', bg: '#FBF1DE', halal: 1, open: 1, delivery: 0, fav: 0 },
    { n: 'Maison Sghaier', a: 'Carthage · 3,4 km', r: 4.9, e: '🐄', bg: '#E2F3F0', halal: 1, open: 0, delivery: 1, fav: 1 },
    { n: 'Boucherie du Lac', a: 'Les Berges du Lac · 5,2 km', r: 4.5, e: '🍗', bg: '#ECEAFD', halal: 0, open: 1, delivery: 1, fav: 0 },
    { n: 'El Fellah Viandes', a: 'Ariana · 8,7 km', r: 4.7, e: '🌿', bg: '#F1ECEA', halal: 1, open: 1, delivery: 0, fav: 0 }
  ];
  const SCREENS = [
    { id: 'welcome', t: 'Bienvenue', d: "Onboarding animé à l'ouverture", k: 'Onboarding', h: 'Une première impression premium', p: "Écran d'accueil animé, aux couleurs de la boucherie. Le client comprend en 3 secondes ce qu'il gagne.", li: ['Bénéfices clairs dès l\'ouverture', 'Accès direct si déjà membre', 'Disponible en français et en arabe'] },
    { id: 'signup', t: 'Inscription en 5 s', d: 'Prénom, téléphone, consentement', k: 'Acquisition', h: 'Inscription en 5 secondes', p: "Le client scanne le QR de la vitrine : la fiche de la boucherie s'ouvre déjà. Trois champs et un consentement RGPD.", li: ['Rien à installer pour commencer', 'Anniversaire pour les campagnes auto', 'Consentement marketing tracé'] },
    { id: 'otp', t: 'Vérification SMS', d: 'Code OTP puis ajout au Wallet', k: 'Sécurité', h: 'Code SMS & carte Wallet', p: "Le numéro est vérifié par OTP pour éviter doublons et fraude, puis la carte rejoint le Wallet du téléphone.", li: ['OTP à usage unique, expiration 5 min', 'Pass Apple & Google Wallet généré', 'Appareil & IP contrôlés (anti-fraude)'] },
    { id: 'home', t: 'Ma carte', d: 'Points, tampons, activité', k: 'Fidélité', h: 'La carte, toujours à jour', p: 'Points au dinar, tampons de passage et prochaine récompense. Touchez la carte pour afficher le QR membre.', li: ['Progression vers la prochaine récompense', 'Arrivages du jour mis en avant', 'Historique en temps réel'] },
    { id: 'scan', t: 'Scan du ticket', d: 'Crédit instantané des points', k: 'Au comptoir', h: 'Le crédit instantané', p: 'Le QR du ticket crédite les points en une seconde. La caisse du boucher et l\'app sont synchronisées.', li: ['Ticket détaillé au poids', 'Suggestion IA (cross-sell) visible', 'Tampon de passage automatique'] },
    { id: 'rewards', t: 'Récompenses', d: 'Échange de points contre des produits', k: 'Récompenses', h: 'Des cadeaux qui donnent faim', p: 'Merguez maison, côte de bœuf maturée, découpe offerte, kit barbecue : des récompenses pensées boucherie.', li: ['Échange en un geste', 'Bon à présenter au comptoir', 'Catalogue géré par le boucher'] },
    { id: 'explore', t: 'Boucheries du réseau', d: 'Carte, filtres, favoris', k: 'Réseau', h: 'Le réseau Muzzup', p: 'Toutes les boucheries partenaires autour du client. Une seule app, plusieurs cartes.', li: ['Filtres halal, ouvert, livraison', 'Favoris et distance', 'Cartes multiples dans le Wallet'] },
    { id: 'trace', t: 'Traçabilité', d: 'Origine, abattage, chaîne du froid', k: 'Confiance', h: 'La confiance, prouvée', p: "Le QR de l'étiquette raconte l'histoire de la viande : race, éleveur, abattage, chaîne du froid.", li: ['Certification halal affichée', 'Lot et dates vérifiables', 'Argument premium face à la grande surface'] },
    { id: 'notifs', t: 'Notifications', d: "Relances intelligentes de l'IA", k: 'Rétention', h: "L'IA relance au bon moment", p: 'Arrivages, tampons presque complets, clients absents : chaque notification part au bon moment, pour le bon client.', li: ['Push gratuites et illimitées', "Heure d'envoi optimisée par client", 'Respect du consentement RGPD'] },
    { id: 'profile', t: 'Profil & parrainage', d: 'Statut, code parrain, langue', k: 'Communauté', h: 'Statut & parrainage', p: 'Le client suit son statut, partage son code parrain et gère ses préférences.', li: ['Code parrain unique', 'Langue FR / العربية / Darija', 'Export & suppression des données'] }
  ];

  const phone = $('#phone');
  let tourTimer = null;

  $('#phoneList').innerHTML =
    `<button class="btn-ghost sm" id="tourBtn" style="justify-self:start;margin-bottom:8px">${ic('play')} Visite guidée automatique</button>` +
    SCREENS.map((s, i) => `<button class="demo-item${i === 0 ? ' on' : ''}" data-s="${s.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span><b>${s.t}</b><small>${s.d}</small></span></button>`).join('');

  function renderNote(id) {
    const s = SCREENS.find(x => x.id === id);
    $('#phoneNote').innerHTML = `<span class="eyebrow">${s.k}</span><h3>${s.h}</h3><p>${s.p}</p><ul>${s.li.map(l => `<li>${ic('check')}<span>${l}</span></li>`).join('')}</ul>` +
      (id === 'welcome' ? `<span class="hint">${ic('arrow')} Touchez « Activer ma carte »</span>` : '');
  }

  function ptoast(e, msg) {
    const t = $('#ptoast');
    $('#ptoastE').textContent = e; $('#ptoastTx').innerHTML = msg;
    t.classList.add('show');
    clearTimeout(ptoast.t); ptoast.t = setTimeout(() => t.classList.remove('show'), 2600);
  }

  const nextReward = () => REWARDS.filter(r => r.c > S.points).sort((a, b) => a.c - b.c)[0];
  function renderCard() {
    $$('.ptsSync').forEach(el => { el.textContent = nf(S.points); });
    const nr = nextReward();
    $('#ptsProg').style.width = nr ? clamp(S.points / nr.c * 100, 4, 100) + '%' : '100%';
    $('#ptsMeta').textContent = nr ? `Plus que ${nf(nr.c - S.points)} pts avant : ${nr.n.toLowerCase()}` : 'Toutes les récompenses sont débloquées 🎉';
    $('#stamps').innerHTML = Array.from({ length: 10 }, (_, i) => i < S.stamps ? '<i class="f">✓</i>' : (i === 9 ? '<i>🎁</i>' : '<i></i>')).join('');
    $('#stampMeta').textContent = `${S.stamps}/10 tampons · le 10e = 1 kg de haché offert`;
    $('#activity').innerHTML = S.activity.slice(0, 5).map(a => `<div class="p-row"><span class="e">${a.e}</span><div class="t"><b>${a.t}</b><small>${a.d}</small></div><span class="amt ${a.v < 0 ? 'neg' : ''}">${a.v > 0 ? '+' : '−'}${Math.abs(a.v)} pts</span></div>`).join('');
    renderRewards();
  }
  function addPoints(v, e, t) {
    S.points = Math.max(0, S.points + v);
    S.activity.unshift({ e, t, d: "Aujourd'hui · à l'instant", v });
    renderCard();
  }
  function addStamp() {
    S.stamps++;
    if (S.stamps >= 10) {
      S.stamps = 0;
      setTimeout(() => { ptoast('🎁', '<b>10e tampon !</b> 1 kg de viande hachée offert'); burstFrom(phone); }, 900);
    }
    renderCard();
  }

  function renderRewards() {
    $('#rewardList').innerHTML = REWARDS.filter(r => S.rwCat === 'all' || r.cat === S.rwCat).map(r => {
      const ok = S.points >= r.c;
      return `<div class="rw"><span class="e">${r.e}</span><div><b>${r.n}</b><small>${nf(r.c)} pts</small></div><button class="p-btn sm ${ok ? '' : 'ghost'}" data-rw="${r.id}" ${ok ? '' : 'disabled'}>${ok ? 'Échanger' : `${nf(r.c - S.points)} pts`}</button></div>`;
    }).join('');
  }

  function renderShops() {
    $('#shopList').innerHTML = SHOPS.map((s, i) => ({ s, i })).filter(({ s }) => S.exFilter === 'all' || s[S.exFilter]).map(({ s, i }) => `
      <div class="shop"><span class="img" style="background:${s.bg}">${s.e}</span>
        <div><b>${s.n}${s.mine ? ' · ma carte' : ''}</b><small>${ic('pin')} ${s.a} · ★ ${nf(s.r, 1)}</small>
          <div class="tags">${s.halal ? '<span>Halal</span>' : ''}${s.open ? '<span>Ouvert</span>' : '<span style="background:#F1ECEA;color:#7E716C">Fermé</span>'}${s.delivery ? '<span style="background:#ECEAFD;color:#5B4BDB">Livraison</span>' : ''}</div></div>
        <button class="fav ${s.fav ? 'on' : ''}" data-fav="${i}" aria-label="Favori">${ic('heart')}</button></div>`).join('') || '<p class="scr-sub" style="text-align:center;padding:20px">Aucune boucherie pour ce filtre.</p>';
  }

  function renderNotifs() {
    const left = 10 - S.stamps;
    const list = [
      { h: 'maintenant', b: 'Arrivage agneau frais 🐑', p: 'Épaule et gigot de Sidi Bouzid arrivés ce matin. On vous en met de côté ?' },
      { h: 'il y a 2 h', b: left <= 1 ? 'Plus qu\'un tampon 🎉' : `Plus que ${left} tampons 🎟️`, p: 'Le 10e passage = 1 kg de viande hachée offert.' },
      { h: 'hier', b: 'Ce week-end, on allume le barbecue 🔥', p: 'Kit brochettes + merguez : double points jusqu\'à dimanche.' }
    ];
    $('#notifList').innerHTML = list.map((n, i) => `<div class="notif" style="animation-delay:${.15 + i * .18}s"><div class="h"><span class="ap">${ic('logo')}</span>Dar El Lham · Muzzup<span>${n.h}</span></div><b>${n.b}</b><p>${n.p}</p></div>`).join('');
  }

  const enter = {
    otp: async () => {
      const ins = $$('#otp input');
      ins.forEach(i => { i.value = ''; });
      $('#passAnim').classList.remove('go');
      await sleep(700);
      for (let k = 0; k < 4; k++) {
        if (S.screen !== 'otp' || ins[k].value) return;
        ins[k].value = '4821'[k]; await sleep(220);
      }
    },
    notifs: renderNotifs,
    scan: () => { $('#scanner').classList.remove('done'); $('#scanBtn').innerHTML = `${ic('scan')} Simuler le scan`; }
  };

  function go(id, fromTour = false) {
    if (!fromTour) stopTour();
    const scr = $(`.scr[data-s="${id}"]`, phone);
    if (!scr) return;
    $$('.scr', phone).forEach(s => s.classList.toggle('on', s === scr));
    S.screen = id;
    $('#sbar').classList.toggle('light', scr.classList.contains('dark') || scr.classList.contains('lock'));
    $('#tabbar').classList.toggle('hide', ['welcome', 'signup', 'otp', 'notifs'].includes(id));
    $$('.tab', phone).forEach(t => t.classList.toggle('on', t.dataset.go === id));
    $$('#phoneList .demo-item').forEach(b => b.classList.toggle('on', b.dataset.s === id));
    renderNote(id);
    scr.scrollTop = 0;
    if (enter[id]) enter[id]();
  }

  function stopTour() {
    if (!tourTimer) return;
    clearInterval(tourTimer); tourTimer = null;
    $('#tourBtn').innerHTML = `${ic('play')} Visite guidée automatique`;
  }
  $('#tourBtn').addEventListener('click', () => {
    if (tourTimer) return stopTour();
    let i = SCREENS.findIndex(s => s.id === S.screen);
    $('#tourBtn').innerHTML = `${ic('x')} Arrêter la visite`;
    tourTimer = setInterval(() => { i = (i + 1) % SCREENS.length; go(SCREENS[i].id, true); }, 3200);
  });

  $('#phoneList').addEventListener('click', e => { const b = e.target.closest('.demo-item'); if (b) go(b.dataset.s); });

  phone.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { go(g.dataset.go); return; }

    const rw = e.target.closest('[data-rw]');
    if (rw) {
      const r = REWARDS.find(x => x.id === rw.dataset.rw);
      if (S.points < r.c) return;
      addPoints(-r.c, r.e, r.n);
      const code = 'MZ-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      ptoast('🎁', `<b>Bon généré</b> · présentez <b class="mono">${code}</b> au comptoir`);
      burstFrom(rw);
      return;
    }
    const seg = e.target.closest('#rwSeg button');
    if (seg) { $$('#rwSeg button').forEach(b => b.classList.toggle('on', b === seg)); S.rwCat = seg.dataset.cat; renderRewards(); return; }

    const ex = e.target.closest('#exSeg button');
    if (ex) { $$('#exSeg button').forEach(b => b.classList.toggle('on', b === ex)); S.exFilter = ex.dataset.f; renderShops(); return; }

    const fav = e.target.closest('[data-fav]');
    if (fav) { const s = SHOPS[+fav.dataset.fav]; s.fav = !s.fav; fav.classList.toggle('on', !!s.fav); ptoast(s.fav ? '❤️' : '🤍', s.fav ? `${s.n} ajoutée aux favoris` : `${s.n} retirée des favoris`); return; }
  });

  // card flip → member QR
  $('#pcard').addEventListener('click', () => {
    const c = $('#pcard');
    c.classList.add('flipping');
    setTimeout(() => { c.classList.toggle('flipped'); c.classList.remove('flipping'); }, 280);
  });

  // OTP manual typing
  $$('#otp input').forEach((inp, k, all) => inp.addEventListener('input', () => { if (inp.value && all[k + 1]) all[k + 1].focus(); }));
  $('#otpBtn').addEventListener('click', async () => {
    const name = ($('#suName').value || 'Sarra').trim();
    $('#helloName').textContent = name;
    $('#passAnim').classList.add('go');
    $('#otpBtn').disabled = true;
    await sleep(1700);
    $('#otpBtn').disabled = false;
    go('home');
    ptoast('✅', `<b>Carte créée, ${esc(name)} !</b> Ajoutée à votre Wallet`);
    burstFrom(phone);
  });

  // scan
  $('#scanBtn').addEventListener('click', async () => {
    const sc = $('#scanner'), btn = $('#scanBtn');
    if (sc.classList.contains('done')) { enter.scan(); return; }
    btn.disabled = true; btn.textContent = 'Lecture du QR…';
    await sleep(1400);
    sc.classList.add('done');
    addPoints(52, '🧾', 'Ticket #A-2291 · 52,400 DT');
    addStamp();
    btn.disabled = false; btn.innerHTML = `${ic('refresh')} Scanner un autre ticket`;
    ptoast('⭐', '<b>+52 points</b> et +1 tampon crédités');
  });

  // preorder
  // profile
  $('#refBtn').addEventListener('click', () => {
    try { navigator.clipboard && navigator.clipboard.writeText('https://muzzup.io/r/REF-SARRA-0448'); } catch (_) { /* presse-papiers indisponible */ }
    ptoast('🤝', '<b>Lien de parrainage copié</b> · muzzup.io/r/REF-SARRA-0448');
  });
  const LANGS = ['Langue · Français', 'Langue · العربية', 'Langue · Darija'];
  $('#langBtn').addEventListener('click', () => { S.lang = (S.lang + 1) % LANGS.length; $('#langTx').textContent = LANGS[S.lang]; });

  // QR drawings
  drawQR($('#memberQR'), 4821, '#1D1113');
  drawQR($('#scanQR'), 2291, '#ffffff');
  $('#lockDate').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  renderCard(); renderShops(); renderNote('welcome');

  /* =========================================================
     DASHBOARD — boucher
     ========================================================= */
  const dmain = $('#dmain');
  function goDashView(v) {
    $$('.dnav[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    $$('.view').forEach(x => x.classList.toggle('on', x.dataset.view === v));
    const b = $(`.dnav[data-v="${v}"]`);
    $('#dashUrl').textContent = b ? b.dataset.u : v;
    $('#drawer').classList.remove('open');
    dmain.scrollTop = 0;
    if (v === 'dash') renderDash();
  }
  $$('.dnav[data-v]').forEach(b => b.addEventListener('click', () => goDashView(b.dataset.v)));

  /* ----- tableau de bord ----- */
  const PERIODS = {
    7: { ca: 1180, caD: '↑ +12 % vs S-1', act: 268, actD: '↑ +14', ret: 36, retD: '↑ +2 pts', labels: ['Ven', 'Sam', 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu'], vals: [160, 260, 240, 40, 90, 150, 240] },
    30: { ca: 4860, caD: '↑ +18 % vs M-1', act: 412, actD: '↑ +37', ret: 38, retD: '↑ +9 pts', labels: ['17/09', '20/09', '23/09', '26/09', '29/09', '02/10', '05/10', '08/10', '11/10', '14/10'], vals: [330, 420, 380, 460, 510, 440, 520, 580, 560, 660] },
    365: { ca: 49560, caD: '↑ +64 % vs N-1', act: 1236, actD: '↑ +412', ret: 41, retD: '↑ +12 pts', labels: ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct'], vals: [2600, 3100, 2900, 4700, 5200, 3600, 7900, 3400, 3800, 3300, 4200, 4860] }
  };
  let period = 30;

  function spark(vals, color) {
    const max = Math.max(...vals), min = Math.min(...vals), w = 70, h = 28;
    const pts = vals.map((v, i) => `${(i / (vals.length - 1) * w).toFixed(1)},${(h - 2 - (v - min) / (max - min || 1) * (h - 4)).toFixed(1)}`).join(' ');
    return `<svg class="spark" viewBox="0 0 70 28"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function renderKpis() {
    const p = PERIODS[period];
    $('#kpis').innerHTML = `
      <div class="kpi hl"><div class="l">${ic('trend')}CA généré par Muzzup</div><div class="v">${nf(p.ca)} DT</div><div class="d">${p.caD}</div>${spark(p.vals, '#FFD9C9')}</div>
      <div class="kpi"><div class="l">${ic('users')}Clients actifs</div><div class="v">${nf(p.act)}</div><div class="d">${p.actD}</div>${spark(p.vals.map((v, i) => v * .6 + i * 30), '#2B8C7E')}</div>
      <div class="kpi"><div class="l">${ic('refresh')}Taux de retour</div><div class="v">${p.ret} %</div><div class="d">${p.retD}</div>${spark([30, 31, 33, 32, 34, 35, 36, p.ret], '#2B8C7E')}</div>
      <div class="kpi"><div class="l">${ic('alert')}Clients à risque</div><div class="v">31</div><div class="d warn">● à relancer</div>${spark([22, 25, 24, 28, 27, 30, 31], '#E3871B')}</div>`;
  }

  function smoothPath(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  function areaChart() {
    const el = $('#areaChart'), p = PERIODS[period];
    const W = el.clientWidth, H = el.clientHeight;
    if (!W) return;
    const pl = 44, pr = 10, pt = 12, pb = 26, vals = p.vals;
    const max = Math.max(...vals) * 1.18;
    const X = i => pl + i * (W - pl - pr) / (vals.length - 1);
    const Y = v => pt + (H - pt - pb) * (1 - v / max);
    const pts = vals.map((v, i) => [X(i), Y(v)]);
    const line = smoothPath(pts);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    let grid = '';
    for (let k = 0; k <= 4; k++) {
      const v = max * k / 4, y = Y(v);
      grid += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="#EFE4DD" stroke-dasharray="${k ? '3 4' : ''}"/><text x="${pl - 8}" y="${y + 4}" text-anchor="end" font-size="10.5" fill="#9B8A85" font-family="JetBrains Mono">${v >= 1000 ? nf(v / 1000, 1) + 'k' : Math.round(v)}</text>`;
    }
    const xl = p.labels.map((l, i) => `<text x="${X(i)}" y="${H - 6}" text-anchor="middle" font-size="10.5" fill="#9B8A85">${l}</text>`).join('');
    el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}">
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D0142F" stop-opacity=".28"/><stop offset="1" stop-color="#D0142F" stop-opacity="0"/></linearGradient></defs>
        ${grid}${xl}
        <line x1="${pl}" x2="${W - pr}" y1="${Y(avg)}" y2="${Y(avg)}" stroke="#C9B9B0" stroke-width="1.5" stroke-dasharray="6 5"/>
        <path d="${line} L${X(vals.length - 1)},${Y(0)} L${X(0)},${Y(0)} Z" fill="url(#ag)" class="fadein"/>
        <path d="${line}" fill="none" stroke="#D0142F" stroke-width="2.6" stroke-linecap="round" pathLength="1" class="draw"/>
        ${pts.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="3.2" fill="#fff" stroke="#D0142F" stroke-width="2"/>`).join('')}
        <line id="cx" y1="${pt}" y2="${H - pb}" stroke="#1D1113" stroke-opacity=".2" opacity="0"/>
        <circle id="cdot" r="6" fill="#D0142F" stroke="#fff" stroke-width="3" opacity="0"/>
      </svg><div class="ctip" id="ctip"></div>`;
    const svg = $('svg', el), tip = $('#ctip'), cxl = $('#cx'), dot = $('#cdot');
    svg.addEventListener('pointermove', e => {
      const r = svg.getBoundingClientRect(), mx = (e.clientX - r.left) * W / r.width;
      const i = clamp(Math.round((mx - pl) / ((W - pl - pr) / (vals.length - 1))), 0, vals.length - 1);
      cxl.setAttribute('x1', X(i)); cxl.setAttribute('x2', X(i)); cxl.setAttribute('opacity', 1);
      dot.setAttribute('cx', X(i)); dot.setAttribute('cy', Y(vals[i])); dot.setAttribute('opacity', 1);
      tip.innerHTML = `${p.labels[i]} · <b>+${nf(vals[i])} DT</b>`;
      tip.style.left = (X(i) / W * 100) + '%'; tip.style.top = (Y(vals[i]) / H * 100) + '%';
      tip.classList.add('show');
    });
    svg.addEventListener('pointerleave', () => { tip.classList.remove('show'); cxl.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); });
  }

  const SEGS = [
    { k: 'vip', n: 'VIP', v: 99, c: '#D0142F' },
    { k: 'reg', n: 'Réguliers', v: 169, c: '#2B8C7E' },
    { k: 'risk', n: 'À risque', v: 62, c: '#E3871B' },
    { k: 'lost', n: 'Perdus', v: 49, c: '#A0938E' },
    { k: 'pro', n: 'Pros (restos)', v: 33, c: '#5B4BDB' }
  ];
  const TOTAL = SEGS.reduce((a, s) => a + s.v, 0);

  function renderDonut() {
    const r = 62, C = 2 * Math.PI * r, gap = 3;
    let off = 0;
    const arcs = SEGS.map(s => {
      const len = s.v / TOTAL * C;
      const a = `<circle cx="85" cy="85" r="${r}" fill="none" stroke="${s.c}" stroke-width="20" stroke-dasharray="${Math.max(0, len - gap)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 85 85)" class="seg-arc"><title>${s.n} · ${s.v}</title></circle>`;
      off += len; return a;
    }).join('');
    $('#donut').innerHTML = `<svg width="170" height="170" viewBox="0 0 170 170">${arcs}</svg><div class="c"><b>${TOTAL}</b><small>clients</small></div>`;
    $('#segLegend').innerHTML = SEGS.map(s => `<div><i style="background:${s.c}"></i>${s.n}<b>${Math.round(s.v / TOTAL * 100)} %</b></div>`).join('');
  }

  function renderBars() {
    const cats = [['🐑 Agneau', 34], ['🐄 Bœuf', 27], ['🥩 Viande hachée', 18], ['🌭 Merguez', 13], ['🍗 Volaille', 8]];
    const ca = PERIODS[period].ca * 4.2;
    $('#catBars').innerHTML = cats.map(([n, p]) => `<div class="bar-row"><span>${n}</span><span class="tr"><i data-w="${p / 34 * 100}"></i></span><b>${nf(ca * p / 100)} DT</b></div>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => $$('#catBars i').forEach(i => { i.style.width = i.dataset.w + '%'; })));
  }

  function renderDash() { renderKpis(); areaChart(); renderDonut(); renderBars(); }

  $('#periodSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#periodSeg button').forEach(x => x.classList.toggle('on', x === b));
    period = +b.dataset.p; renderDash();
  });
  $('#recoLaunch').addEventListener('click', () => { goDashView('camp'); applyTpl('aid'); });

  /* ----- clients ----- */
  const CLIENTS = [
    { n: 'Sarra Ben Ali', c: '+216 22 ·· ·· 48', v: 38, ca: 1284, last: "aujourd'hui", fav: "Gigot d'agneau", churn: .06, seg: 'vip', rfm: [96, 92, 81], tags: ['Agneau', 'Merguez', 'Marinades'] },
    { n: 'Restaurant Le Golfe', c: 'Pro · La Goulette', v: 52, ca: 6420, last: 'hier', fav: 'Entrecôte', churn: .04, seg: 'pro', rfm: [91, 100, 97], tags: ['Bœuf', 'Agneau', 'Volumes'] },
    { n: 'Karim Mansour', c: 'karim·····@gmail.com', v: 21, ca: 742, last: 'il y a 19 j', fav: 'Merguez maison', churn: .71, seg: 'risk', rfm: [31, 58, 52], tags: ['Merguez', 'Brochettes'] },
    { n: 'Amira Gharbi', c: '+216 98 ·· ·· 12', v: 29, ca: 1105, last: 'avant-hier', fav: 'Côte de bœuf', churn: .09, seg: 'vip', rfm: [93, 84, 88], tags: ['Bœuf maturé', 'Épices'] },
    { n: 'Nour Trabelsi', c: 'nour·····@yahoo.fr', v: 14, ca: 388, last: 'il y a 4 j', fav: 'Escalope de dinde', churn: .18, seg: 'reg', rfm: [82, 41, 38], tags: ['Volaille', 'Haché'] },
    { n: 'Mehdi Jaziri', c: '+216 55 ·· ·· 70', v: 11, ca: 402, last: 'il y a 23 j', fav: 'Côtelettes', churn: .64, seg: 'risk', rfm: [27, 36, 44], tags: ['Agneau', 'Côtelettes'] },
    { n: 'Traiteur Yasmine', c: 'Pro · Ariana', v: 34, ca: 4980, last: 'il y a 3 j', fav: 'Viande hachée', churn: .11, seg: 'pro', rfm: [85, 78, 95], tags: ['Haché', 'Volaille', 'Événements'] },
    { n: 'Leïla Haddad', c: 'leila·····@gmail.com', v: 17, ca: 521, last: 'il y a 6 j', fav: 'Poulet fermier', churn: .21, seg: 'reg', rfm: [76, 52, 47], tags: ['Volaille', 'Agneau'] },
    { n: 'Yassine Belhaj', c: '+216 21 ·· ·· 03', v: 3, ca: 96, last: 'il y a 62 j', fav: 'Viande hachée', churn: .92, seg: 'lost', rfm: [5, 8, 20], tags: ['Haché'] },
    { n: 'Ines Chaabane', c: 'ines·····@outlook.com', v: 24, ca: 930, last: 'il y a 2 j', fav: 'Filet de bœuf', churn: .07, seg: 'vip', rfm: [90, 75, 79], tags: ['Bœuf', 'Filet'] },
    { n: 'Walid Kammoun', c: '+216 29 ·· ·· 55', v: 12, ca: 415, last: 'il y a 9 j', fav: "Épaule d'agneau", churn: .27, seg: 'reg', rfm: [64, 38, 45], tags: ['Agneau'] },
    { n: 'Rim Bouazizi', c: 'rim·····@gmail.com', v: 9, ca: 301, last: 'il y a 27 j', fav: 'Kefta', churn: .58, seg: 'risk', rfm: [22, 30, 39], tags: ['Kefta', 'Haché'] },
    { n: 'Skander Ayari', c: '+216 50 ·· ·· 91', v: 8, ca: 233, last: 'il y a 48 j', fav: 'Merguez', churn: .83, seg: 'lost', rfm: [11, 26, 31], tags: ['Merguez'] },
    { n: 'Fares Mejri', c: 'fares·····@gmail.com', v: 15, ca: 470, last: 'il y a 5 j', fav: 'Brochettes', churn: .15, seg: 'reg', rfm: [79, 44, 42], tags: ['Brochettes', 'BBQ'] }
  ];
  const SEGLAB = { vip: 'VIP', reg: 'Régulier', risk: 'À risque', lost: 'Perdu', pro: 'Pro' };
  const SEGCOL = { vip: ['#FDE7EA', '#D0142F'], reg: ['#E2F3F0', '#2B8C7E'], risk: ['#FDF0DF', '#B8650C'], lost: ['#F1ECEA', '#7E716C'], pro: ['#ECEAFD', '#5B4BDB'] };
  let cliSeg = 'all', cliQ = '';

  $('#segChips').innerHTML = [{ k: 'all', n: 'Tous', c: '#1D1113' }].concat(SEGS).map(s => `<button data-seg="${s.k}" class="${s.k === 'all' ? 'on' : ''}"><i style="background:${s.c}"></i>${s.n} <em>${s.k === 'all' ? CLIENTS.length : CLIENTS.filter(c => c.seg === s.k).length}</em></button>`).join('');
  $('#segChips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; cliSeg = b.dataset.seg; $$('#segChips button').forEach(x => x.classList.toggle('on', x === b)); renderClients(); });
  $('#cliSearch').addEventListener('input', e => { cliQ = e.target.value.toLowerCase(); renderClients(); });
  $('#globalSearch').addEventListener('input', e => {
    cliQ = e.target.value.toLowerCase(); $('#cliSearch').value = e.target.value;
    if (!$('.view[data-view="clients"]').classList.contains('on')) goDashView('clients');
    renderClients();
  });

  const filtered = () => CLIENTS.filter(c => (cliSeg === 'all' || c.seg === cliSeg) && (!cliQ || (c.n + ' ' + c.fav).toLowerCase().includes(cliQ)));
  const churnColor = p => p > .6 ? '#D0142F' : p > .3 ? '#E3871B' : '#2B8C7E';

  function renderClients() {
    const list = filtered();
    $('#cliCount').textContent = `412 clients · ${list.length} affichés`;
    $('#cliBody').innerHTML = list.map(c => {
      const [bg, fg] = SEGCOL[c.seg];
      return `<tr data-cli="${CLIENTS.indexOf(c)}">
        <td><span class="who"><span class="av" style="background:${bg};color:${fg}">${initials(c.n)}</span><span><b>${c.n}</b><small>${c.c}</small></span></span></td>
        <td class="mono">${c.v}</td><td class="mono">${nf(c.ca)} DT</td><td>${c.last}</td><td>${c.fav}</td>
        <td><span class="churn"><span class="tr"><i style="width:${c.churn * 100}%;background:${churnColor(c.churn)}"></i></span><span>${Math.round(c.churn * 100)} %</span></span></td>
        <td><span class="pill ${c.seg}">${SEGLAB[c.seg]}</span></td></tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:30px;color:#9B8A85">Aucun client ne correspond.</td></tr>';
  }

  function nextAction(c) {
    if (c.seg === 'risk' || c.seg === 'lost') return { t: `Envoyer −10 % sur « ${c.fav} » jeudi 18h`, why: `Absent ${c.last.replace('il y a ', 'depuis ')} · réactivation estimée ${Math.round((1 - c.churn) * 60 + 20)} %` };
    if (c.seg === 'pro') return { t: 'Proposer un tarif volume mensuel', why: 'Commandes régulières > 300 DT · potentiel B2B' };
    if (c.seg === 'vip') return { t: 'Inviter en avant-première aux précommandes Aïd', why: 'Client Or · réservation prioritaire' };
    return { t: 'Double points sur la prochaine visite', why: 'Fréquence en hausse · passage en Or proche' };
  }

  function openDrawer(i) {
    const c = CLIENTS[i], [bg, fg] = SEGCOL[c.seg], na = nextAction(c);
    $$('#cliBody tr').forEach(tr => tr.classList.toggle('sel', +tr.dataset.cli === i));
    $('#drawer').innerHTML = `
      <button class="x" id="dClose" aria-label="Fermer">${ic('x')}</button>
      <div class="hd"><span class="av" style="background:${bg};color:${fg}">${initials(c.n)}</span><div><h4>${c.n}</h4><span class="pill ${c.seg}">${SEGLAB[c.seg]}</span> <small style="color:#9B8A85;font-size:12px">${c.c}</small></div></div>
      <div class="blk"><b>Scores RFM normalisés</b><div class="rfm"><div><b>${c.rfm[0]}</b><small>Récence</small></div><div><b>${c.rfm[1]}</b><small>Fréquence</small></div><div><b>${c.rfm[2]}</b><small>Montant</small></div></div></div>
      <div class="blk"><b>Risque de départ (XGBoost)</b><div class="risk-meter"><div class="row"><span>Probabilité à 30 jours</span><b style="color:${churnColor(c.churn)}">${Math.round(c.churn * 100)} %</b></div><div class="tr"><i style="left:0%"></i></div></div></div>
      <div class="blk"><b>Habitudes</b><div class="taglist">${c.tags.map(t => `<span>${t}</span>`).join('')}<span>${c.v} visites</span><span>${nf(c.ca)} DT</span></div></div>
      <div class="blk"><b>Prochaine meilleure action · IA</b>
        <div class="dcard ai-reco" style="margin-top:8px"><span class="tg">${ic('sparkles')} Suggestion</span><h6 style="font-size:16px">${na.t}</h6><p>${na.why}</p><div class="row"><button class="dbtn" id="dAct">${ic('send')} Envoyer maintenant</button></div></div></div>`;
    $('#drawer').classList.add('open');
    requestAnimationFrame(() => requestAnimationFrame(() => { const k = $('#drawer .risk-meter i'); if (k) k.style.left = (c.churn * 100) + '%'; }));
    $('#dClose').onclick = () => { $('#drawer').classList.remove('open'); $$('#cliBody tr').forEach(tr => tr.classList.remove('sel')); };
    $('#dAct').onclick = e => { e.currentTarget.innerHTML = `${ic('check')} Envoyé`; e.currentTarget.disabled = true; toast(`Offre envoyée à ${c.n} · push + WhatsApp`, 'send'); };
  }
  $('#cliBody').addEventListener('click', e => { const tr = e.target.closest('tr[data-cli]'); if (tr) openDrawer(+tr.dataset.cli); });
  $('#exportBtn').addEventListener('click', () => toast(`Export CSV prêt · ${filtered().length} clients (données pseudonymisées)`, 'download'));
  $('#relaunchBtn').addEventListener('click', e => { toast(`Relance programmée pour ${filtered().length} clients · jeudi 18h`, 'send'); burstFrom(e.currentTarget); });

  /* ----- caisse ----- */
  const PRODUCTS = [
    { e: '🍖', n: "Gigot d'agneau", p: 28, u: 'kg', st: .5 },
    { e: '🥩', n: 'Entrecôte', p: 42, u: 'kg', st: .5 },
    { e: '🐄', n: 'Viande hachée', p: 36, u: 'kg', st: .5 },
    { e: '🌭', n: 'Merguez maison', p: 30, u: 'kg', st: .5 },
    { e: '🍗', n: 'Poulet fermier', p: 14, u: 'kg', st: 1 },
    { e: '🦃', n: 'Escalope dinde', p: 24, u: 'kg', st: .5 },
    { e: '🍢', n: 'Brochettes', p: 32, u: 'kg', st: .5 },
    { e: '🌶️', n: 'Harissa artisanale', p: 3.8, u: 'pot', st: 1 }
  ];
  const cart = {};
  let posClient = false;
  const progCfg = { pts: 1, stamps: 10, cb: 3, cbOn: false };

  function renderProds() {
    $('#prods').innerHTML = PRODUCTS.map((p, i) => `<button class="prod ${cart[i] ? 'has' : ''}" data-p="${i}"><span class="q">${cart[i] ? nf(cart[i], p.u === 'kg' ? 1 : 0) : ''}</span><span class="e">${p.e}</span><b>${p.n}</b><small>${nf(p.p, 3)} DT/${p.u}</small></button>`).join('');
  }
  function renderTicket() {
    const ids = Object.keys(cart).filter(k => cart[k] > 0);
    let sub = 0;
    $('#posLines').innerHTML = ids.length ? ids.map(k => {
      const p = PRODUCTS[k], q = cart[k], t = p.p * q; sub += t;
      return `<div><span>${p.e} ${p.n} · ${nf(q, p.u === 'kg' ? 1 : 0)} ${p.u}</span><b class="mono">${nf(t, 3)}</b></div>`;
    }).join('') : '<div class="empty">Aucun produit pour l\'instant</div>';
    const mult = posClient ? 1.5 : 1;
    const pts = Math.floor(sub * progCfg.pts * mult);
    $('#posSub').textContent = money(sub);
    $('#posTot').textContent = money(sub);
    $('#posPts').textContent = nf(pts);
    $('#posStamp').textContent = posClient ? `×1,5 statut Or · +1 tampon${progCfg.cbOn ? ` · cashback ${nf(sub * progCfg.cb / 100, 3)} DT` : ''}` : 'Identifiez le client pour créditer';
    // cross-sell suggestion (market basket)
    const hasMerguez = cart[3] > 0 || cart[6] > 0, hasHarissa = cart[7] > 0;
    const xs = $('#xsell');
    if (hasMerguez && !hasHarissa) {
      xs.innerHTML = `${ic('sparkles')}<span><b>Suggestion IA</b> · 64 % des clients prennent une harissa avec les merguez (lift 3,1)</span><button id="xsAdd">+ Ajouter</button>`;
      xs.classList.add('show');
      $('#xsAdd').onclick = () => { cart[7] = 1; renderProds(); renderTicket(); toast('Harissa ajoutée · cross-sell IA', 'sparkles'); };
    } else xs.classList.remove('show');
    return { sub, pts };
  }
  $('#prods').addEventListener('click', e => {
    const b = e.target.closest('[data-p]'); if (!b) return;
    const i = +b.dataset.p; cart[i] = Math.round(((cart[i] || 0) + PRODUCTS[i].st) * 10) / 10;
    renderProds(); renderTicket();
  });
  $('#identifyBtn').addEventListener('click', () => {
    posClient = true;
    $('#posClient').innerHTML = `<span class="who"><span class="av" style="background:#FDE7EA;color:#D0142F">SB</span><span><b>Sarra Ben Ali · ★ Or</b><small>${nf(S.points)} pts · ${S.stamps}/10 tampons · carte Wallet</small></span></span>`;
    toast('Carte Wallet scannée · Sarra Ben Ali identifiée', 'scan');
    renderTicket();
  });
  $('#posValidate').addEventListener('click', e => {
    const { sub, pts } = renderTicket();
    if (!sub) { toast('Ajoutez au moins un produit de l\'étal', 'alert'); return; }
    if (posClient) {
      addPoints(pts, '🧾', `Achat en boucherie · ${nf(sub, 3)} DT`);
      addStamp();
      toast(`Achat validé · +${pts} pts crédités sur le téléphone de Sarra`, 'check');
    } else toast(`Achat de ${money(sub)} validé (client non identifié)`, 'check');
    burstFrom(e.currentTarget);
    Object.keys(cart).forEach(k => delete cart[k]);
    posClient = false;
    $('#posClient').innerHTML = `<span class="who"><span class="av" style="background:#F1ECEA;color:#7E716C">?</span><span><b>Client non identifié</b><small>Scannez la carte Wallet du client</small></span></span>`;
    renderProds(); renderTicket();
  });

  /* ----- campagnes ----- */
  const TPL = [
    { id: 'absent', e: '👋', t: 'Relance absents', name: 'Relance clients absents', trig: 0, seg: ['risk'], title: 'On ne vous a pas vu depuis 14 jours 🥩', msg: 'Revenez cette semaine : −10 % sur votre viande hachée, rien que pour vous.' },
    { id: 'arrivage', e: '🐑', t: 'Arrivage frais', name: 'Arrivage agneau', trig: 1, seg: ['vip', 'reg'], title: 'Arrivage agneau frais ce matin 🐑', msg: 'Épaule et gigot de Sidi Bouzid. Réservez avant 12h, on vous les met de côté.' },
    { id: 'aid', e: '🌙', t: 'Aïd el-Kebir', name: 'Précommandes Aïd', trig: 2, seg: ['vip', 'reg'], title: "Réservez votre mouton de l'Aïd 🌙", msg: 'Précommandes ouvertes ! Membres Or : découpe offerte et retrait prioritaire.' },
    { id: 'ramadan', e: '🏮', t: 'Ramadan', name: 'Spécial Ramadan', trig: 3, seg: ['vip', 'reg', 'risk'], title: 'Ramadan Karim ✨', msg: 'Viande hachée pour bricks et chorba : −8 % chaque jour avant 15h.' },
    { id: 'bbq', e: '🔥', t: 'Week-end BBQ', name: 'Week-end barbecue', trig: 5, seg: ['vip', 'reg', 'risk'], title: 'Ce week-end, on allume le barbecue 🔥', msg: 'Kit brochettes + merguez : double points jusqu\'à dimanche.' },
    { id: 'bday', e: '🎂', t: 'Anniversaire', name: 'Anniversaire client', trig: 4, seg: ['vip', 'reg', 'risk', 'lost'], title: 'Joyeux anniversaire {prénom} 🎂', msg: '500 g de merguez maison vous attendent au comptoir, avec nos compliments.' }
  ];
  const RET = { vip: .42, reg: .31, risk: .18, lost: .07, pro: .35 };
  let camp = { tpl: TPL[0], seg: new Set(TPL[0].seg) };

  $('#tpls').innerHTML = TPL.map(t => `<button class="tpl" data-t="${t.id}"><span class="e">${t.e}</span><b>${t.t}</b></button>`).join('');
  $('#cTarget').innerHTML = SEGS.map(s => `<button data-seg="${s.k}"><i style="background:${s.c}"></i>${s.n} <em>${s.v}</em></button>`).join('');

  function campEstimate() {
    const segs = SEGS.filter(s => camp.seg.has(s.k));
    const aud = segs.reduce((a, s) => a + s.v, 0);
    const chans = $$('#cChannels .tog.on').length;
    const boost = 1 + Math.max(0, chans - 1) * .05;
    const ret = aud ? segs.reduce((a, s) => a + s.v * RET[s.k], 0) / aud * boost : 0;
    $('#eAud').textContent = nf(aud);
    $('#eRet').textContent = Math.round(ret * 100) + ' %';
    $('#eCA').textContent = nf(Math.round(aud * ret * 55));
  }
  function campPreview() {
    $('#cPrevT').textContent = camp.tpl.title.replace('{prénom}', 'Sarra');
    $('#cPrevM').textContent = $('#cMsg').value.replace('{prénom}', 'Sarra');
  }
  function applyTpl(id) {
    camp.tpl = TPL.find(t => t.id === id);
    camp.seg = new Set(camp.tpl.seg);
    $$('#tpls .tpl').forEach(b => b.classList.toggle('on', b.dataset.t === id));
    $$('#cTarget button').forEach(b => b.classList.toggle('on', camp.seg.has(b.dataset.seg)));
    $('#cName').value = camp.tpl.name;
    $('#cMsg').value = camp.tpl.msg;
    $('#cTrigger').selectedIndex = camp.tpl.trig;
    campPreview(); campEstimate();
    const n = $('#cPrev'); n.style.animation = 'none'; void n.offsetWidth; n.style.animation = '';
  }
  $('#tpls').addEventListener('click', e => { const b = e.target.closest('.tpl'); if (b) applyTpl(b.dataset.t); });
  $('#cTarget').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const k = b.dataset.seg; camp.seg.has(k) ? camp.seg.delete(k) : camp.seg.add(k); b.classList.toggle('on'); campEstimate(); });
  $('#cChannels').addEventListener('click', e => { const b = e.target.closest('.tog'); if (b) { b.classList.toggle('on'); campEstimate(); } });
  $('#cMsg').addEventListener('input', campPreview);
  $('#campLaunch').addEventListener('click', e => {
    if (!camp.seg.size) { toast('Choisissez au moins un segment cible', 'alert'); return; }
    toast(`Campagne « ${esc($('#cName').value)} » activée · ${$('#eAud').textContent} clients ciblés`, 'zap');
    burstFrom(e.currentTarget);
  });
  applyTpl('absent');

  /* ----- programme ----- */
  $$('.mech .switch').forEach((sw, i) => sw.addEventListener('click', () => { sw.classList.toggle('on'); if (i === 2) { progCfg.cbOn = sw.classList.contains('on'); renderTicket(); } }));
  progCfg.cbOn = $$('.mech .switch')[2].classList.contains('on');
  $('#rPts').addEventListener('input', e => { progCfg.pts = +e.target.value; $('#rPtsV').textContent = `${e.target.value} pt${e.target.value > 1 ? 's' : ''}`; renderTicket(); });
  $('#rSt').addEventListener('input', e => { progCfg.stamps = +e.target.value; $('#rStV').textContent = e.target.value; });
  $('#rCb').addEventListener('input', e => { progCfg.cb = +e.target.value; $('#rCbV').textContent = `${e.target.value} %`; renderTicket(); });
  let qrSeed = 99;
  drawQR($('#shopQR'), qrSeed);
  $('#qrRegen').addEventListener('click', () => { drawQR($('#shopQR'), ++qrSeed); toast('Nouveau QR vitrine généré · l\'ancien est désactivé', 'refresh'); });
  $('#qrPrint').addEventListener('click', () => toast('Affiche A4 prête à imprimer · « Scannez. Cumulez. Régalez-vous. »', 'download'));
  $('#progSave').addEventListener('click', () => toast('Programme de fidélité enregistré et appliqué en caisse', 'check'));

  /* ----- précommandes ----- */
  const COLS = ['Reçues', 'Acompte payé', 'Prêtes', 'Retirées'];
  const PRE = [
    { n: 'Karim Mansour', a: 'Mouton entier', s: 'Veille · 08h', dep: 250, col: 0 },
    { n: 'Restaurant Le Golfe', a: '3 moutons entiers', s: 'Veille · 06h', dep: 750, col: 1 },
    { n: 'Amira Gharbi', a: 'Demi-mouton', s: 'Veille · 14h', dep: 128, col: 1 },
    { n: 'Leïla Haddad', a: 'Colis découpe 8 kg', s: 'Jour J · 06h', dep: 64, col: 0 },
    { n: 'Ines Chaabane', a: 'Mouton entier', s: 'Veille · 08h', dep: 250, col: 2 },
    { n: 'Walid Kammoun', a: 'Demi-mouton', s: 'Veille · 14h', dep: 128, col: 1 },
    { n: 'Fares Mejri', a: 'Colis découpe 8 kg', s: 'Veille · 08h', dep: 64, col: 3 },
    { n: 'Traiteur Yasmine', a: '2 moutons entiers', s: 'Veille · 06h', dep: 500, col: 2 },
    { n: 'Nour Trabelsi', a: 'Colis découpe 8 kg', s: 'Jour J · 06h', dep: 64, col: 0 }
  ];
  function renderKanban() {
    $('#kanban').innerHTML = COLS.map((c, ci) => {
      const items = PRE.map((p, i) => ({ p, i })).filter(x => x.p.col === ci);
      return `<div class="kcol"><h6>${c}<span>${items.length}</span></h6>${items.map(({ p, i }) => `
        <div class="kitem"${p.fresh ? ' style="border-color:#D0142F;box-shadow:0 0 0 3px rgba(208,20,47,.1)"' : ''}><b>${p.n}</b><small>${p.a} · ${p.s}</small>
          <div class="r"><span class="pill ${ci === 3 ? 'ok' : ci === 0 ? 'wait' : 'reg'}">${p.dep} DT</span>${ci < 3 ? `<button data-adv="${i}">${ci === 0 ? 'Confirmer' : ci === 1 ? 'Prêt' : 'Retiré'} ${ic('chevR')}</button>` : `<span style="color:#2B8C7E;font-size:11px;font-weight:700">✓ Retiré</span>`}</div></div>`).join('')}</div>`;
    }).join('');
    $('#preTotal').textContent = PRE.length;
    $('#preDep').textContent = nf(PRE.filter(p => p.col > 0).reduce((a, p) => a + p.dep, 0));
    $('#preBadge').textContent = PRE.filter(p => p.col < 3).length;
  }
  $('#kanban').addEventListener('click', e => {
    const b = e.target.closest('[data-adv]'); if (!b) return;
    const p = PRE[+b.dataset.adv]; p.col++; p.fresh = false; renderKanban();
    toast(`${p.n} · ${COLS[p.col].toLowerCase()} — SMS de suivi envoyé`, 'check');
  });
  $('#preAdd').addEventListener('click', () => { PRE.push({ n: 'Client comptoir #' + (PRE.length + 1), a: 'Mouton entier', s: 'Veille · 14h', dep: 250, col: 0 }); renderKanban(); toast('Réservation comptoir ajoutée · ticket imprimé', 'plus'); });
  renderKanban();

  /* ----- avis ----- */
  const REVIEWS = [
    { n: 'Amira G.', src: 'Google', st: 5, s: 'pos', t: "Viande toujours fraîche et un boucher qui conseille vraiment bien. Avec la carte Muzzup j'ai eu ma marinade offerte !", rep: "Merci Amira 🙏 Ravis que la marinade vous ait plu ! Votre prochaine récompense (côte de bœuf maturée) n'est plus très loin. À très vite chez Dar El Lham." },
    { n: 'Mehdi J.', src: 'Facebook', st: 2, s: 'neg', t: 'Attente de 40 minutes samedi matin, dommage car la qualité est là.', rep: "Bonjour Mehdi, toutes nos excuses pour cette attente. Désormais, vous pouvez précommander dans l'app Muzzup et récupérer sans file. Un geste vous attend sur votre carte : −10 % sur votre prochaine visite." },
    { n: 'Leïla H.', src: 'Google', st: 4, s: 'pos', t: "Très bon agneau. Un peu plus cher qu'en grande surface, mais on sait d'où vient la viande grâce au QR sur l'étiquette.", rep: 'Merci Leïla ! La traçabilité est notre fierté : race, éleveur et date d\'abattage sont visibles sur chaque lot. Au plaisir de vous revoir.' },
    { n: 'Fares M.', src: 'Google', st: 3, s: 'neu', t: "Correct. J'aimerais pouvoir commander en ligne pour récupérer plus vite le vendredi.", rep: 'Bonne nouvelle Fares : la précommande avec créneau de retrait est disponible dans l\'app Muzzup depuis cette semaine 😉' }
  ];
  const SENTLAB = { pos: 'Positif', neu: 'Neutre', neg: 'Négatif' };
  $('#revList').innerHTML = REVIEWS.map((r, i) => `
    <div class="rv-item"><span class="av" style="background:${r.s === 'neg' ? '#FDE7EA' : r.s === 'neu' ? '#F1ECEA' : '#E2F3F0'};color:${r.s === 'neg' ? '#D0142F' : r.s === 'neu' ? '#7E716C' : '#2B8C7E'}">${initials(r.n)}</span>
      <div><div class="top"><b style="font-size:13px">${r.n} <small style="color:#9B8A85;font-weight:500">· ${r.src}</small></b><span class="stars">${'★'.repeat(r.st)}${'☆'.repeat(5 - r.st)}</span><span class="sent ${r.s}">${SENTLAB[r.s]}</span></div>
      <p>${r.t}</p><div class="reply" id="rep${i}"><b>Réponse suggérée par l'IA</b><br>${r.rep}</div>
      <div class="acts"><button class="dbtn ghost" data-rep="${i}" style="padding:7px 11px;font-size:12px">${ic('sparkles')} Générer une réponse IA</button></div></div></div>`).join('');
  $('#revList').addEventListener('click', e => {
    const b = e.target.closest('[data-rep]'); if (!b) return;
    const box = $('#rep' + b.dataset.rep);
    if (box.classList.contains('show')) { toast('Réponse publiée sur ' + REVIEWS[+b.dataset.rep].src, 'send'); b.innerHTML = `${ic('check')} Publiée`; b.disabled = true; return; }
    b.innerHTML = 'Rédaction…';
    setTimeout(() => { box.classList.add('show'); b.innerHTML = `${ic('send')} Publier la réponse`; }, 700);
  });

  renderDash(); renderClients(); renderProds(); renderTicket();

  /* =========================================================
     MUZZUP AI
     ========================================================= */
  /* ----- RFM ----- */
  const RFMC = [
    { n: 'Restaurant Le Golfe', s: [.88, 1, .97] },
    { n: 'Sarra Ben Ali', s: [.96, .92, .81] },
    { n: 'Nour Trabelsi', s: [.82, .41, .38] },
    { n: 'Karim Mansour', s: [.31, .58, .52] },
    { n: 'Yassine Belhaj', s: [.05, .08, .2] }
  ];
  function rfmSeg(v) { return v >= .75 ? ['VIP', 'st-vip'] : v >= .5 ? ['Régulier', 'st-reg'] : v >= .3 ? ['À risque', 'st-risk'] : ['Perdu', 'st-lost']; }
  function renderRFM() {
    const r = +$('#wR').value, f = +$('#wF').value, m = +$('#wM').value, sum = r + f + m || 1;
    const w = [r / sum, f / sum, m / sum];
    $('#oR').textContent = Math.round(w[0] * 100) + ' %'; $('#oF').textContent = Math.round(w[1] * 100) + ' %'; $('#oM').textContent = Math.round(w[2] * 100) + ' %';
    $('#fWr').textContent = w[0].toFixed(2); $('#fWf').textContent = w[1].toFixed(2); $('#fWm').textContent = w[2].toFixed(2);
    const rows = RFMC.map(c => { const v = c.s[0] * w[0] + c.s[1] * w[1] + c.s[2] * w[2]; const [l, cls] = rfmSeg(v); return `<div class="r"><span>${c.n}</span><span class="tr"><i style="width:${v * 100}%"></i></span><b>${v.toFixed(2)}</b><span class="seg-tag ${cls}">${l}</span></div>`; });
    $('#rfmRes').innerHTML = rows.join('');
  }
  ['wR', 'wF', 'wM'].forEach(id => $('#' + id).addEventListener('input', renderRFM));
  renderRFM();

  /* ----- churn ----- */
  const CHURN = [
    { n: 'Yassine Belhaj', w: '62 j sans visite · panier ↓ 40 %', p: .92 },
    { n: 'Skander Ayari', w: '48 j sans visite · fréquence ↓ 70 %', p: .83 },
    { n: 'Karim Mansour', w: '19 j · rythme habituel : 7 j', p: .71 },
    { n: 'Mehdi Jaziri', w: 'Avis négatif récent · 23 j', p: .64 },
    { n: 'Rim Bouazizi', w: '27 j · achète ailleurs le vendredi', p: .58 }
  ];
  $('#churnList').innerHTML = CHURN.map((c, i) => `<div class="cl-row"><span class="av">${initials(c.n)}</span><div><b>${c.n}</b><small>${c.w}</small><span class="mbar"><i style="width:${c.p * 100}%"></i></span></div><div class="pr"><span>${Math.round(c.p * 100)} %</span><button class="mini-btn" data-ch="${i}">Relancer</button></div></div>`).join('');
  $('#churnList').addEventListener('click', e => {
    const b = e.target.closest('[data-ch]'); if (!b) return;
    b.textContent = 'Envoyé ✓'; b.classList.add('done');
    toast(`Offre de réactivation envoyée à ${CHURN[+b.dataset.ch].n}`, 'send');
  });

  /* ----- GMM scatter ----- */
  (function renderGMM() {
    const svg = $('#scatter'), W = 400, H = 260, pad = 28;
    const CL = [
      { n: 'VIP', c: '#FF4D5E', mx: .84, my: .78, sx: .07, sy: .09, k: 26 },
      { n: 'Réguliers', c: '#5ED3B5', mx: .66, my: .45, sx: .1, sy: .08, k: 40 },
      { n: 'À risque', c: '#FFB547', mx: .34, my: .42, sx: .08, sy: .1, k: 22 },
      { n: 'Perdus', c: '#8C7D78', mx: .12, my: .16, sx: .06, sy: .07, k: 18 }
    ];
    const r = rng(42), gauss = () => { const u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const X = v => pad + v * (W - pad - 10), Y = v => H - pad - v * (H - pad - 10);
    let out = `<line x1="${pad}" y1="${H - pad}" x2="${W - 6}" y2="${H - pad}" stroke="rgba(255,255,255,.15)"/><line x1="${pad}" y1="8" x2="${pad}" y2="${H - pad}" stroke="rgba(255,255,255,.15)"/>
      <text x="${W - 8}" y="${H - 10}" text-anchor="end" fill="#7F6D68" font-size="10" font-family="JetBrains Mono">RÉCENCE →</text>
      <text x="12" y="14" fill="#7F6D68" font-size="10" font-family="JetBrains Mono" transform="rotate(-90 12 14) translate(-70 0)">MONTANT →</text>`;
    let delay = 0;
    CL.forEach(c => {
      out += `<ellipse cx="${X(c.mx)}" cy="${Y(c.my)}" rx="${c.sx * 2.2 * (W - pad)}" ry="${c.sy * 2.2 * (H - pad)}" fill="${c.c}" fill-opacity=".07" stroke="${c.c}" stroke-opacity=".35" stroke-dasharray="4 4"/>`;
      for (let i = 0; i < c.k; i++) {
        const x = clamp(c.mx + gauss() * c.sx, .01, .99), y = clamp(c.my + gauss() * c.sy, .01, .99);
        out += `<circle class="pt" cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="${(3 + r() * 2.5).toFixed(1)}" fill="${c.c}" fill-opacity=".85" style="animation-delay:${(delay += 12)}ms"/>`;
      }
    });
    svg.innerHTML = out;
    $('#gmmLegend').innerHTML = CL.map(c => `<span><i style="background:${c.c}"></i>${c.n}</span>`).join('');
  })();

  /* ----- heatmap heures creuses ----- */
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], HOURS = Array.from({ length: 12 }, (_, i) => 8 + i);
  const STOPS = [[42, 26, 29], [107, 26, 38], [200, 32, 47], [255, 122, 77], [255, 194, 122]];
  const heatColor = t => { const s = clamp(t, 0, 1) * (STOPS.length - 1), i = Math.min(Math.floor(s), STOPS.length - 2), f = s - i; const c = STOPS[i].map((v, k) => Math.round(v + (STOPS[i + 1][k] - v) * f)); return `rgb(${c})`; };
  const hr = rng(7);
  const traffic = (d, h) => {
    let v = .35;
    if (h >= 9 && h <= 12) v += .3;
    if (h >= 17 && h <= 19) v += .25;
    if (h >= 14 && h <= 16) v -= .22;
    if (d === 5) v += .3; if (d === 6) v += h < 13 ? .25 : -.1; if (d === 4) v += h >= 16 ? .2 : 0;
    if (d === 0) v -= h >= 13 ? .3 : .05;
    return clamp(v + (hr() - .5) * .14, .03, 1);
  };
  const HEAT = DAYS.map((_, d) => HOURS.map(h => traffic(d, h)));
  $('#heat').innerHTML = '<span></span>' + HOURS.map(h => `<span class="h${h % 2 ? ' odd' : ''}">${h}h</span>`).join('') +
    DAYS.map((d, di) => `<span class="d">${d}</span>` + HOURS.map((h, hi) => `<span class="c" style="background:${heatColor(HEAT[di][hi])}" data-d="${di}" data-h="${hi}" title="${d} ${h}h"></span>`).join('')).join('');
  const FLASH = [['viande hachée', 15], ['escalopes de dinde', 12], ['merguez maison', 15], ['poulet fermier', 10], ['brochettes', 12]];
  $('#heat').addEventListener('click', e => {
    const c = e.target.closest('.c'); if (!c) return;
    $$('#heat .c').forEach(x => x.classList.toggle('sel', x === c));
    const di = +c.dataset.d, hi = +c.dataset.h, v = HEAT[di][hi];
    const avg = HEAT.flat().reduce((a, b) => a + b, 0) / (7 * 12);
    const diff = Math.round((v / avg - 1) * 100);
    const slot = `${DAYS[di]} ${HOURS[hi]}h–${HOURS[hi] + 1}h`;
    if (v < .45) {
      const [prod, pct] = FLASH[(di + hi) % FLASH.length];
      $('#flash').innerHTML = `<span class="e">⚡</span><div><b>${slot} · affluence ${diff} % vs moyenne</b><small>Offre flash suggérée : −${pct} % sur ${prod}, valable 2 h, envoyée 30 min avant à 128 clients dans un rayon de 5 km.</small></div><button class="mini-btn" id="flashGo">Programmer</button>`;
      $('#flashGo').onclick = ev => { ev.currentTarget.textContent = 'Programmée ✓'; ev.currentTarget.classList.add('done'); toast(`Offre flash ${slot} programmée · code FLASH-${(di + 1) * 100 + hi}`, 'zap'); };
    } else {
      $('#flash').innerHTML = `<span class="e">🔥</span><div><b>${slot} · affluence +${Math.max(diff, 0)} % vs moyenne</b><small>Créneau de rush : aucune offre nécessaire. L'IA suggère plutôt la précommande pour fluidifier l'attente.</small></div>`;
    }
  });

  /* ----- cross-sell rules ----- */
  const RULES = [
    ['🌭 Merguez maison', '🌶️ Harissa artisanale', 18, 64, 3.1],
    ['🥩 Côte de bœuf', '🧂 Sel fumé & beurre', 7, 52, 2.7],
    ['🐄 Viande hachée', '🥟 Feuilles de brick', 15, 47, 2.4],
    ["🍖 Gigot d'agneau", '🌿 Mélange d\'épices', 9, 41, 2.2],
    ['🍗 Poulet fermier', '🍋 Marinade citron-thym', 11, 38, 1.9]
  ];
  $('#rules').innerHTML = RULES.map(r => `<div class="rule"><span class="ar">${r[0]} ${ic('arrow')} ${r[1]}</span><span class="mt"><span>sup ${r[2]}%</span><span>conf ${r[3]}%</span><span class="l">lift ${nf(r[4], 1)}</span></span></div>`).join('');

  /* ----- fraud gauge ----- */
  const SIG = [
    ['Appareil partagé entre comptes', .3], ['Adresse IP partagée', .3], ['E-mail jetable ou alias', .2],
    ['Achats/jour anormaux', .2], ['Panier hors normes', .2], ['Compte bloqué par le chatbot', .3]
  ];
  const sigOn = new Set();
  $('#signals').innerHTML = SIG.map((s, i) => `<div class="sig" data-sig="${i}"><span>${s[0]}</span><b>−${s[1].toFixed(2)}</b></div>`).join('');
  function renderGauge() {
    const score = Math.max(0, 1 - [...sigOn].reduce((a, i) => a + SIG[i][1], 0));
    const L = Math.PI * 70, col = score >= .6 ? '#5ED3B5' : score >= .3 ? '#FFB547' : '#FF4D5E';
    const st = score >= .6 ? 'Fiable' : score >= .3 ? 'Surveillance' : 'Bloqué auto';
    $('#gauge').innerHTML = `<path d="M15 90 A70 70 0 0 1 155 90" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="14" stroke-linecap="round"/>
      <path d="M15 90 A70 70 0 0 1 155 90" fill="none" stroke="${col}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${L * score} ${L}" style="transition:stroke-dasharray .6s,stroke .3s"/>
      <text x="85" y="78" text-anchor="middle" fill="#F8EEE9" font-size="28" font-weight="800" font-family="Bricolage Grotesque">${score.toFixed(2)}</text>
      <text x="85" y="96" text-anchor="middle" fill="${col}" font-size="11" font-weight="700" font-family="Inter">${st.toUpperCase()}</text>`;
  }
  $('#signals').addEventListener('click', e => {
    const s = e.target.closest('.sig'); if (!s) return;
    const i = +s.dataset.sig; sigOn.has(i) ? sigOn.delete(i) : sigOn.add(i); s.classList.toggle('on');
    const before = $('#gauge text').textContent; renderGauge();
    if (+$('#gauge text').textContent < .3 && +before >= .3) toast('Score < 0,30 : compte bloqué automatiquement, points gelés', 'shield');
  });
  renderGauge();

  /* ----- sentiment ----- */
  $('#senti').innerHTML = [
    ['Amira G.', 'pos', 'Viande toujours fraîche, boucher de bon conseil.', ['fraîcheur', 'conseil']],
    ['Mehdi J.', 'neg', 'Attente de 40 minutes samedi matin.', ['attente', 'samedi']],
    ['Leïla H.', 'pos', "On sait d'où vient la viande grâce au QR.", ['traçabilité', 'prix']]
  ].map(([n, s, t, tags]) => `<div class="s"><div class="t"><b>${n}</b><span class="seg-tag ${s === 'pos' ? 'st-reg' : 'st-vip'}">${s === 'pos' ? 'Positif' : 'Négatif'}</span></div><p>${t}</p><div class="tags">${tags.map(x => `<span>#${x}</span>`).join('')}</div></div>`).join('');

  /* ----- chatbot ----- */
  const chatB = $('#chatB');
  const nextR = () => nextReward();
  const INTENTS = [
    { re: /[؀-ۿ]/, lang: 'العربية', intent: 'Produits · AR', a: () => 'أهلا وسهلا! 🐑 وصل علوش طازج من سيدي بوزيد اليوم: الجيڨو بـ 28 دينار للكيلو. نحجزلك؟' },
    { re: /aslema|3and|chniya|9adech|kadech|barcha|n7eb|nheb|ya5i|lyoum|3allouch/i, lang: 'Darija', intent: 'Produits · Darija', a: () => 'Aslema! 🐑 Ey 3andna 3allouch jdid lyoum men Sidi Bouzid : gigot b 28 DT/kg. N7adhrouhoulek ?' },
    { re: /pas fra[iî]|probl|plainte|mauvais|rembours|retour|déçu|decu|arnaque|en retard/i, intent: 'Plainte SAV · escalade humaine', a: () => "Je suis vraiment désolé 🙏 J'ai ouvert le ticket #SAV-2291 : un conseiller vous recontacte sous 2 h. En attendant, un avoir de 10 DT a été ajouté à votre carte." },
    { re: /point|solde|carte|fidél|fidel|tampon/i, intent: 'Fidélité', a: () => { const r = nextR(); return `Vous avez ${nf(S.points)} points et ${S.stamps}/10 tampons ⭐ ${r ? `Plus que ${nf(r.c - S.points)} pts avant : ${r.n.toLowerCase()}.` : 'Toutes les récompenses sont débloquées !'}`; } },
    { re: /\ba[iï]d\b|mouton|précommande|precommande|réserv|reserv|kbir/i, intent: 'Commande · Aïd', a: () => "Les précommandes de l'Aïd sont ouvertes 🌙 Mouton entier ≈ 1 250 DT, acompte de 20 %, retrait la veille dès 8h. Je vous ouvre la réservation dans l'app ?" },
    { re: /agneau|boeuf|bœuf|poulet|viande|arrivage|dispo|stock|merguez|haché|hache|côte|cote/i, intent: 'Produits', a: () => "Oui ! Arrivage d'agneau de Sidi Bouzid ce matin 🐑 Gigot à 28 DT/kg, épaule à 26 DT/kg, merguez maison à 30 DT/kg. Je vous en mets de côté ?" },
    { re: /heure|horaire|ouvert|ferm/i, intent: 'Aide générale', a: () => 'Nous sommes ouverts du mardi au dimanche, 7h30–13h30 et 16h–20h 🕗 Le lundi, ouverture le matin seulement.' },
    { re: /livr/i, intent: 'Livraison', a: () => 'Livraison à La Marsa, Gammarth et Le Kram dès 80 DT d\'achat, sur un créneau de 2 h 🛵' },
    { re: /parrain|\bamis?\b|code/i, intent: 'Parrainage', a: () => 'Votre code est REF-SARRA-0448 🤝 500 g de viande hachée offerts à vous et à votre filleul dès son premier achat.' },
    { re: /promo|réduc|reduc|offre|remise/i, intent: 'Promotions', a: () => 'Cette semaine : double points sur les brochettes 🔥 et −15 % sur la viande hachée le mardi de 14h à 16h ⚡' },
    { re: /merci|chokran|yaatik|ya3tik/i, intent: 'Remerciement', a: () => 'Avec plaisir ! Bonne journée et bon appétit 🍽️' },
    { re: /bonjour|salut|salam|hello|bonsoir|ahla/i, intent: 'Salutation', a: () => "Bonjour 👋 Je suis l'assistant de Dar El Lham. Je peux vous aider pour vos points, une précommande, les arrivages ou une réclamation." }
  ];
  function addMsg(txt, who, intent) {
    const m = document.createElement('div');
    m.className = 'msg ' + who;
    m.dir = 'auto';
    m.innerHTML = esc(txt) + (intent ? `<br><span class="intent">intent : ${intent}</span>` : '');
    chatB.appendChild(m); chatB.scrollTop = chatB.scrollHeight;
  }
  async function ask(q) {
    q = q.trim(); if (!q) return;
    addMsg(q, 'me');
    const hit = INTENTS.find(i => i.re.test(q));
    $('#chatLang').textContent = hit && hit.lang ? hit.lang : 'FR';
    const t = document.createElement('div'); t.className = 'msg bot typing'; t.innerHTML = '<i></i><i></i><i></i>';
    chatB.appendChild(t); chatB.scrollTop = chatB.scrollHeight;
    await sleep(650 + Math.random() * 500);
    t.remove();
    if (hit) addMsg(hit.a(), 'bot', hit.intent);
    else addMsg("Je transmets votre question à l'équipe 🙂 En attendant, je peux vous aider pour : points, précommandes, arrivages, horaires ou réclamations.", 'bot', 'Autre · réponse incertaine → escalade possible');
  }
  addMsg("Bonjour 👋 Je suis l'assistant de Dar El Lham. Posez-moi une question en français, en darija ou en arabe.", 'bot');
  const SUG = ["Vous avez de l'agneau ?", "Combien j'ai de points ?", "Réserver un mouton pour l'Aïd", 'Vos horaires ?', 'Aslema, 3andkom 3allouch ?', "Ma viande n'était pas fraîche", 'عندكم علوش؟', 'Une promo cette semaine ?'];
  $('#chatS').innerHTML = SUG.map(s => `<button type="button">${esc(s)}</button>`).join('');
  $('#chatS').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  $('#chatF').addEventListener('submit', e => { e.preventDefault(); const i = $('#chatI'); ask(i.value); i.value = ''; });

  /* =========================================================
     CONSOLE FRUTOPY (super admin)
     ========================================================= */
  const SHOPS_ADM = [
    { n: 'Dar El Lham', city: 'La Marsa', cl: 412, ca: 4860, st: 'active' },
    { n: 'Maison Sghaier', city: 'Carthage', cl: 351, ca: 4410, st: 'active' },
    { n: 'Le Comptoir du Boucher', city: 'Sousse', cl: 307, ca: 3650, st: 'active' },
    { n: 'Boucherie Ennour', city: 'Le Kram', cl: 286, ca: 3120, st: 'active' },
    { n: 'Boucherie du Lac', city: 'Tunis', cl: 198, ca: 2050, st: 'active' },
    { n: 'Boucherie Errahma', city: 'Sfax', cl: 233, ca: 2780, st: 'suspended' },
    { n: 'El Fellah Viandes', city: 'Ariana', cl: 0, ca: 0, st: 'pending' }
  ];
  const ST = { active: ['ok', 'Active', 'Suspendre'], suspended: ['off', 'Suspendue', 'Réactiver'], pending: ['wait', 'En attente', 'Valider'] };
  const BASE_SHOPS = 122;
  function renderAdmin() {
    $('#shopBody').innerHTML = SHOPS_ADM.map((s, i) => `<tr><td><span class="who"><span class="av" style="background:#FDECEC;color:#D0142F">${initials(s.n)}</span><b>${s.n}</b></span></td><td>${s.city}</td><td class="mono">${nf(s.cl)}</td><td class="mono">${nf(s.ca)} DT</td><td class="mono">${nf(s.ca * .07)} DT</td><td><span class="pill ${ST[s.st][0]}">${ST[s.st][1]}</span></td><td><button class="act-btn" data-shop="${i}">${ST[s.st][2]}</button></td></tr>`).join('');
    $('#admActive').textContent = BASE_SHOPS + SHOPS_ADM.filter(s => s.st === 'active').length;
    $('#admTotalShops').textContent = BASE_SHOPS + SHOPS_ADM.length;
  }
  $('#shopBody').addEventListener('click', e => {
    const b = e.target.closest('[data-shop]'); if (!b) return;
    const s = SHOPS_ADM[+b.dataset.shop];
    s.st = s.st === 'active' ? 'suspended' : 'active';
    renderAdmin();
    toast(`${s.n} : ${s.st === 'active' ? 'activée' : 'suspendue'} · action journalisée`, s.st === 'active' ? 'check' : 'alert');
    log(`${s.n} · statut → ${ST[s.st][1].toLowerCase()} (super-admin)`);
  });
  $('#inviteBtn').addEventListener('click', () => {
    SHOPS_ADM.push({ n: 'Nouvelle boucherie #' + (SHOPS_ADM.length + 1), city: 'Nabeul', cl: 0, ca: 0, st: 'pending' });
    renderAdmin(); toast('Invitation envoyée par e-mail · lien valable 7 jours', 'send');
    log('Invitation boucherie envoyée · Nabeul');
  });

  const TICKETS = [
    { id: '#SAV-2291', f: 'Sarra B. · cliente · Dar El Lham', t: 'Mes points du 12/10 n\'apparaissent pas sur ma carte.', pr: 'Normale', open: true },
    { id: '#INC-0417', f: 'Boucherie Ennour · boucher', t: 'Le QR de la balance ne s\'affiche plus depuis ce matin.', pr: 'Haute', open: true },
    { id: '#SAV-2288', f: 'Karim M. · client', t: 'Comment transférer ma carte sur un nouveau téléphone ?', pr: 'Basse', open: true },
    { id: '#INC-0415', f: 'Maison Sghaier · boucher', t: 'Demande d\'export CSV des précommandes de l\'Aïd.', pr: 'Normale', open: false }
  ];
  function renderTickets() {
    $('#ticketList').innerHTML = TICKETS.map((t, i) => `<div class="rv-item"><span class="av" style="background:${t.id.startsWith('#INC') ? '#FDF0DF' : '#ECEAFD'};color:${t.id.startsWith('#INC') ? '#B8650C' : '#5B4BDB'}">${t.id.startsWith('#INC') ? ic('alert') : ic('message')}</span>
      <div><div class="top"><b style="font-size:13px">${t.id} <small style="color:#9B8A85;font-weight:500">· ${t.f}</small></b><span class="tk-status pill ${t.open ? (t.pr === 'Haute' ? 'vip' : 'wait') : 'ok'}">${t.open ? 'Priorité ' + t.pr.toLowerCase() : 'Résolu'}</span></div>
      <p>${t.t}</p>${t.open ? `<div class="acts"><button class="dbtn" data-tk="${i}" style="padding:7px 11px;font-size:12px">${ic('check')} Répondre &amp; clôturer</button></div>` : ''}</div></div>`).join('');
    $('#admTickets').textContent = TICKETS.filter(t => t.open).length;
  }
  $('#ticketList').addEventListener('click', e => {
    const b = e.target.closest('[data-tk]'); if (!b) return;
    const t = TICKETS[+b.dataset.tk]; t.open = false; renderTickets();
    toast(`${t.id} résolu · réponse envoyée`, 'check'); log(`Ticket ${t.id} clôturé`);
  });

  const JOBS = [
    ['Analyse RFM + segmentation GMM', 'chaque nuit · 02:00', 'il y a 7 h'],
    ['Réentraînement churn XGBoost', 'dimanche · 03:00', 'il y a 4 j'],
    ['Collecte avis Google & Facebook', 'toutes les 6 h', 'il y a 2 h'],
    ['Snapshot heures creuses', 'toutes les heures', 'il y a 12 min'],
    ['Relances campagnes automatiques', 'toutes les 15 min', 'il y a 3 min']
  ];
  $('#jobs').innerHTML = JOBS.map((j, i) => `<div class="job"><span class="st" style="background:#E2F3F0;color:#2B8C7E">${ic('check')}</span><div><b>${j[0]}</b><small>${j[1]} · dernier run ${j[2]}</small></div><button class="run" data-job="${i}">${ic('play')} Lancer</button></div>`).join('');
  $('#jobs').addEventListener('click', async e => {
    const b = e.target.closest('[data-job]'); if (!b || b.classList.contains('spin')) return;
    b.classList.add('spin'); b.innerHTML = `${ic('refresh')} En cours`;
    await sleep(1500);
    b.classList.remove('spin'); b.innerHTML = `${ic('check')} OK`;
    b.parentElement.querySelector('small').textContent = `${JOBS[+b.dataset.job][1]} · dernier run à l'instant`;
    toast(`Job « ${JOBS[+b.dataset.job][0]} » terminé · 129 boucheries traitées`, 'check');
    log(`Job manuel : ${JOBS[+b.dataset.job][0]}`);
  });

  const LOGS = [
    'Dar El Lham · campagne « Arrivage agneau » envoyée (214)', 'Connexion super-admin · MFA validé',
    'Anti-fraude · compte bloqué (trust score 0,20)', 'Maison Sghaier · 3 précommandes confirmées',
    'Export RGPD · client #8812', 'Boucherie Ennour · QR vitrine régénéré', 'Le Comptoir du Boucher · 41 nouveaux clients aujourd\'hui',
    'Chatbot · ticket escaladé vers un humain (#SAV-2293)'
  ];
  let logI = 0;
  function log(msg) {
    const d = new Date(), el = document.createElement('div');
    el.className = 'log';
    el.innerHTML = `<span>${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}</span><b>${esc(msg)}</b>`;
    const a = $('#audit'); a.prepend(el);
    while (a.children.length > 7) a.lastChild.remove();
  }
  for (let i = 0; i < 4; i++) log(LOGS[logI++]);
  let adminVisible = false;
  new IntersectionObserver(es => es.forEach(e => { adminVisible = e.isIntersecting; }), { threshold: .1 }).observe($('#admin'));
  setInterval(() => { if (adminVisible) log(LOGS[logI++ % LOGS.length]); }, 4000);

  $('#admTabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#admTabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.adm-view').forEach(v => v.classList.toggle('on', v.dataset.t === b.dataset.t));
  });
  renderAdmin(); renderTickets();

  /* =========================================================
     ROI
     ========================================================= */
  function renderROI() {
    const c = +$('#roiC').value, p = +$('#roiP').value, u = +$('#roiU').value, k = +$('#roiK').value;
    $('#roiCV').textContent = nf(c); $('#roiPV').textContent = p + ' DT'; $('#roiUV').textContent = '+' + u + ' %'; $('#roiKV').textContent = k + ' %';
    const ca = c * p * u / 100, fee = ca * k / 100;
    $('#roiCA').textContent = nf(ca) + ' DT';
    $('#roiFee').textContent = nf(fee) + ' DT';
    $('#roiNet').textContent = nf((ca - fee) * 12) + ' DT';
  }
  ['roiC', 'roiP', 'roiU', 'roiK'].forEach(id => $('#' + id).addEventListener('input', renderROI));
  renderROI();

  /* ---------- responsive phone ---------- */
  const phoneFit = $('#phoneFit');
  function fitPhone() {
    const stage = phoneFit.parentElement, note = $('#phoneNote');
    const noteW = getComputedStyle(note).display === 'none' ? 0 : note.offsetWidth + 40;
    const s = Math.min(1, Math.max(.5, (stage.clientWidth - noteW) / 344));
    phoneFit.style.width = (344 * s) + 'px'; phoneFit.style.height = (708 * s) + 'px';
    phoneFit.firstElementChild.style.setProperty('--ps', s);
  }
  fitPhone();

  /* ---------- resize & init ---------- */
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { sizeCanvas(); fitPhone(); if ($('.view[data-view="dash"]').classList.contains('on')) areaChart(); }, 120); });

  paintIcons();
  onScroll();
})();
