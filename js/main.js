let WORK = [];
let UPCOMING = [];

const root = document.documentElement;

function setAccent(hex) {
  root.style.setProperty("--accent", hex);
}

/* ============================================
   LOAD DATA
   ============================================ */
async function loadData() {
  try {
    const [workRes, upcomingRes] = await Promise.all([
      fetch("data/work.json"),
      fetch("data/upcoming.json"),
    ]);
    WORK = await workRes.json();
    UPCOMING = await upcomingRes.json();

    initHero();
    renderWork();
    renderCarousel();
    renderContactCollage();
    initScrollObserver();
  } catch (err) {
    console.error("Failed to load site data:", err);
    document.getElementById("frameList").innerHTML =
      `<p style="color:#8f8b83;font-family:var(--font-mono);">Couldn't load work.json — check the data folder.</p>`;
  }
}

/* ============================================
   HERO — rotating headline + crossfading bg + accent
   ============================================ */
function initHero() {
  const bgWrap = document.getElementById("heroBg");
  const rotator = document.getElementById("heroRotator");
  const items = WORK.slice(0, 5);

  bgWrap.innerHTML = items
    .map((p, i) => `<img src="${p.image}" alt="" class="${i === 0 ? "active" : ""}" data-i="${i}">`)
    .join("");

  rotator.innerHTML = items
    .map(
      (p, i) => `
      <p class="hero-line ${i === 0 ? "active" : ""}" data-i="${i}">
        ${p.headline}
        <span class="tag">${p.place} — ${p.date}</span>
      </p>`
    )
    .join("");

  setAccent(items[0].accent);

  let current = 0;
  setInterval(() => {
    const next = (current + 1) % items.length;

    bgWrap.querySelector(`img[data-i="${current}"]`).classList.remove("active");
    bgWrap.querySelector(`img[data-i="${next}"]`).classList.add("active");

    rotator.querySelector(`.hero-line[data-i="${current}"]`).classList.remove("active");
    rotator.querySelector(`.hero-line[data-i="${next}"]`).classList.add("active");

    setAccent(items[next].accent);
    current = next;
  }, 4500);
}

/* ============================================
   WORK — render story blocks
   ============================================ */
function renderWork() {
  const list = document.getElementById("frameList");
  list.innerHTML = WORK.map(
    (p) => `
    <div class="frame-block" data-accent="${p.accent}" data-place="${escapeHtml(p.place)}"
         data-exif="${p.exif.aperture} · ${p.exif.shutter} · ISO ${p.exif.iso} · ${p.exif.focal}">
      <div class="frame-photo" data-id="${p.id}">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy">
      </div>
      <div class="frame-meta">
        <p class="kicker">${escapeHtml(p.category)}</p>
        <h3>${escapeHtml(p.title)}</h3>
        <p class="place">${escapeHtml(p.place)} — ${escapeHtml(p.date)}</p>
        <p class="blurb">${escapeHtml(p.blurb)}</p>
        <button class="read-story" data-id="${p.id}">Read the story ↗</button>
      </div>
    </div>`
  ).join("");

  list.querySelectorAll(".read-story, .frame-photo").forEach((el) => {
    el.addEventListener("click", () => openModal(el.dataset.id));
  });
}

/* ============================================
   SCROLL-DRIVEN ACCENT + LIGHT METER
   ============================================ */
function initScrollObserver() {
  const meter = document.getElementById("lightMeter");
  const lmPlace = document.getElementById("lmPlace");
  const lmExif = document.getElementById("lmExif");
  const blocks = document.querySelectorAll(".frame-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setAccent(el.dataset.accent);
          lmPlace.textContent = el.dataset.place;
          lmExif.textContent = el.dataset.exif;
          meter.classList.add("visible");
        }
      });
    },
    { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
  );

  blocks.forEach((b) => observer.observe(b));

  // hide light meter near hero / footer
  const hero = document.getElementById("hero");
  const footer = document.querySelector(".site-footer");
  const edgeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === hero) meter.classList.remove("visible");
      });
    },
    { threshold: 0.6 }
  );
  edgeObserver.observe(hero);

  // nav background on scroll
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });
}

/* ============================================
   UPCOMING CAROUSEL
   ============================================ */
function renderCarousel() {
  const wrap = document.getElementById("carousel");
  const p = UPCOMING[0];
  if (!p) { wrap.innerHTML = ""; return; }
  wrap.innerHTML = `
    <div class="upcoming-showcase" style="--accent:${p.accent}">
      <p class="upcoming-eyebrow">Upcoming</p>
      <h3 class="upcoming-name">${escapeHtml(p.title)}</h3>
    </div>`;
}

/* ============================================
   CONTACT COLLAGE — tiles the work photos as a background mosaic
   ============================================ */
function renderContactCollage() {
  const el = document.getElementById("contactCollage");
  if (!el || !WORK.length) return;
  const tileCount = 18;
  const tiles = Array.from({ length: tileCount }, (_, i) => WORK[i % WORK.length]);
  el.innerHTML = tiles
    .map((p) => `<img src="${p.image}" alt="" loading="lazy">`)
    .join("");
}

/* ============================================
   MODAL
   ============================================ */
function openModal(id) {
  const post = WORK.find((p) => p.id === id);
  if (!post) return;

  document.getElementById("modalImg").src = post.image;
  document.getElementById("modalImg").alt = post.title;
  document.getElementById("modalKicker").textContent = `${post.category} — ${post.place}`;
  document.getElementById("modalTitle").textContent = post.title;
  document.getElementById("modalStory").innerHTML = post.story
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  setAccent(post.accent);
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ============================================
   UTIL
   ============================================ */
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadData();
