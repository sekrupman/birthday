const progressBar = document.querySelector("#progress-bar");
const timelineProgress = document.querySelector("#timeline-progress");
const memoryCards = document.querySelectorAll(".memory-card");
const surpriseButton = document.querySelector("#surprise-button");
const birthdayMessage = document.querySelector("#birthday-message");
const backgroundMusic = document.querySelector("#background-music");
const welcomeScreen = document.querySelector("#welcome-screen");
const candleButton = document.querySelector("#candle-button");
const pageSections = document.querySelectorAll(".site-header, main, .site-footer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const flameOutDuration = reduceMotion ? 0 : 450;
const overlayFadeDuration = reduceMotion ? 0 : 850;

document.body.classList.add("welcome-open");
pageSections.forEach((section) => section.setAttribute("inert", ""));
candleButton.focus();

candleButton.addEventListener("click", () => {
  startBackgroundMusic();
  candleButton.disabled = true;
  welcomeScreen.classList.add("is-extinguished");
  window.setTimeout(() => {
    welcomeScreen.classList.add("is-leaving");
    welcomeScreen.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      welcomeScreen.hidden = true;
      document.body.classList.remove("welcome-open");
      pageSections.forEach((section) => section.removeAttribute("inert"));
      document.querySelector("#hero-title").focus();
    }, overlayFadeDuration);
  }, flameOutDuration);
});

function updateProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.width = `${Math.min(pageProgress * 100, 100)}%`;

  const timeline = document.querySelector(".timeline");
  if (!timeline) return;
  const timelineBounds = timeline.getBoundingClientRect();
  const timelineTop = timelineBounds.top + window.scrollY;
  const timelineHeight = timelineBounds.height;
  const viewportPoint = window.scrollY + window.innerHeight * 0.62;
  const timelineProgressValue = Math.max(0, Math.min(1, (viewportPoint - timelineTop) / timelineHeight));
  timelineProgress.style.height = `${timelineProgressValue * 100}%`;
}

function revealCard(card) {
  card.classList.add("is-revealed");
  const button = card.querySelector(".reveal-button");
  card.querySelector(".memory-content").hidden = false;
  button.setAttribute("aria-expanded", "true");
  button.innerHTML = 'Close <span aria-hidden="true">↙</span>';
}

function hideCard(card) {
  card.classList.remove("is-revealed");
  const button = card.querySelector(".reveal-button");
  card.querySelector(".memory-content").hidden = true;
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = 'Unwrap the photo <span aria-hidden="true">✦</span>';
}

memoryCards.forEach((card) => {
  const button = card.querySelector(".reveal-button");
  button.addEventListener("click", () => {
    if (card.classList.contains("is-revealed")) {
      hideCard(card);
    } else {
      revealCard(card);
    }
  });
});

surpriseButton.addEventListener("click", () => {
  const isOpen = surpriseButton.getAttribute("aria-expanded") === "true";
  surpriseButton.setAttribute("aria-expanded", String(!isOpen));
  birthdayMessage.hidden = isOpen;
  surpriseButton.innerHTML = isOpen
    ? 'Open your birthday wish <span aria-hidden="true">♡</span>'
    : 'Your birthday wish is open <span aria-hidden="true">♥</span>';
});

function startBackgroundMusic() {
  backgroundMusic.play().catch((error) => {
    if (error.name !== "NotAllowedError") {
      console.error("Could not play the background song:", error);
    }
  });
}

backgroundMusic.addEventListener("error", () => {
  console.error("Could not load the background song:", backgroundMusic.currentSrc);
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
