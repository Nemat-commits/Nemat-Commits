/* Nemat Ullah — craft over noise. */
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ── Theme (light / dark, persisted) ─────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

const storedTheme = (() => { try { return localStorage.getItem('nu-theme'); } catch { return null; } })();
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  rootEl.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.content = theme === 'dark' ? '#131210' : '#faf7f1'; });
}
applyTheme(storedTheme || (systemDark.matches ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('nu-theme', next); } catch { /* private mode */ }
  });
}

/* ── Live PKT clock (Asia/Karachi) ───────────────────────────── */
const clockEls = document.querySelectorAll('.pkt-clock');
function tickClock() {
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Asia/Karachi', hour12: false,
  }).format(new Date());
  clockEls.forEach((el) => { el.textContent = time; });
}
if (clockEls.length) { tickClock(); setInterval(tickClock, 1000); }

/* ── Nav: scroll state + progress bar ────────────────────────── */
const nav = document.getElementById('siteNav');
const progressBar = document.getElementById('navProgressBar');

function updateNav() {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (nav) nav.classList.toggle('is-scrolled', y > 24);
  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Mobile menu ─────────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileMenu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });
}

/* ── Scroll reveals ──────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ── Animated counters ───────────────────────────────────────── */
const counters = document.querySelectorAll('[data-counter]');
function animateCounter(el) {
  const target = Number(el.dataset.counter || '0');
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo-ish
    el.textContent = String(Math.round(target * (t === 1 ? 1 : eased)));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
if ('IntersectionObserver' in window && counters.length && !prefersReducedMotion.matches) {
  const cio = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) { animateCounter(entry.target); cio.unobserve(entry.target); }
    }
  }, { threshold: 0.6 });
  counters.forEach((el) => cio.observe(el));
}

/* ── Work list: floating cursor preview (desktop only) ───────── */
const preview = document.getElementById('cursorPreview');
const previewImg = document.getElementById('cursorPreviewImg');
const workItems = document.querySelectorAll('.work-item[data-img]');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (preview && previewImg && workItems.length && finePointer && !prefersReducedMotion.matches) {
  let targetX = 0, targetY = 0, x = 0, y = 0, rafId = null, active = false;

  const lerp = (a, b, t) => a + (b - a) * t;
  function loop() {
    x = lerp(x, targetX, 0.16);
    y = lerp(y, targetY, 0.16);
    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
    if (active || Math.abs(targetX - x) > 0.5) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }
  const kick = () => { if (rafId === null) rafId = requestAnimationFrame(loop); };

  workItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      previewImg.src = item.dataset.img;
      previewImg.alt = item.querySelector('.work-title')?.textContent?.trim() || 'Project preview';
      active = true;
      preview.classList.add('visible');
      kick();
    });
    item.addEventListener('mouseleave', () => {
      active = false;
      preview.classList.remove('visible');
      kick();
    });
  });
  window.addEventListener('mousemove', (e) => { targetX = e.clientX; targetY = e.clientY; kick(); }, { passive: true });
  document.addEventListener('mouseleave', () => { active = false; preview.classList.remove('visible'); });
}

/* ── Seamless ticker (duplicate content once) ────────────────── */
const tickerTrack = document.getElementById('tickerTrack');
if (tickerTrack && !prefersReducedMotion.matches) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

/* ── Copy-to-clipboard email + toast ─────────────────────────── */
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

const copyBtn = document.getElementById('copyEmailBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email || '';
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = 'Copied';
      copyBtn.classList.add('copied');
      showToast('Email copied — talk soon.');
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2200);
  });
}

/* ── Contact form → pre-filled email draft ───────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const type = String(data.get('type') || 'A project');
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !message) {
      showToast('Please fill in name, email and message.');
      return;
    }
    const subject = encodeURIComponent(`Hello from ${name} — ${type}`);
    const body = encodeURIComponent(`Hi Nemat,\n\n${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:khannmat12@gmail.com?subject=${subject}&body=${body}`;
    showToast('Opening your email app…');
  });
}

/* ── Live GitHub repo count (graceful fallback to baked-in 22) ── */
const ghReposEl = document.getElementById('ghReposLive');
if (ghReposEl) {
  fetch('https://api.github.com/users/Nemat-commits', { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => { if (data && Number.isFinite(data.public_repos)) ghReposEl.textContent = String(data.public_repos); })
    .catch(() => { /* keep the static value */ });
}

/* ── Footer year ─────────────────────────────────────────────── */
const footYear = document.getElementById('footYear');
if (footYear) footYear.textContent = String(new Date().getFullYear());
