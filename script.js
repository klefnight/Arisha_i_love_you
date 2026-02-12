// script.js
// Minimalist, cinematic pacing. No external libraries.
// (Hidden detail)
console.log("Because with you, I found home.");

const $ = (sel) => document.querySelector(sel);

const screen1 = $("#screen-1");
const screen2 = $("#screen-2");
const screen3 = $("#screen-3");

const typeEl = $("#typewriter");
const noHint = $("#noHint");

const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");

const particlesCanvas = $("#particles");

// Heart
const heartSvg = $("#heartSvg");
const heartPath = $("#heartPath");

// Story elements
const loadingLine = $("#loadingLine");
const progressWrap = $("#progressWrap");
const progressFill = $("#progressFill");
const progressPct = $("#progressPct");

const line1 = $("#line1");
const dateLine = $("#dateLine");
const line2 = $("#line2");
const photoBlock = $("#photoBlock");
const finalAsk = $("#finalAsk");
const finalBtn = $("#finalBtn");

// Final hearts
const heartsLayer = $("#heartsLayer");

let particles = null;
let heartsInterval = null;

/* -------------------------
   Helpers
-------------------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function showScreen(screenToShow) {
  // Hide all
  [screen1, screen2, screen3].forEach((s) => {
    s.classList.remove("is-visible");
    s.classList.remove("is-active");
  });

  // Show
  screenToShow.classList.add("is-active");
  requestAnimationFrame(() => screenToShow.classList.add("is-visible"));
}

function reveal(el) {
  el.hidden = false;
  // allow layout
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

function revealBlock(el) {
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

/* -------------------------
   Typewriter
-------------------------- */
async function typewriter(text, el, speed = 55) {
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed);
  }
}

/* -------------------------
   Particles (subtle floating dots)
-------------------------- */
function startParticles() {
  const ctx = particlesCanvas.getContext("2d");

  const state = {
    w: 0,
    h: 0,
    dots: [],
    running: true,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  };

  function resize() {
    state.w = window.innerWidth;
    state.h = window.innerHeight;

    particlesCanvas.width = Math.floor(state.w * state.dpr);
    particlesCanvas.height = Math.floor(state.h * state.dpr);
    particlesCanvas.style.width = state.w + "px";
    particlesCanvas.style.height = state.h + "px";

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    // Re-seed softly
    const count = Math.round(Math.min(90, Math.max(45, state.w / 16)));
    state.dots = Array.from({ length: count }, () => ({
      x: Math.random() * state.w,
      y: Math.random() * state.h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.25 + 0.06,
      red: Math.random() < 0.10, // occasional neon hint
    }));
  }

  function draw() {
    if (!state.running) return;
    ctx.clearRect(0, 0, state.w, state.h);

    for (const d of state.dots) {
      d.x += d.vx;
      d.y += d.vy;

      // wrap
      if (d.x < -20) d.x = state.w + 20;
      if (d.x > state.w + 20) d.x = -20;
      if (d.y < -20) d.y = state.h + 20;
      if (d.y > state.h + 20) d.y = -20;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);

      if (d.red) {
        ctx.fillStyle = `rgba(255, 0, 51, ${d.a})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${d.a})`;
      }
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  // Fade canvas in
  particlesCanvas.style.opacity = "1";

  draw();
  return {
    stop() {
      state.running = false;
      particlesCanvas.style.opacity = "0";
      window.removeEventListener("resize", resize);
    },
  };
}

/* -------------------------
   Heart stroke animation (SVG path)
-------------------------- */
async function drawHeart() {
  // Prepare stroke-dash animation
  const length = heartPath.getTotalLength();
  heartPath.style.strokeDasharray = String(length);
  heartPath.style.strokeDashoffset = String(length);

  // Force style recalculation so the transition applies
  heartPath.getBoundingClientRect();

  // Smooth trace
  heartPath.style.transition = "stroke-dashoffset 2400ms ease-in-out";
  heartPath.style.strokeDashoffset = "0";

  // Wait until it completes
  await sleep(2550);

  // Add stronger neon + pulse
  heartSvg.classList.add("pulse");
  heartSvg.classList.add("heartComplete");
}

/* -------------------------
   Cinematic story sequence
-------------------------- */
async function runSequence() {
  // 1) Heart draws
  await drawHeart();

  // 2) Loading line + progress
  reveal(loadingLine);
  await sleep(600);

  progressWrap.hidden = false;
  requestAnimationFrame(() => progressWrap.classList.add("is-visible"));

  // Cinematic progress: steady, intentional
  for (let p = 0; p <= 100; p++) {
    progressFill.style.width = `${p}%`;
    progressPct.textContent = `${p}%`;
    await sleep(18 + (p < 20 ? 10 : 0)); // slower at the start
  }

  await sleep(550);

  // 3) Lines
  reveal(line1);
  await sleep(1200);

  reveal(dateLine);
  dateLine.classList.add("is-visible");
  await sleep(950);

  reveal(line2);
  await sleep(1100);

  // 4) Photo
  photoBlock.hidden = false;
  requestAnimationFrame(() => photoBlock.classList.add("is-visible"));
  await sleep(1200);

  // 5) Final ask
  finalAsk.hidden = false;
  requestAnimationFrame(() => finalAsk.classList.add("is-visible"));
}

/* -------------------------
   Floating hearts for final screen
-------------------------- */
function startFloatingHearts() {
  if (heartsInterval) return;

  heartsInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heartFloat";
    heart.textContent = "❤";

    // Randomize placement and size subtly
    const left = Math.random() * 100;
    const size = 14 + Math.random() * 18;
    const drift = (Math.random() - 0.5) * 40;

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.transform = `translateX(${drift}px)`;

    heartsLayer.appendChild(heart);

    // Clean up after animation
    heart.addEventListener("animationend", () => heart.remove());
  }, 420);
}

function stopFloatingHearts() {
  if (heartsInterval) clearInterval(heartsInterval);
  heartsInterval = null;
}

/* -------------------------
   Button logic
-------------------------- */
noBtn.addEventListener("click", () => {
  // Show hint + soft shake + slight dim
  noHint.textContent = "Some decisions require courage. Try again.";
  noHint.style.opacity = "1";

  screen1.classList.add("shake");
  screen1.classList.add("dim");

  setTimeout(() => {
    screen1.classList.remove("shake");
    screen1.classList.remove("dim");
  }, 450);
});

yesBtn.addEventListener("click", async () => {
  // Prevent double click
  yesBtn.disabled = true;
  noBtn.disabled = true;

  // Transition to screen 2
  showScreen(screen2);

  // Start background particles
  particles = startParticles();

  // Run story
  await sleep(700);
  runSequence();
});

finalBtn.addEventListener("click", async () => {
  // Cinematic fade to final screen
  showScreen(screen3);

  // Keep particles alive for atmosphere; add hearts too
  startFloatingHearts();
});

/* -------------------------
   Init
-------------------------- */
(async function init() {
  showScreen(screen1);
  await sleep(350);
  await typewriter("Do you trust me?", typeEl, 58);
})();
