// Hidden detail (EN + will also log RU/EN later)
console.log("Because with you, I found home.");

const $ = (sel) => document.querySelector(sel);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Screens */
const screen1 = $("#screen-1");
const screen2 = $("#screen-2");
const screen3 = $("#screen-3");

/* UI */
const typeEl = $("#typewriter");
const noHint = $("#noHint");
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const finalBtn = $("#finalBtn");

/* Particles */
const particlesCanvas = $("#particles");

/* Heart */
const heartSvg = $("#heartSvg");
const heartPath = $("#heartPath");

/* Story elements */
const loadingLine = $("#loadingLine");
const progressWrap = $("#progressWrap");
const progressFill = $("#progressFill");
const progressPct = $("#progressPct");

const line1 = $("#line1");
const dateLine = $("#dateLine");
const line2 = $("#line2");
const photoBlock = $("#photoBlock");
const caption = $("#caption");

const finalAsk = $("#finalAsk");
const finalQ = $("#finalQ");
const finalText = $("#finalText");

/* Final hearts */
const heartsLayer = $("#heartsLayer");
let heartsInterval = null;

/* Music */
const bgm = $("#bgm");
const soundBtn = $("#soundBtn");
let isMuted = true;

/* Effects */
const flash = $("#flash");
const glitch = $("#glitch");

/* Language */
const langRuBtn = $("#langRu");
const langEnBtn = $("#langEn");
const LS_LANG_KEY = "val_lang";

/* -------------------------
   Safety: quick DOM check
-------------------------- */
console.log("[VAL] DOM check:", {
  screen1: !!screen1, screen2: !!screen2, screen3: !!screen3,
  yesBtn: !!yesBtn, noBtn: !!noBtn, finalBtn: !!finalBtn,
  bgm: !!bgm, soundBtn: !!soundBtn
});

/* -------------------------
   Text dictionary
-------------------------- */
const TEXT = {
  ru: {
    q1: "Ты мне доверяешь?",
    yes: "Да",
    no: "Нет",
    noHint: "Некоторые решения требуют смелости. Попробуй ещё раз.",
    loading: "Загрузка чего-то важного…",
    line1: "Ты никогда не была случайностью.<br>Ты стала моим любимым решением.",
    date: "С 12 мая 2025 года",
    line2: "Каждый день с тобой — осознанный выбор.",
    caption: "Создано из моментов. Движимо чувствами.",
    finalQ: "Станешь моей Валентинкой?",
    finalBtn: "Запустить навсегда.exe",
    finalScreen:
      `Система заблокирована.<br>
       Партнёр выбран: <span class="accent">Ариша</span><br>
       Статус: <span class="accent">Незаменима.</span>`,
    console: "Потому что рядом с тобой я нашёл свой дом."
  },
  en: {
    q1: "Do you trust me?",
    yes: "Yes",
    no: "No",
    noHint: "Some decisions require courage. Try again.",
    loading: "Loading something important…",
    line1: "You were never a coincidence.<br>You became my favorite decision.",
    date: "Since May 12, 2025",
    line2: "Every day with you feels intentional.",
    caption: "Built with moments. Powered by feelings.",
    finalQ: "Will you be my Valentine?",
    finalBtn: "Run forever.exe",
    finalScreen:
      `System locked.<br>
       Partner selected: <span class="accent">Arisha</span><br>
       Status: <span class="accent">Irreplaceable.</span>`,
    console: "Because with you, I found home."
  }
};

let lang = "ru";

/* -------------------------
   Screen helpers
-------------------------- */
function showScreen(screenToShow) {
  [screen1, screen2, screen3].forEach((s) => {
    if (!s) return;
    s.classList.remove("is-visible");
    s.classList.remove("is-active");
  });

  if (!screenToShow) {
    console.warn("[VAL] showScreen: target screen is null");
    return;
  }

  screenToShow.classList.add("is-active");
  requestAnimationFrame(() => screenToShow.classList.add("is-visible"));
}

function reveal(el) {
  if (!el) return;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

/* -------------------------
   Typewriter
-------------------------- */
async function typewriter(text, el, speed = 58) {
  if (!el) return;
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed);
  }
}

/* -------------------------
   Language apply
-------------------------- */
function setLang(nextLang, retype = false) {
  lang = nextLang;
  localStorage.setItem(LS_LANG_KEY, lang);

  langRuBtn?.classList.toggle("is-active", lang === "ru");
  langEnBtn?.classList.toggle("is-active", lang === "en");

  if (yesBtn) yesBtn.textContent = TEXT[lang].yes;
  if (noBtn) noBtn.textContent = TEXT[lang].no;
  if (finalBtn) finalBtn.textContent = TEXT[lang].finalBtn;

  if (noHint && noHint.style.opacity === "1") noHint.textContent = TEXT[lang].noHint;

  if (loadingLine && !loadingLine.hidden) loadingLine.textContent = TEXT[lang].loading;
  if (line1 && !line1.hidden) line1.innerHTML = TEXT[lang].line1;
  if (dateLine && !dateLine.hidden) dateLine.textContent = TEXT[lang].date;
  if (line2 && !line2.hidden) line2.textContent = TEXT[lang].line2;
  if (caption) caption.textContent = TEXT[lang].caption;
  if (finalQ) finalQ.textContent = TEXT[lang].finalQ;

  if (screen3?.classList.contains("is-active") && finalText) {
    finalText.innerHTML = TEXT[lang].finalScreen;
  }

  if (retype) typewriter(TEXT[lang].q1, typeEl, 58);
}

/* -------------------------
   Particles
-------------------------- */
function startParticles() {
  if (!particlesCanvas) return null;
  const ctx = particlesCanvas.getContext("2d");
  if (!ctx) return null;

  const state = {
    w: 0, h: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    running: true,
    dots: []
  };

  function resize() {
    state.w = window.innerWidth;
    state.h = window.innerHeight;

    particlesCanvas.width = Math.floor(state.w * state.dpr);
    particlesCanvas.height = Math.floor(state.h * state.dpr);
    particlesCanvas.style.width = state.w + "px";
    particlesCanvas.style.height = state.h + "px";
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const count = Math.round(Math.min(95, Math.max(50, state.w / 16)));
    state.dots = Array.from({ length: count }, () => ({
      x: Math.random() * state.w,
      y: Math.random() * state.h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.22 + 0.06,
      red: Math.random() < 0.10
    }));
  }

  function draw() {
    if (!state.running) return;
    ctx.clearRect(0, 0, state.w, state.h);

    for (const d of state.dots) {
      d.x += d.vx;
      d.y += d.vy;

      if (d.x < -20) d.x = state.w + 20;
      if (d.x > state.w + 20) d.x = -20;
      if (d.y < -20) d.y = state.h + 20;
      if (d.y > state.h + 20) d.y = -20;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.red ? `rgba(255,0,51,${d.a})` : `rgba(255,255,255,${d.a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  particlesCanvas.style.opacity = "1";
  draw();

  return {
    stop() {
      state.running = false;
      particlesCanvas.style.opacity = "0";
      window.removeEventListener("resize", resize);
    }
  };
}

/* -------------------------
   Heart draw
-------------------------- */
async function drawHeart() {
  if (!heartPath || !heartSvg) return;

  const length = heartPath.getTotalLength();
  heartPath.style.strokeDasharray = String(length);
  heartPath.style.strokeDashoffset = String(length);

  heartPath.getBoundingClientRect();
  heartPath.style.transition = "stroke-dashoffset 2400ms ease-in-out";
  heartPath.style.strokeDashoffset = "0";

  await sleep(2550);

  heartSvg.classList.add("pulse");
  heartSvg.classList.add("heartComplete");
}

/* -------------------------
   Story sequence
-------------------------- */
async function runSequence() {
  await drawHeart();

  if (loadingLine) loadingLine.textContent = TEXT[lang].loading;
  reveal(loadingLine);
  await sleep(600);

  if (progressWrap) {
    progressWrap.hidden = false;
    requestAnimationFrame(() => progressWrap.classList.add("is-visible"));
  }

  for (let p = 0; p <= 100; p++) {
    if (progressFill) progressFill.style.width = `${p}%`;
    if (progressPct) progressPct.textContent = `${p}%`;
    await sleep(18 + (p < 20 ? 10 : 0));
  }

  await sleep(550);

  if (line1) line1.innerHTML = TEXT[lang].line1;
  reveal(line1);
  await sleep(1200);

  if (dateLine) dateLine.textContent = TEXT[lang].date;
  reveal(dateLine);
  await sleep(950);

  if (line2) line2.textContent = TEXT[lang].line2;
  reveal(line2);
  await sleep(1100);

  if (caption) caption.textContent = TEXT[lang].caption;
  if (photoBlock) {
    photoBlock.hidden = false;
    requestAnimationFrame(() => photoBlock.classList.add("is-visible"));
  }
  await sleep(1200);

  if (finalQ) finalQ.textContent = TEXT[lang].finalQ;
  if (finalBtn) finalBtn.textContent = TEXT[lang].finalBtn;
  if (finalAsk) {
    finalAsk.hidden = false;
    requestAnimationFrame(() => finalAsk.classList.add("is-visible"));
  }
}

/* -------------------------
   Final hearts
-------------------------- */
function startFloatingHearts() {
  if (!heartsLayer || heartsInterval) return;

  heartsInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heartFloat";
    heart.textContent = "❤";

    const left = Math.random() * 100;
    const size = 14 + Math.random() * 18;
    const drift = (Math.random() - 0.5) * 40;

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.transform = `translateX(${drift}px)`;

    heartsLayer.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }, 420);
}

/* -------------------------
   Music
-------------------------- */
function updateSoundIcon() {
  if (soundBtn) soundBtn.textContent = isMuted ? "🔇" : "🔊";
}

async function tryPlayMusic() {
  if (!bgm) return;
  try {
    bgm.volume = 0.55;
    await bgm.play();
    isMuted = false;
    updateSoundIcon();
  } catch (e) {
    // If music.mp3 is missing or blocked, we just stay muted.
    console.warn("[VAL] Music not playing:", e?.message || e);
    isMuted = true;
    updateSoundIcon();
  }
}

soundBtn?.addEventListener("click", async () => {
  if (!bgm) return;
  if (isMuted) await tryPlayMusic();
  else {
    bgm.pause();
    isMuted = true;
    updateSoundIcon();
  }
});

/* -------------------------
   Final effect
-------------------------- */
async function finalEffect() {
  glitch?.classList.add("on");
  await sleep(140);

  flash?.classList.add("on");
  await sleep(220);
  flash?.classList.remove("on");

  await sleep(120);
  glitch?.classList.remove("on");
}

/* -------------------------
   Events
-------------------------- */
noBtn?.addEventListener("click", () => {
  if (noHint) {
    noHint.textContent = TEXT[lang].noHint;
    noHint.style.opacity = "1";
  }

  screen1?.classList.add("shake");
  screen1?.classList.add("dim");
  setTimeout(() => {
    screen1?.classList.remove("shake");
    screen1?.classList.remove("dim");
  }, 450);
});

yesBtn?.addEventListener("click", async () => {
  yesBtn.disabled = true;
  if (noBtn) noBtn.disabled = true;

  // ✅ FIX: переход сразу, музыка потом
  showScreen(screen2);

  // Particles immediately
  startParticles();

  // Show sound button and attempt music (non-blocking to transition)
  if (soundBtn) soundBtn.hidden = false;
  updateSoundIcon();
  tryPlayMusic(); // not awaited

  await sleep(700);
  runSequence();
});

finalBtn?.addEventListener("click", async () => {
  await finalEffect();

  if (finalText) finalText.innerHTML = TEXT[lang].finalScreen;
  showScreen(screen3);
  startFloatingHearts();
});

/* Language buttons */
langRuBtn?.addEventListener("click", () => setLang("ru", true));
langEnBtn?.addEventListener("click", () => setLang("en", true));

/* -------------------------
   Init
-------------------------- */
(async function init() {
  const saved = localStorage.getItem(LS_LANG_KEY);
  if (saved === "ru" || saved === "en") lang = saved;

  setLang(lang, false);

  showScreen(screen1);
  await sleep(350);
  await typewriter(TEXT[lang].q1, typeEl, 58);

  console.log(TEXT[lang].console);
})();
