/* ═══════════════════════════════════════════════
   Del Cielo Spa & Estética — app.js v5
   GSAP ScrollTrigger · Booking Modal · Native scroll
═══════════════════════════════════════════════ */

const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const D        = reduced ? 0 : 1;

// ── GSAP setup ───────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Refresh trigger positions after images load
window.addEventListener('load', () => ScrollTrigger.refresh());

// ── Pre-hide hero elements ────────────────────
gsap.set([
  '.hero-mark', '.hero-name', '.hero-type', '.hero-ornament',
  '.hero-tagline', '.hero-actions', '.hero-stats', '.hero-photo-frame', '.plant'
], { autoAlpha: 0, y: 28 });
gsap.set('.hero-photo-frame', { scale: 0.96 });

// ── Header scroll class ──────────────────────
const header = document.getElementById('site-header');

function applyScroll(y) {
  header.classList.toggle('scrolled', y > 60);
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const p = y / maxScroll;
  const blobA = document.querySelector('.flow-blob--a');
  const blobB = document.querySelector('.flow-blob--b');
  if (blobA) blobA.style.transform = `translate(${p * 52}vw, ${p * 55}vh)`;
  if (blobB) blobB.style.transform = `translate(${p * -52}vw, ${p * -55}vh)`;
}

window.addEventListener('scroll', () => applyScroll(window.scrollY), { passive: true });
applyScroll(window.scrollY);

// ── Mobile menu ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('mobile-drawer');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
});
drawer.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
  })
);

// ── Anchor scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// ════════════════════════════════════════════════
// HERO entrance (runs immediately — no loader)
// ════════════════════════════════════════════════
function startHero() {
  gsap.to('.plant', {
    autoAlpha: 1, y: 0, duration: D * 1.6, ease: 'power3.out', stagger: 0.12
  });

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero-mark',     { autoAlpha: 1, y: 0, duration: D * 0.8 })
    .to('.hero-name',     { autoAlpha: 1, y: 0, duration: D * 1.1 }, `-=${D * 0.5}`)
    .to('.hero-type',     { autoAlpha: 1, y: 0, duration: D * 0.7 }, `-=${D * 0.55}`)
    .to('.hero-ornament', { autoAlpha: 1, y: 0, duration: D * 0.6 }, `-=${D * 0.45}`)
    .to('.hero-tagline',  { autoAlpha: 1, y: 0, duration: D * 0.8 }, `-=${D * 0.4}`)
    .to('.hero-actions',  { autoAlpha: 1, y: 0, duration: D * 0.7 }, `-=${D * 0.5}`)
    .to('.hero-stats',    { autoAlpha: 1, y: 0, duration: D * 0.6 }, `-=${D * 0.4}`)
    .to('.hero-photo-frame', { autoAlpha: 1, y: 0, scale: 1, duration: D * 1.3, ease: 'power2.out' }, 0.25)
    .call(startCounters);
}

// ── Counter animation ────────────────────────
function startCounters() {
  document.querySelectorAll('.hstat-num').forEach(el => {
    const raw    = el.textContent.trim();
    const num    = parseFloat(raw);
    const suffix = raw.replace(/[\d.]/g, '');
    if (isNaN(num)) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: num, duration: D * 2, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
    });
  });
}

// Start hero immediately (no loader)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startHero);
} else {
  startHero();
}

// ════════════════════════════════════════════════
// PLANT PARALLAX (desktop only)
// ════════════════════════════════════════════════
if (!reduced && !isMobile) {
  gsap.to('.plant--tl', { y: -90, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
  gsap.to('.plant--tr', { y: -70, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 } });
  gsap.to('.plant--bl', { y: -50, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
}

// ════════════════════════════════════════════════
// SCROLL ANIMATIONS — 6 types
// ════════════════════════════════════════════════

function headerIn(sectionEl) {
  const kids = [...sectionEl.querySelectorAll('.section-label, .section-title, .section-sub')];
  if (!kids.length) return;
  gsap.from(kids, {
    autoAlpha: 0, y: 32, duration: D * 0.9, ease: 'power3.out', stagger: 0.13,
    scrollTrigger: { trigger: sectionEl.querySelector('.section-header') || sectionEl, start: 'top 84%', once: true }
  });
}

document.querySelectorAll('.servicios-section, .galeria-section, .nosotros-section, .ubicacion-section').forEach(headerIn);

// TYPE 2 — CLIP-REVEAL
gsap.utils.toArray('.cat-card').forEach((el, i) => {
  gsap.fromTo(el,
    { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 },
    {
      clipPath: 'inset(0 0 0% 0)', autoAlpha: 1,
      duration: D * 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      delay: i * 0.11
    }
  );
});

// TYPE 3 — SCALE-UP (gallery)
gsap.utils.toArray('.gm-item').forEach((el, i) => {
  gsap.from(el, {
    scale: 0.84, autoAlpha: 0, duration: D * 0.88, ease: 'power3.out',
    delay: i * 0.055,
    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
  });
});

// TYPE 4 — BLUR-UP (ubicacion map, desktop only)
if (!isMobile) {
  gsap.from('.ubicacion-map', {
    filter: 'blur(10px)', autoAlpha: 0, y: 40, duration: D * 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.ubicacion-map', start: 'top 80%', once: true }
  });
}

// TYPE 5 — STAGGER-UP
gsap.from('.mini-card', {
  autoAlpha: 0, y: 44, duration: D * 0.82, ease: 'power3.out', stagger: 0.08,
  scrollTrigger: { trigger: '.svc-row--4', start: 'top 86%', once: true }
});
gsap.from('.depil-banner', {
  autoAlpha: 0, y: 40, duration: D * 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.depil-banner', start: 'top 86%', once: true }
});
gsap.from('.dp', {
  autoAlpha: 0, scale: 0.88, duration: D * 0.65, ease: 'back.out(1.5)', stagger: 0.06,
  scrollTrigger: { trigger: '.depil-prices', start: 'top 88%', once: true }
});
gsap.from('.plan-chip', {
  autoAlpha: 0, y: 28, duration: D * 0.7, ease: 'power3.out', stagger: 0.07,
  scrollTrigger: { trigger: '.planes-strip', start: 'top 88%', once: true }
});
gsap.from('.ubicacion-card', {
  autoAlpha: 0, y: 32, duration: D * 0.75, ease: 'power3.out', stagger: 0.08,
  scrollTrigger: { trigger: '.ubicacion-cards', start: 'top 85%', once: true }
});
gsap.from('.footer-brand, .footer-col', {
  autoAlpha: 0, y: 28, duration: D * 0.7, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '.footer-inner', start: 'top 92%', once: true }
});

// TYPE 6 — ROTATE-IN (nosotros)
gsap.from('.nosotros-img', {
  autoAlpha: 0, rotation: -3, scale: 0.94, duration: D * 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.nosotros-img', start: 'top 82%', once: true }
});
gsap.from(['.nosotros-text .section-label', '.nosotros-text .section-title',
           '.nosotros-text > p', '.value', '.nosotros-text .btn-primary'], {
  autoAlpha: 0, y: 34, duration: D * 0.85, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '.nosotros-text', start: 'top 82%', once: true }
});

// ════════════════════════════════════════════════
// STICKY CTA
// ════════════════════════════════════════════════
const stickyCta = document.getElementById('sticky-cta');
if (stickyCta) {
  gsap.set(stickyCta, { y: 80, autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 55%',
    onEnter:     () => gsap.to(stickyCta, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }),
    onLeaveBack: () => gsap.to(stickyCta, { y: 80, autoAlpha: 0, duration: 0.3 })
  });
  ScrollTrigger.create({
    trigger: '.site-footer',
    start: 'top 80%',
    onEnter:     () => gsap.to(stickyCta, { y: 80, autoAlpha: 0, duration: 0.3 }),
    onLeaveBack: () => gsap.to(stickyCta, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
  });
}

// ════════════════════════════════════════════════
// BUTTON MICRO-INTERACTIONS
// ════════════════════════════════════════════════
document.querySelectorAll('.btn-primary, .btn-book').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

// ════════════════════════════════════════════════
// BOOKING MODAL
// ════════════════════════════════════════════════
const DAYS_ES  = ['dom','lun','mar','mié','jue','vie','sáb'];
const MORNING  = ['7:45 AM','8:30 AM','9:15 AM','10:00 AM','10:45 AM','11:30 AM'];
const AFTERNOON= ['12:15 PM','1:00 PM','1:45 PM','2:30 PM','3:15 PM','4:00 PM','4:45 PM','5:30 PM'];

let bkService  = '';
let bkPrice    = '';
let bkDuration = '';
let bkDate     = null;
let bkTime     = '';

function openBooking(svc, price, dur) {
  const overlay = document.getElementById('bk-overlay');
  const modal   = document.getElementById('bk-modal');
  overlay.classList.add('open');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (svc) {
    setService(svc, price || '', dur || '');
  } else {
    // No service pre-selected — show picker
    document.getElementById('bk-svc-picker').style.display = 'block';
    document.getElementById('bk-change-svc-btn').style.display = 'none';
  }

  buildDateStrip();
  showTimeSlots('morning', document.querySelector('.bk-time-tab'));
}

function closeBooking() {
  document.getElementById('bk-overlay').classList.remove('open');
  document.getElementById('bk-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBooking();
});

function setService(name, price, dur) {
  bkService  = name;
  bkPrice    = price;
  bkDuration = dur;
  document.getElementById('bk-svc-name').textContent = name;
  document.getElementById('bk-svc-price').textContent = price + (dur ? '  ·  ' + dur : '');
  document.getElementById('bk-svc-dur').textContent = '';
  document.getElementById('bk-svc-picker').style.display  = 'none';
  document.getElementById('bk-change-svc-btn').style.display = 'block';
}

function selectService(val) {
  if (!val) return;
  const [name, price, dur] = val.split('|');
  setService(name, price, dur);
}

function toggleServicePicker() {
  const picker = document.getElementById('bk-svc-picker');
  picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
}

function buildDateStrip() {
  const strip = document.getElementById('bk-date-strip');
  strip.innerHTML = '';
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d   = new Date(today);
    d.setDate(today.getDate() + i);
    const btn = document.createElement('button');
    btn.className = 'bk-day' + (i === 0 ? ' today' : '');
    btn.innerHTML = `<span class="bk-day-dow">${DAYS_ES[d.getDay()]}</span><span class="bk-day-num">${d.getDate()}</span>`;
    btn.dataset.date = d.toISOString().split('T')[0];
    btn.addEventListener('click', () => {
      strip.querySelectorAll('.bk-day').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bkDate = d;
    });
    if (i === 0) {
      // Auto-select today
      btn.classList.add('selected');
      bkDate = d;
    }
    strip.appendChild(btn);
  }
}

function showTimeSlots(period, tabEl) {
  document.querySelectorAll('.bk-time-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');

  const slots  = period === 'morning' ? MORNING : AFTERNOON;
  const container = document.getElementById('bk-slots');
  container.innerHTML = '';
  slots.forEach(time => {
    const btn = document.createElement('button');
    btn.className = 'bk-slot';
    btn.textContent = time;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.bk-slot').forEach(s => s.classList.remove('selected'));
      btn.classList.add('selected');
      bkTime = time;
    });
    container.appendChild(btn);
  });
}

function submitBooking() {
  const name  = document.getElementById('bk-name').value.trim();
  const staff = document.querySelector('input[name="staff"]:checked')?.value || 'Primero disponible';

  if (!bkService) { alert('Por favor selecciona un servicio.'); return; }
  if (!name)       { document.getElementById('bk-name').focus(); return; }

  const dateStr = bkDate
    ? bkDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'a confirmar';

  let msg = `Hola Del Cielo Spa! Soy *${name}* y quiero reservar una cita.\n\n`;
  msg += `*Servicio:* ${bkService}${bkPrice ? ' — ' + bkPrice : ''}${bkDuration ? ' (' + bkDuration + ')' : ''}\n`;
  msg += `*Profesional:* ${staff}\n`;
  msg += `*Fecha:* ${dateStr}\n`;
  msg += bkTime ? `*Hora:* ${bkTime}\n` : '';
  msg += `\nQuedo pendiente de confirmación. Gracias!`;

  window.open('https://wa.me/573229265662?text=' + encodeURIComponent(msg), '_blank');
  closeBooking();
}
