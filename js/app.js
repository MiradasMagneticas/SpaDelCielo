/* ═══════════════════════════════════════════════
   Del Cielo Spa & Estética — app.js v6
   Native scroll · Booking modal · GSAP entrance
═══════════════════════════════════════════════ */

const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const hasGSAP  = (typeof gsap !== 'undefined');
const D        = reduced ? 0 : 1;

// ════════════════════════════════════════════════
// HEADER scroll + flow blob drift  (no GSAP needed)
// ════════════════════════════════════════════════
const header = document.getElementById('site-header');

function applyScroll(y) {
  if (header) header.classList.toggle('scrolled', y > 60);
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
if (hamburger && drawer) {
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
}

// ── Anchor smooth scroll ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});

// ════════════════════════════════════════════════
// BOOKING MODAL  (independent of GSAP)
// ════════════════════════════════════════════════
const DAYS_ES   = ['dom','lun','mar','mié','jue','vie','sáb'];
const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MORNING   = ['7:45 AM','8:30 AM','9:15 AM','10:00 AM','10:45 AM','11:30 AM'];
const AFTERNOON = ['12:15 PM','1:00 PM','1:45 PM','2:30 PM','3:15 PM','4:00 PM','4:45 PM','5:30 PM'];

let bkService  = '';
let bkPrice    = '';
let bkDuration = '';
let bkDate     = null;
let bkTime     = '';

function openBooking(svc, price, dur) {
  const overlay = document.getElementById('bk-overlay');
  const modal   = document.getElementById('bk-modal');
  if (!overlay || !modal) return;

  overlay.classList.add('open');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const scroll = modal.querySelector('.bk-scroll');
  if (scroll) scroll.scrollTop = 0;

  if (svc) {
    setService(svc, price || '', dur || '');
  } else {
    bkService = ''; bkPrice = ''; bkDuration = '';
    document.getElementById('bk-svc-name').textContent  = 'Selecciona un servicio';
    document.getElementById('bk-svc-price').textContent = '';
    document.getElementById('bk-svc-picker').style.display    = 'block';
    document.getElementById('bk-change-svc-btn').style.display = 'none';
    const sel = document.getElementById('bk-svc-select');
    if (sel) sel.value = '';
  }

  buildDateStrip();
  showTimeSlots('morning', document.querySelector('.bk-time-tab'));
}

function closeBooking() {
  const overlay = document.getElementById('bk-overlay');
  const modal   = document.getElementById('bk-modal');
  if (overlay) overlay.classList.remove('open');
  if (modal)   modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBooking();
});

function setService(name, price, dur) {
  bkService  = name;
  bkPrice    = price;
  bkDuration = dur;
  document.getElementById('bk-svc-name').textContent  = name;
  document.getElementById('bk-svc-price').textContent = [price, dur].filter(Boolean).join('  ·  ');
  document.getElementById('bk-svc-picker').style.display    = 'none';
  document.getElementById('bk-change-svc-btn').style.display = 'block';
}

function selectService(val) {
  if (!val) return;
  const [name, price, dur] = val.split('|');
  setService(name, price, dur);
}

function toggleServicePicker() {
  const picker = document.getElementById('bk-svc-picker');
  if (!picker) return;
  picker.style.display = (picker.style.display === 'none' || !picker.style.display) ? 'block' : 'none';
}

function buildDateStrip() {
  const strip = document.getElementById('bk-date-strip');
  if (!strip) return;
  strip.innerHTML = '';
  bkDate = null;
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bk-day' + (i === 0 ? ' today' : '');
    btn.innerHTML =
      `<span class="bk-day-dow">${i === 0 ? 'Hoy' : DAYS_ES[d.getDay()]}</span>` +
      `<span class="bk-day-num">${d.getDate()}</span>`;
    btn.addEventListener('click', () => {
      strip.querySelectorAll('.bk-day').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bkDate = d;
    });
    if (i === 0) { btn.classList.add('selected'); bkDate = d; }
    strip.appendChild(btn);
  }
}

function showTimeSlots(period, tabEl) {
  document.querySelectorAll('.bk-time-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');

  const slots     = period === 'morning' ? MORNING : AFTERNOON;
  const container = document.getElementById('bk-slots');
  if (!container) return;
  container.innerHTML = '';
  bkTime = '';
  slots.forEach(time => {
    const btn = document.createElement('button');
    btn.type = 'button';
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
  const nameEl = document.getElementById('bk-name');
  const name   = nameEl ? nameEl.value.trim() : '';
  const staff  = (document.querySelector('input[name="staff"]:checked') || {}).value || 'Primero disponible';

  if (!bkService) {
    document.getElementById('bk-svc-picker').style.display = 'block';
    alert('Por favor selecciona un servicio para continuar.');
    return;
  }
  if (!name) {
    if (nameEl) nameEl.focus();
    alert('Por favor escribe tu nombre.');
    return;
  }

  let dateStr = 'a confirmar';
  if (bkDate) {
    dateStr = `${DAYS_ES[bkDate.getDay()]} ${bkDate.getDate()} ${MONTHS_ES[bkDate.getMonth()]}`;
  }

  let msg = `¡Hola Del Cielo Spa! 🌙 Soy *${name}* y quiero reservar una cita.\n\n`;
  msg += `💆 *Servicio:* ${bkService}${bkPrice ? ' — ' + bkPrice : ''}${bkDuration ? ' (' + bkDuration + ')' : ''}\n`;
  msg += `👤 *Profesional:* ${staff}\n`;
  msg += `📅 *Fecha:* ${dateStr}\n`;
  if (bkTime) msg += `🕐 *Hora:* ${bkTime}\n`;
  msg += `\nQuedo atenta/o a la confirmación de disponibilidad. ¡Gracias! 💛`;

  window.open('https://wa.me/573229265662?text=' + encodeURIComponent(msg), '_blank');
  closeBooking();
}

// Expose for inline onclick
window.openBooking = openBooking;
window.closeBooking = closeBooking;
window.selectService = selectService;
window.toggleServicePicker = toggleServicePicker;
window.showTimeSlots = showTimeSlots;
window.submitBooking = submitBooking;

// ════════════════════════════════════════════════
// GSAP ANIMATIONS  (gracefully skipped if unavailable)
// ════════════════════════════════════════════════
if (hasGSAP) {
  gsap.registerPlugin(ScrollTrigger);
  window.addEventListener('load', () => ScrollTrigger.refresh());

  gsap.set(['.hero-mark', '.hero-name', '.hero-type', '.hero-ornament',
            '.hero-tagline', '.hero-actions', '.hero-stats', '.hero-scroll'],
           { autoAlpha: 0, y: 30 });

  function startCounters() {
    document.querySelectorAll('.hstat-num').forEach(el => {
      const raw    = el.textContent.trim();
      const num    = parseFloat(raw);
      const suffix = raw.replace(/[\d.]/g, '');
      if (isNaN(num)) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: num, duration: D * 1.8, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
      });
    });
  }

  function startHero() {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.hero-mark',     { autoAlpha: 1, y: 0, duration: D * 0.9 })
      .to('.hero-name',     { autoAlpha: 1, y: 0, duration: D * 1.2 }, `-=${D * 0.55}`)
      .to('.hero-type',     { autoAlpha: 1, y: 0, duration: D * 0.7 }, `-=${D * 0.7}`)
      .to('.hero-ornament', { autoAlpha: 1, y: 0, duration: D * 0.6 }, `-=${D * 0.45}`)
      .to('.hero-tagline',  { autoAlpha: 1, y: 0, duration: D * 0.8 }, `-=${D * 0.4}`)
      .to('.hero-actions',  { autoAlpha: 1, y: 0, duration: D * 0.7 }, `-=${D * 0.5}`)
      .to('.hero-stats',    { autoAlpha: 1, y: 0, duration: D * 0.6 }, `-=${D * 0.4}`)
      .to('.hero-scroll',   { autoAlpha: 1, y: 0, duration: D * 0.6 }, `-=${D * 0.3}`)
      .call(startCounters);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHero);
  } else {
    startHero();
  }

  // Background parallax (desktop only — keeps mobile fluid)
  if (!reduced && !isMobile) {
    gsap.set('.hero-bg img', { scale: 1.18 });
    gsap.to('.hero-bg img', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Section header reveals
  function headerIn(sectionEl) {
    const kids = [...sectionEl.querySelectorAll('.section-label, .section-title, .section-sub')];
    if (!kids.length) return;
    gsap.from(kids, {
      autoAlpha: 0, y: 32, duration: D * 0.9, ease: 'power3.out', stagger: 0.13,
      scrollTrigger: { trigger: sectionEl.querySelector('.section-header') || sectionEl, start: 'top 84%', once: true }
    });
  }
  document.querySelectorAll('.servicios-section, .galeria-section, .nosotros-section, .ubicacion-section').forEach(headerIn);

  gsap.utils.toArray('.cat-card').forEach((el, i) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 },
      { clipPath: 'inset(0 0 0% 0)', autoAlpha: 1, duration: D * 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }, delay: i * 0.1 });
  });

  gsap.utils.toArray('.gm-item').forEach((el, i) => {
    gsap.from(el, { scale: 0.84, autoAlpha: 0, duration: D * 0.88, ease: 'power3.out',
      delay: i * 0.05, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  if (!isMobile) {
    gsap.from('.ubicacion-map', { filter: 'blur(10px)', autoAlpha: 0, y: 40, duration: D * 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ubicacion-map', start: 'top 80%', once: true } });
  }

  gsap.from('.mini-card', { autoAlpha: 0, y: 44, duration: D * 0.82, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '.svc-row--4', start: 'top 86%', once: true } });
  gsap.from('.depil-banner', { autoAlpha: 0, y: 40, duration: D * 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.depil-banner', start: 'top 86%', once: true } });
  gsap.from('.dp', { autoAlpha: 0, scale: 0.88, duration: D * 0.65, ease: 'back.out(1.5)', stagger: 0.06,
    scrollTrigger: { trigger: '.depil-prices', start: 'top 88%', once: true } });
  gsap.from('.plan-chip', { autoAlpha: 0, y: 28, duration: D * 0.7, ease: 'power3.out', stagger: 0.07,
    scrollTrigger: { trigger: '.planes-strip', start: 'top 88%', once: true } });
  gsap.from('.ubicacion-card', { autoAlpha: 0, y: 32, duration: D * 0.75, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '.ubicacion-cards', start: 'top 85%', once: true } });
  gsap.from('.footer-brand, .footer-col', { autoAlpha: 0, y: 28, duration: D * 0.7, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.footer-inner', start: 'top 92%', once: true } });

  gsap.from('.nosotros-img', { autoAlpha: 0, rotation: -3, scale: 0.94, duration: D * 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.nosotros-img', start: 'top 82%', once: true } });
  gsap.from(['.nosotros-text .section-label', '.nosotros-text .section-title',
             '.nosotros-text > p', '.value', '.nosotros-text .btn-primary'], {
    autoAlpha: 0, y: 34, duration: D * 0.85, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.nosotros-text', start: 'top 82%', once: true } });

  // Sticky CTA
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    gsap.set(stickyCta, { y: 80, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: '.hero', start: 'bottom 55%',
      onEnter:     () => gsap.to(stickyCta, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(stickyCta, { y: 80, autoAlpha: 0, duration: 0.3 })
    });
    ScrollTrigger.create({
      trigger: '.site-footer', start: 'top 80%',
      onEnter:     () => gsap.to(stickyCta, { y: 80, autoAlpha: 0, duration: 0.3 }),
      onLeaveBack: () => gsap.to(stickyCta, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
    });
  }

  // Magnetic buttons (desktop)
  if (!isMobile) {
    document.querySelectorAll('.btn-primary, .btn-book, .btn-wa').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.2;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.2;
        gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // Safety: if RAF is throttled (sandboxed preview), reveal hero anyway
  setTimeout(() => {
    if (gsap.ticker.time === 0) {
      ['.hero-mark', '.hero-name', '.hero-type', '.hero-ornament',
       '.hero-tagline', '.hero-actions', '.hero-stats', '.hero-scroll'].forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.removeProperty('visibility');
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });
    }
  }, 2500);
}
