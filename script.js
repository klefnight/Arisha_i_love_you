/* -----------------------------------------
  Minimalist Valentine – no libraries
  Replace these values:
------------------------------------------ */
const INSERT_DATE = "12.05.2025";      // <-- change me
const INSERT_NAME = "Ариша";          // <-- change me

/* Hidden detail */
console.log("Because with you, I found home.");

/* Elements */
const screen1 = document.getElementById("screen-1");
const screen2 = document.getElementById("screen-2");
const screen3 = document.getElementById("screen-3");

const typeTarget = document.getElementById("typeTarget");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const noHint = document.getElementById("noHint");

const particlesCanvas = document.getElementById("particles");
const heartsLayer = document.getElementById("hearts");

const heartWrap = document.querySelector(".heart-wrap");
const loadingText = document.getElementById("loadingText");
const bar = document.getElementById("bar");
const pct = document.getElementById("pct");

const messageBlock = document.getElementById("messageBlock");
const sinceDateEl = document.getElementById("sinceDate");
const photoBlock = document.getElementById("photoBlock");
const photoCaption = document.getElementById("photoCaption");
const finalAsk = document.getElementById("finalAsk");

const btnFinal = document.getElementById("btnFinal");
const finalMsg = document.getElementById("finalMsg");

/* -------------------------
  Utilities
-------------------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function setActiveScreen(next) {
  [screen1, screen2, screen3].forEach(s => s.classList.remove("is-active"));
  next.classList.add("is-active");
}

function pulseNoFeedback() {
  // Atmospheric feedback for "No"
  noHint.textContent = "Some decisions require courage. Try again.";
  noHint.classList.add("show");

  screen1.classList.add("shake", "dim");
  setTimeout(() => screen1.classList.remove("shake"), 420);
  setTimeout(() => screen1.classList.remove("dim"), 650);
}

/* -------------------------
  Typewriter
-------------------------- */
async function typewriter(text, target, speed = 55) {
  target.textContent = "";
  for (let i = 0; i < text.length; i++) {
    target.textContent += text[i];
    await sleep(speed);
  }
}

/* -------------------------
  Particles (subtle ambient)
-------------------------- */
let pCtx, W, H, particles = [], animId = null;
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = particlesCanvas.width = Math.floor(window.innerWidth * dpr);
  H = particlesCanvas.height = Math.floor(window.innerHeight * dpr);
  particlesCanvas.style.width = "100%";
  particlesCanvas.style.height = "100%";
  if (pCtx) pCtx.setTransform(1,0,0,1,0,0);
  if (pCtx) pCtx.scale(dpr, dpr);
}

function initParticles(count = 42) {
  pCtx = particlesCanvas.getContext("2d", { alpha: true });
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.7 + Math.random() * 1.8,
    vx: (-0.15 + Math.random() * 0.3),
    vy: (-0.10 + Math.random() * 0.25),
    a: 0.10 + Math.random() * 0.22
  }));
}

function drawParticles() {
  if (!pCtx) return;
  pCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Soft dots, no harsh colors
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // wrap
    if (p.x < -10) p.x = window.innerWidth + 10;
    if (p.x > window.innerWidth + 10) p.x = -10;
    if (p.y < -10) p.y = window.innerHeight + 10;
    if (p.y > window.innerHeight + 10) p.y = -10;

    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(255,255,255,${p.a})`;
    pCtx.fill();
  }

  animId = requestAnimationFrame(drawParticles);
}

function startParticles() {
  particlesCanvas.classList.add("is-on");
  if (!pCtx) {
    resizeCanvas();
    initParticles();
    drawParticles();
  }
}

function stopParticles() {
  particlesCanvas.classList.remove("is-on");
  if (animId) cancelAnimationFrame(animId);
  animId = null;
}

/* -------------------------
  Floating hearts (after "Yes" + final screen)
-------------------------- */
function spawnHeart() {
  const el = document.createElement("div");
  el.className = "float-heart";
  const size = 10 + Math.random() * 18;
  const left = Math.random() * 100;
  const drift = (-20 + Math.random() * 40);

  el.style.left = `${left}vw`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.setProperty("--drift", `${drift}px`);
  el.style.animationDuration = `${6 + Math.random() * 5}s`;
  el.style.opacity = `${0.35 + Math.random() * 0.45}`;

  heartsLayer.appendChild(el);
  setTimeout(() => el.remove(), 12000);
}

let heartTimer = null;
function startHearts() {
  heartsLayer.classList.add("is-on");
  if (heartTimer) return;
  heartTimer = setInterval(() => {
    // small burst
    spawnHeart();
    if (Math.random() > 0.55) spawnHeart();
  }, 520);
}

function stopHearts() {
  heartsLayer.classList.remove("is-on");
  if (heartTimer) clearInterval(heartTimer);
  heartTimer = null;
}

/* Inject CSS for floating hearts (kept in JS to keep CSS file clean) */
(function injectHeartCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .float-heart{
      position:absolute;
      bottom:-40px;
      transform: rotate(-45deg);
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(120,255,214,.55));
      border-radius: 6px;
      filter: drop-shadow(0 0 10px rgba(120,255,214,.18));
      animation-name: floatUp;
      animation-timing-function: ease-in-out;
      animation-iteration-count: 1;
    }
    .float-heart::before,
    .float-heart::after{
      content:"";
      position:absolute;
      width:100%;
      height:100%;
      background: inherit;
      border-radius:50%;
    }
    .float-heart::before{ top:-50%; left:0; }
    .float-heart::after{ left:50%; top:0; }

    @keyframes floatUp{
      0%   { transform: translate(0,0) rotate(-45deg) scale(.9); opacity: 0; }
      10%  { opacity: 1; }
      100% { transform: translate(var(--drift), -110vh) rotate(-45deg) scale(1.15); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* -------------------------
  Main flow
-------------------------- */
async function start() {
  // Initial typewriter
  await typewriter("Do you trust me?", typeTarget, 58);

  // Button wiring
  btnNo.addEventListener("click", () => pulseNoFeedback());

  btnYes.addEventListener("click", async () => {
    // Transition to screen 2
    noHint.classList.remove("show");
    setActiveScreen(screen2);

    // Start ambient particles
    startParticles();

    // Heart reveal
    await sleep(350);
    heartWrap.classList.add("show");

    // Small pause for calmness
    await sleep(800);

    // Loading sequence
    await runLoading();

    // Reveal messages + photo + final ask
    await revealStory();
  });

  btnFinal.addEventListener("click", async () => {
    // Cinematic fade to final screen
    setActiveScreen(screen3);
    startHearts(); // floating hearts keep going in the background

    // Final message
    finalMsg.innerHTML =
      `System locked.<br>` +
      `Partner selected: <span style="color: rgba(120,255,214,.92); text-shadow: 0 0 18px rgba(120,255,214,.12);">${escapeHtml(INSERT_NAME)}</span><br>` +
      `Status: <span style="color: rgba(255,255,255,.92);">Irreplaceable.</span>`;
  });

  // Resize handler
  window.addEventListener("resize", () => {
    if (!pCtx) return;
    resizeCanvas();
  }, { passive: true });
}

async function runLoading() {
  loadingText.style.opacity = "1";
  let progress = 0;

  // Smooth 0 → 100 (slightly organic timing)
  while (progress < 100) {
    const step = 1 + Math.floor(Math.random() * 3); // 1-3
    progress = Math.min(100, progress + step);
    bar.style.width = `${progress}%`;
    pct.textContent = `${progress}%`;
    await sleep(45 + Math.random() * 55);
  }

  await sleep(450);
}

async function revealStory() {
  messageBlock.classList.add("show");

  // Pause before date
  await sleep(800);

  sinceDateEl.textContent = INSERT_DATE;
  // date glow animation
  await sleep(150);
  sinceDateEl.classList.add("show");

  // Pause then reveal photo
  await sleep(900);
  photoBlock.classList.add("show");

  await sleep(550);
  photoCaption.classList.add("show");

  // Final ask
  await sleep(900);
  finalAsk.classList.add("show");
}

/* Safe text injection */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

/* -------------------------
  Kick off
-------------------------- */
start();
