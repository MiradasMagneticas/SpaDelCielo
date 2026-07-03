/* ═══════════════════════════════════════════════════════════════
   DEL CIELO SPA & ESTÉTICA — app.js
   Stack: Lenis + GSAP + ScrollTrigger (vanilla JS, no frameworks)
═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── Config ─────────────────────────────────────────────────── */
const WA_NUMBER = "573143395286";

const HORARIOS = {
  // dayOfWeek: 0=Sun, 1=Mon…6=Sat
  // EDITAR: ajustar a los horarios reales del spa
  weekdays: { days: [1,2,3,4,5], label: "Lunes a Viernes", open: 9, close: 20 },
  saturday: { days: [6],          label: "Sábado",          open: 9, close: 18 },
  sunday:   null, // null = cerrado. Cambiar a objeto si abre domingos.
};

/* ── Catalog Data (from catalogo-delcielo.json) ──────────────── */
const CATALOG = {
  "Masajes": [
    { n: "Relajante cuerpo completo", p: 140000 },
    { n: "Relajante localizado",      p: 80000  },
    { n: "Deportivo",                 p: 170000 },
    { n: "Descontracturante",         p: 160000 },
    { n: "Prenatal",                  p: 150000 },
    { n: "Reductor (por sesión)",     p: 150000 },
    { n: "Facial",                    p: 60000  },
    { n: "4 manos",                   p: 300000 },
  ],
  "Facial & Pestañas": [
    { n: "Limpieza facial profunda",            p: 170000 },
    { n: "Limpieza facial sencilla",            p: 130000 },
    { n: "Hidratación facial",                  p: 130000 },
    { n: "Yoga facial (sesión)",                p: 140000 },
    { n: "Radiofrecuencia facial (1 sesión)",   p: 100000 },
    { n: "Lifting de pestañas",                 p: 150000 },
    { n: "Volumen 3D / 5D y superlight",        p: 190000, desde: true },
    { n: "Punto a punto (coreano)",             p: 70000  },
    { n: "Pigmentación de cejas en henna",      p: 25000  },
    { n: "Depilación cejas + henna",            p: 45000  },
    { n: "Paquete 5 sesiones RF (cada 21 días)",p: 450000 },
  ],
  "Manicura & Pedicura": [
    { n: "Pedicura",               p: 65000  },
    { n: "Pedispa",                p: 80000  },
    { n: "Semipermanente",         p: 55000  },
    { n: "Manicura sencilla",      p: 32000  },
    { n: "Spa de manos",           p: 70000  },
    { n: "Jelly spa",              p: 40000  },
    { n: "Dipping",                p: 80000  },
    { n: "Base Rubber",            p: 45000  },
    { n: "Polygel",                p: 160000 },
    { n: "Uñas acrílicas",         p: 180000 },
    { n: "Press on",               p: 180000 },
    { n: "Mantenimiento press on", p: 120000 },
    { n: "Reflexología podal",     p: 80000  },
    { n: "Reflexología palmar",    p: 60000  },
    { n: "Cambio de esmalte",      p: 25000  },
    { n: "Parafina",               p: 30000  },
  ],
  "Depilación": [
    { n: "Cejas (cera)",              p: 22000  },
    { n: "Axilas (cera)",             p: 22000  },
    { n: "Bigote (cera)",             p: 20000  },
    { n: "Bikini (cera)",             p: 60000  },
    { n: "Media pierna (cera)",       p: 40000  },
    { n: "Pierna completa (cera)",    p: 65000  },
    { n: "Cara completa (cera)",      p: 80000  },
    { n: "Hilo cejas",                p: 25000  },
    { n: "Hilo cara completa",        p: 85000  },
    { n: "Láser — por sesión",        p: 100000 },
    { n: "Láser — 8 sesiones 1 zona", p: 100000, nota: "Confirmar precio" },
    { n: "Láser — 16 ses. 2 zonas",   p: 1200000},
    { n: "Láser — 24 ses. 3 zonas",   p: 1680000},
  ],
  "Cabello": [
    { n: "Corte dama",                       p: 35000, desde: false },
    { n: "Corte caballero",                  p: 35000  },
    { n: "Blower",                           p: 40000, desde: true },
    { n: "Blower con ondas",                 p: 55000, desde: true },
    { n: "Balayage",                         p: 390000,desde: true },
    { n: "Baby light",                       p: 280000,desde: true },
    { n: "Base color",                       p: 180000 },
    { n: "Base color INOA",                  p: 190000 },
    { n: "Keratina vegana",                  p: 350000,desde: true },
    { n: "Keratina clásica",                 p: 350000,desde: true },
    { n: "Mascarilla capilar Kérastase",     p: 95000  },
    { n: "Olaplex reparador",                p: 310000 },
    { n: "Fusio Dose",                       p: 130000 },
    { n: "Diagnóstico capilar",              p: 50000  },
  ],
  "Barbería": [
    { n: "Corte caballero",         p: 35000 },
    { n: "Retoque base",            p: 25000 },
    { n: "Perfilación de corte",    p: 25000 },
    { n: "Perfilación de barba",    p: 25000 },
    { n: "Ritual de barba",         p: 50000 },
    { n: "Skin Sir Fausto",         p: 80000 },
  ],
  "Corporal": [
    { n: "Drenaje linfático",                      p: 150000 },
    { n: "Body sculpt (sesión)",                   p: 150000 },
    { n: "Body sculpt (10 sesiones)",              p: 1300000},
    { n: "Tratamiento anticelulítico (10 ses.)",   p: 900000 },
    { n: "Masajes moldeadores (10 ses.)",          p: 1400000},
    { n: "Presoterapia traje completo (1 ses.)",   p: 80000  },
    { n: "Presoterapia paquete 6 ses.",            p: 420000 },
    { n: "Piso pélvico (sesión)",                  p: 80000  },
    { n: "Piso pélvico paquete 6 ses.",            p: 420000 },
  ],
  "Zonas Húmedas": [
    { n: "Sauna",   p: 70000,  desde: true },
    { n: "Turco",   p: 70000,  desde: true },
    { n: "Jacuzzi", p: 150000, desde: true },
  ],
};

const PACKAGES = [
  "Paquete Entre Estrellas",
  "Paquete Entre Nubes de Algodón",
  "Paquete Constelaciones",
  "Paquete del Cielo",
  "Paquete del Universo",
  "Paquete Húmedo Turco + Sauna + Jacuzzi",
  "Paquete Sauna 6 sesiones",
  "Bono Tratamiento Capilar del Cielo",
  "Bono Del Mundial — Mamá e Hija",
  "Bono Copa del Cielo (Hombre)",
  "Bono Mes de Padres",
];

/* ── Format COP ─────────────────────────────────────────────── */
function formatCOP(n) {
  return "$" + n.toLocaleString("es-CO");
}

/* ── WhatsApp Deep Links ─────────────────────────────────────── */
const WA_MESSAGES = {
  general: "Hola! Me gustaría agendar una experiencia en Del Cielo Spa. ¿Qué disponibilidad tienen?",
  paqueteNubes: "Hola! Me interesa agendar el paquete Entre Nubes de Algodón. ¿Qué disponibilidad tienen?",
  bonoCopaCielo: "Hola! Quiero consultar la disponibilidad para el Bono Copa del Cielo de hombre.",
};

function waMessageFor(keyOrService) {
  if (WA_MESSAGES[keyOrService]) return WA_MESSAGES[keyOrService];
  return `Hola! Me interesa agendar ${keyOrService}. ¿Qué disponibilidad tienen?`;
}

function buildWaUrl(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function initWhatsAppLinks() {
  document.querySelectorAll(".wa-link[data-wa-key], .wa-link[data-wa-service]").forEach(el => {
    const key = el.dataset.waKey;
    const service = el.dataset.waService;
    const msg = key ? waMessageFor(key) : waMessageFor(service);
    el.href = buildWaUrl(msg);
    if (!el.target) {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });
}

const CATEGORY_DURATION = {
  "Masajes": "60–90 min",
  "Facial & Pestañas": "45–90 min",
  "Manicura & Pedicura": "45–120 min",
  "Depilación": "15–45 min",
  "Cabello": "45–180 min",
  "Barbería": "30–60 min",
  "Corporal": "60–90 min",
  "Zonas Húmedas": "60 min",
};

/* ── Loader ─────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById("loader");
  const bar    = document.getElementById("loader-bar");
  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress > 90) progress = 90;
    bar.style.width = progress + "%";
  }, 80);

  function hideLoader() {
    clearInterval(interval);
    bar.style.width = "100%";
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.classList.remove("is-loading");
      // Start hero animation after loader
    }, 400);
  }

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 800);
  } else {
    window.addEventListener("load", () => setTimeout(hideLoader, 300));
    setTimeout(hideLoader, 3200); // safety timeout
  }
}

/* ── Lenis Smooth Scroll ────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", () => {
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
  });

  if (typeof gsap !== "undefined") {
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
        // Close mobile menu
        closeMobileMenu();
      }
    });
  });

  return lenis;
}

/* ── Header ─────────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  const threshold = 80;

  function update() {
    if (window.scrollY > threshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ── Mobile Menu ────────────────────────────────────────────── */
function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const btn  = document.getElementById("hamburger");
  if (!menu || menu.hidden) return;

  menu.classList.add("is-closing");
  setTimeout(() => {
    menu.hidden = true;
    menu.classList.remove("is-closing");
    if (btn) btn.classList.remove("open"), btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }, 320);
}

function initMobileMenu() {
  const btn   = document.getElementById("hamburger");
  const close = document.getElementById("mobile-close");
  const menu  = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = !menu.hidden;
    if (isOpen) {
      closeMobileMenu();
    } else {
      menu.classList.remove("is-closing");
      menu.hidden = false;
      btn.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      setTimeout(() => { if (close) close.focus(); }, 50);
    }
  });

  if (close) close.addEventListener("click", closeMobileMenu);

  menu.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => closeMobileMenu());
  });

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !menu.hidden) closeMobileMenu();
  });

  // Close when tapping outside menu content (the overlay backdrop)
  menu.addEventListener("click", e => {
    if (e.target === menu) closeMobileMenu();
  });

  // Add stagger animation to mobile links when menu opens
  const menuLinks = menu.querySelectorAll(".mobile-link");
  const originalHidden = menu.hidden;
  const observer = new MutationObserver(() => {
    if (!menu.hidden && typeof gsap !== "undefined") {
      gsap.fromTo(menuLinks,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: "power3.out", delay: 0.15 }
      );
    }
  });
  observer.observe(menu, { attributes: true, attributeFilter: ["hidden"] });
}

/* ── Hero Parallax ──────────────────────────────────────────── */
function initHeroParallax() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const heroMedia = document.querySelector(".hero-video, .hero-img");
  const heroCnt = document.querySelector(".hero-content");
  if (!heroMedia) return;

  gsap.to(heroMedia, {
    yPercent: 20,
    scale: 1.06,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(heroCnt, {
    opacity: 0,
    yPercent: -8,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "40% top",
      scrub: true,
    },
  });

  // Birds parallax
  document.querySelectorAll(".bird").forEach((bird, i) => {
    gsap.to(bird, {
      x: (i % 2 === 0 ? 40 : -30) * (i + 1),
      y: -20 * (i + 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.5 + i * 0.3,
      },
    });
  });
}

/* ── Section Reveals ────────────────────────────────────────── */
function initReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Reduced motion check
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
      el.style.clipPath = "none";
    });
    return;
  }

  const defaults = { duration: 0.9, ease: "power3.out" };
  const staggerVal = 0.12;

  document.querySelectorAll("[data-reveal]").forEach(el => {
    const type = el.dataset.reveal;

    let fromVars = {};
    let toVars   = { opacity: 1, ease: defaults.ease, duration: defaults.duration };

    switch (type) {
      case "fade-up":
        fromVars = { opacity: 0, y: 30 };
        toVars   = { ...toVars, y: 0 };
        break;
      case "scale-up":
        fromVars = { opacity: 0, scale: 0.95, y: 20 };
        toVars   = { ...toVars, scale: 1, y: 0, ease: "power2.out" };
        break;
      case "blur-up":
        fromVars = { opacity: 0, y: 25, filter: "blur(6px)" };
        toVars   = { ...toVars, y: 0, filter: "blur(0px)" };
        break;
      case "clip-reveal":
        fromVars = { clipPath: "inset(0 0 100% 0)", opacity: 1 };
        toVars   = { clipPath: "inset(0 0 0% 0)", ease: "power4.inOut", duration: 1.1 };
        break;
      case "rotate-in":
        fromVars = { opacity: 0, y: 20, rotation: -1.5 };
        toVars   = { ...toVars, y: 0, rotation: 0 };
        break;
      case "stagger-up":
        // Animate children individually
        gsap.from(el.children, {
          opacity: 0,
          y: 22,
          stagger: staggerVal,
          duration: defaults.duration,
          ease: defaults.ease,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
        gsap.set(el, { opacity: 1 }); // parent visible
        return;
      default:
        fromVars = { opacity: 0, y: 30 };
        toVars   = { ...toVars, y: 0 };
    }

    gsap.fromTo(el, { ...fromVars }, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
}

/* ── Services ───────────────────────────────────────────────── */
const FILTER_TABS = [
  { id: "todos",   label: "Todos" },
  { id: "masajes", label: "Masajes & Terapias" },
  { id: "facial",  label: "Facial & Estética" },
  { id: "unas",    label: "Manicura & Pedicura" },
  { id: "humedas", label: "Zonas Húmedas" },
];

const TAB_CAT_MAP = {
  masajes: ["Masajes", "Corporal"],
  facial:  ["Facial & Pestañas", "Depilación", "Cabello", "Barbería"],
  unas:    ["Manicura & Pedicura"],
  humedas: ["Zonas Húmedas"],
};

function buildServiceCard(service, catName) {
  const duration = service.d || CATEGORY_DURATION[catName] || "Consultar";
  const priceLabel = service.desde ? `<span class="svc-price-from">desde</span>` : "";
  const waUrl = buildWaUrl(waMessageFor(service.n));

  return `<article class="svc-card">
    <div class="svc-card-body">
      <span class="svc-cat-badge">${catName}</span>
      <h3 class="svc-name">${service.n}</h3>
      <div class="svc-row-meta">
        <span class="svc-dur">${duration}</span>
        <span class="svc-price">${priceLabel}${formatCOP(service.p)}</span>
      </div>
    </div>
    <a href="${waUrl}" class="svc-action" target="_blank" rel="noopener noreferrer">
      Reservar
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </article>`;
}

let activeTab = "todos";

function renderServices(tabId) {
  const grid = document.getElementById("svc-grid");
  if (!grid) return;

  let html = "";
  const cats = tabId === "todos" ? Object.keys(CATALOG) : (TAB_CAT_MAP[tabId] || []);

  cats.forEach(cat => {
    const services = CATALOG[cat] || [];
    services.forEach(svc => {
      html += buildServiceCard(svc, cat);
    });
  });

  if (!html) { grid.innerHTML = '<p style="color:var(--texto-suave);text-align:center;padding:2rem;grid-column:1/-1">No hay servicios en esta categoría aún.</p>'; return; }

  // Animate out → swap → animate in
  if (typeof gsap !== "undefined") {
    gsap.to(grid, {
      opacity: 0, y: 8, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        grid.innerHTML = html;
        gsap.fromTo(grid.children,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: "power3.out" }
        );
        gsap.to(grid, { opacity: 1, y: 0, duration: 0.1 });
      },
    });
  } else {
    grid.innerHTML = html;
  }
}

function initServices() {
  const filtersEl = document.getElementById("svc-filters");
  if (!filtersEl) return;

  // Build filter tabs
  filtersEl.innerHTML = FILTER_TABS.map(tab =>
    `<button class="svc-tab${tab.id === "todos" ? " active" : ""}" data-tab="${tab.id}" role="tab" aria-selected="${tab.id === "todos"}">${tab.label}</button>`
  ).join("");

  filtersEl.querySelectorAll(".svc-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      filtersEl.querySelectorAll(".svc-tab").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      activeTab = btn.dataset.tab;
      renderServices(activeTab);
    });
  });

  renderServices("todos");
}

/* ── Horarios & Open/Closed Status ─────────────────────────── */
function initHorarios() {
  const container = document.getElementById("horarios-container");
  if (!container) return;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

  function isOpenNow(schedule) {
    if (!schedule) return false;
    return schedule.days.includes(dayOfWeek) && hour >= schedule.open && hour < schedule.close;
  }

  const openNow = isOpenNow(HORARIOS.weekdays) || isOpenNow(HORARIOS.saturday);

  const statusBadge = `<span style="
    display:inline-flex;align-items:center;gap:0.4rem;
    font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
    color:${openNow ? "#22c55e" : "#ef4444"};
    margin-bottom:0.8rem;
  ">
    <span style="width:7px;height:7px;border-radius:50%;background:currentColor;display:block;"></span>
    ${openNow ? "Abierto ahora" : "Cerrado ahora"}
  </span>`;

  container.innerHTML = `
    ${statusBadge}
    <p>${HORARIOS.weekdays.label} · ${HORARIOS.weekdays.open}:00 am — ${HORARIOS.weekdays.close === 20 ? "8:00 pm" : HORARIOS.weekdays.close + ":00"}</p>
    <p>${HORARIOS.saturday.label} · ${HORARIOS.saturday.open}:00 am — ${HORARIOS.saturday.close === 18 ? "6:00 pm" : HORARIOS.saturday.close + ":00"}</p>
    ${HORARIOS.sunday ? `<p>Domingo · ${HORARIOS.sunday.open}:00 am — ${HORARIOS.sunday.close}:00</p>` : "<p style='color:rgba(107,123,140,0.6)'>Domingo · Cerrado</p>"}
  `;
}

/* ── FAQ Accordion ──────────────────────────────────────────── */
function closeAnswer(dd) {
  if (!dd || dd.hidden) return;
  dd.style.overflow = "hidden";
  if (typeof gsap !== "undefined") {
    gsap.to(dd, {
      height: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => { dd.hidden = true; dd.style.height = ""; dd.style.overflow = ""; },
    });
  } else {
    dd.hidden = true;
  }
}

function openAnswer(dd) {
  if (!dd) return;
  dd.hidden = false;
  dd.style.overflow = "hidden";
  if (typeof gsap !== "undefined") {
    const h = dd.scrollHeight;
    gsap.fromTo(dd, { height: 0 }, {
      height: h, duration: 0.4, ease: "power2.out",
      onComplete: () => { dd.style.height = "auto"; dd.style.overflow = ""; },
    });
  }
}

function initFAQ() {
  document.querySelectorAll(".faq-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item  = btn.closest(".faq-item");
      const dd    = item.querySelector(".faq-a");
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Close all open items
      document.querySelectorAll(".faq-btn[aria-expanded='true']").forEach(openBtn => {
        openBtn.setAttribute("aria-expanded", "false");
        closeAnswer(openBtn.closest(".faq-item").querySelector(".faq-a"));
      });

      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        openAnswer(dd);
      }
    });
  });
}

/* ── Footer Year ─────────────────────────────────────────────── */
function initYear() {
  const el = document.getElementById("yr");
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Seagull/Cloud Parallax (bonus) ────────────────────────── */
function initParallaxExtras() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Very subtle parallax on section backgrounds
  document.querySelectorAll(".sec-bienvenida, .sec-historia").forEach(sec => {
    gsap.to(sec, {
      backgroundPositionY: "5%",
      ease: "none",
      scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

/* ── Zone image hover reveal ────────────────────────────────── */
function initZoneReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  document.querySelectorAll(".zona-row").forEach(row => {
    const media = row.querySelector(".zona-media");
    const text  = row.querySelector(".zona-text");
    if (!media || !text) return;

    gsap.fromTo(media,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1, scale: 1,
        duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: row, start: "top 80%", once: true },
      }
    );
  });
}

/* ── Scroll-driven section bg tint ─────────────────────────── */
function initSectionProgress() {
  // Nothing extra needed — CSS handles color progression
}

/* ── Init All ───────────────────────────────────────────────── */
(function init() {
  // Register GSAP plugin
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initLoader();
  initHeader();
  initMobileMenu();
  initYear();
  initHorarios();
  initFAQ();
  initServices();
  initWhatsAppLinks();

  // GSAP-dependent inits (run after GSAP loads via CDN)
  function onGSAPReady() {
    initHeroParallax();
    initReveal();
    initZoneReveal();
    initParallaxExtras();
  }

  if (typeof gsap !== "undefined") {
    onGSAPReady();
  } else {
    window.addEventListener("load", () => {
      if (typeof gsap !== "undefined") onGSAPReady();
    });
  }
})();

/* ── Lenis init (global reference for anchor links) ─────────── */
var lenis;
document.addEventListener("DOMContentLoaded", () => {
  lenis = initLenis();
});
