/* =========================================================
  WEBSITE ROMANTIS — UNTUK ORANG TERSAYANG
  ---------------------------------------------------------
  Bagian yang mudah diedit:
  1. Musik: ubah MUSIC_PATH
  2. Foto: ubah file di assets/images/
  3. Teks: edit langsung di index.html
  4. Timeline/tanggal: edit di index.html
========================================================= */

const MUSIC_PATH = "https://voca.ro/1ozfrXnfboVO";

/* Element utama */
const panels = Array.from(document.querySelectorAll(".panel"));
const dotsContainer = document.getElementById("sectionDots");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let activeIndex = 0;
let touchStartY = 0;
let touchEndY = 0;
let isProgrammaticScroll = false;

/* =========================================================
  Floating particles / hearts
========================================================= */
function createParticles() {
  const container = document.getElementById("particles");
  const totalParticles = window.innerWidth < 700 ? 28 : 46;

  for (let i = 0; i < totalParticles; i++) {
    const particle = document.createElement("span");
    const isHeart = Math.random() > 0.76;

    particle.className = isHeart ? "particle heart" : "particle";
    particle.textContent = isHeart ? "♥" : "";

    particle.style.setProperty("--left", `${Math.random() * 100}%`);
    particle.style.setProperty("--top", `${80 + Math.random() * 40}%`);
    particle.style.setProperty("--size", `${isHeart ? 12 + Math.random() * 14 : 2 + Math.random() * 4}px`);
    particle.style.setProperty("--opacity", `${0.22 + Math.random() * 0.58}`);
    particle.style.setProperty("--duration", `${12 + Math.random() * 18}s`);
    particle.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    particle.style.animationDelay = `${Math.random() * 12}s`;

    container.appendChild(particle);
  }
}

createParticles();

/* =========================================================
  Dot navigation
========================================================= */
function createDots() {
  panels.forEach((panel, index) => {
    const dot = document.createElement("button");
    const title = panel.dataset.sectionTitle || `Bagian ${index + 1}`;

    dot.type = "button";
    dot.setAttribute("aria-label", `Ke bagian ${title}`);
    dot.addEventListener("click", () => scrollToPanel(index));

    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = Array.from(dotsContainer.querySelectorAll("button"));

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === activeIndex);
  });
}

function updateProgress() {
  const progress = ((activeIndex + 1) / panels.length) * 100;
  progressFill.style.width = `${progress}%`;
}

function setActivePanel(index) {
  activeIndex = Math.max(0, Math.min(index, panels.length - 1));
  updateDots();
  updateProgress();

  panels.forEach((panel, panelIndex) => {
    panel.classList.toggle("active", panelIndex === activeIndex);
  });
}

function scrollToPanel(index) {
  const targetIndex = Math.max(0, Math.min(index, panels.length - 1));
  const targetPanel = panels[targetIndex];

  if (!targetPanel) return;

  isProgrammaticScroll = true;

  targetPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  setActivePanel(targetIndex);

  window.setTimeout(() => {
    isProgrammaticScroll = false;
  }, 850);
}

createDots();
setActivePanel(0);

/* Tombol di dalam section */
document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = Number(button.dataset.scrollTarget);
    scrollToPanel(target);
  });
});

/* Tombol next/previous */
nextBtn.addEventListener("click", () => scrollToPanel(activeIndex + 1));
prevBtn.addEventListener("click", () => scrollToPanel(activeIndex - 1));

/* Keyboard support desktop */
window.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName?.toLowerCase();
  const isTyping = tag === "input" || tag === "textarea";

  if (isTyping) return;

  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    scrollToPanel(activeIndex + 1);
  }

  if (["ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    scrollToPanel(activeIndex - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    scrollToPanel(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    scrollToPanel(panels.length - 1);
  }
});

/* Touch gesture support HP */
window.addEventListener("touchstart", (event) => {
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  touchEndY = event.changedTouches[0].clientY;

  const distance = touchStartY - touchEndY;
  const threshold = 78;

  if (Math.abs(distance) < threshold) return;

  if (distance > 0) {
    scrollToPanel(activeIndex + 1);
  } else {
    scrollToPanel(activeIndex - 1);
  }
}, { passive: true });

/* Deteksi section aktif saat scroll manual */
const panelObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !isProgrammaticScroll) {
      const index = panels.indexOf(entry.target);
      setActivePanel(index);
    }
  });
}, {
  threshold: 0.58
});

panels.forEach((panel) => panelObserver.observe(panel));

/* =========================================================
  Reveal animation saat scroll
========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, {
  threshold: 0.16
});

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

/* =========================================================
  Swiper gallery
========================================================= */
const memorySwiper = new Swiper(".memorySwiper", {
  loop: true,
  grabCursor: true,
  speed: 850,
  centeredSlides: true,
  slidesPerView: 1.05,
  spaceBetween: 14,
  keyboard: {
    enabled: true
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    680: {
      slidesPerView: 1.25,
      spaceBetween: 18
    },
    980: {
      slidesPerView: 1.55,
      spaceBetween: 24
    }
  }
});

/* =========================================================
  Lightbox fullscreen foto
========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(image, caption) {
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt || "Foto kenangan";
  lightboxCaption.textContent = caption || "";
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".memory-slide img").forEach((image) => {
  image.addEventListener("click", () => {
    const caption = image.closest("figure")?.querySelector("figcaption")?.textContent;
    openLightbox(image, caption);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

/* =========================================================
  Surat digital
========================================================= */
const letterCard = document.getElementById("letterCard");
const openLetterBtn = document.getElementById("openLetterBtn");

openLetterBtn.addEventListener("click", () => {
  letterCard.classList.add("open");
  openLetterBtn.setAttribute("aria-expanded", "true");
});

/* =========================================================
  Background music
  Browser modern biasanya memblokir autoplay.
  Karena itu musik hanya diputar setelah user menekan tombol.
========================================================= */
const musicPlayer = document.getElementById("musicPlayer");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const musicIcon = document.getElementById("musicIcon");

const bgMusic = new Audio(MUSIC_PATH);
bgMusic.loop = true;
bgMusic.preload = "auto";

let isMusicPlaying = false;

async function playMusic() {
  try {
    await bgMusic.play();
    isMusicPlaying = true;
    musicPlayer.classList.add("playing");
    musicStatus.textContent = "Musik berjalan";
    musicIcon.textContent = "❚❚";
  } catch (error) {
    isMusicPlaying = false;
    musicPlayer.classList.remove("playing");
    musicStatus.textContent = "Putar Musik 🎵";
    musicIcon.textContent = "♪";
    console.warn("Autoplay diblokir browser. Tekan tombol musik untuk memutar.", error);
  }
}

function pauseMusic() {
  bgMusic.pause();
  isMusicPlaying = false;
  musicPlayer.classList.remove("playing");
  musicStatus.textContent = "Musik dijeda";
  musicIcon.textContent = "♪";
}

musicToggle.addEventListener("click", () => {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

/* =========================================================
  GSAP enhancement — tetap aman jika CDN gagal
========================================================= */
if (window.gsap) {
  gsap.from(".hero-content h1", {
    y: 28,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    delay: 0.18
  });

  gsap.from(".hero-subtitle", {
    y: 18,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.36
  });

  gsap.from(".primary-btn", {
    y: 16,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.52
  });
}

/* =========================================================
  Optimasi mobile: refresh Swiper saat orientasi berubah
========================================================= */
window.addEventListener("resize", () => {
  if (memorySwiper) {
    memorySwiper.update();
  }
});