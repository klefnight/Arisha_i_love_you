console.log("Потому что рядом с тобой я нашёл свой дом.");

const $ = (sel) => document.querySelector(sel);

const screen1 = $("#screen-1");
const screen2 = $("#screen-2");
const screen3 = $("#screen-3");

const typeEl = $("#typewriter");
const noHint = $("#noHint");

const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");

const particlesCanvas = $("#particles");

const heartSvg = $("#heartSvg");
const heartPath = $("#heartPath");

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

const heartsLayer = $("#heartsLayer");

let heartsInterval = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function showScreen(screenToShow) {
  [screen1, screen2, screen3].forEach((s) => {
    s.classList.remove("is-visible");
    s.classList.remove("is-active");
  });

  screenToShow.classList.add("is-active");
  requestAnimationFrame(() => screenToShow.classList.add("is-visible"));
}

function reveal(el) {
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

async function typewriter(text, el, speed = 55) {
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed);
  }
}

async function drawHeart() {
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

async function runSequence() {
  await drawHeart();

  reveal(loadingLine);
  await sleep(600);

  progressWrap.hidden = false;
  requestAnimationFrame(() => progressWrap.classList.add("is-visible"));

  for (let p = 0; p <= 100; p++) {
    progressFill.style.width = `${p}%`;
    progressPct.textContent = `${p}%`;
    await sleep(18 + (p < 20 ? 10 : 0));
  }

  await sleep(550);

  reveal(line1);
  await sleep(1200);

  reveal(dateLine);
  await sleep(950);

  reveal(line2);
  await sleep(1100);

  photoBlock.hidden = false;
  requestAnimationFrame(() => photoBlock.classList.add("is-visible"));
  await sleep(1200);

  finalAsk.hidden = false;
  requestAnimationFrame(() => finalAsk.classList.add("is-visible"));
}

function startFloatingHearts() {
  if (heartsInterval) return;

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

noBtn.addEventListener("click", () => {
  noHint.textContent = "Некоторые решения требуют смелости. Попробуй ещё раз.";
  noHint.style.opacity = "1";

  screen1.classList.add("shake");
  screen1.classList.add("dim");

  setTimeout(() => {
    screen1.classList.remove("shake");
    screen1.classList.remove("dim");
  }, 450);
});

yesBtn.addEventListener("click", async () => {
  yesBtn.disabled = true;
  noBtn.disabled = true;

  showScreen(screen2);
  await sleep(700);
  runSequence();
});

finalBtn.addEventListener("click", async () => {
  showScreen(screen3);
  startFloatingHearts();
});

(async function init() {
  showScreen(screen1);
  await sleep(350);
  await typewriter("Ты мне доверяешь?", typeEl, 58);
})();
