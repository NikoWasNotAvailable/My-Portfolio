// Toggle navbar menu for mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinksContainer = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinksContainer.classList.toggle("active");
});

// Auto-highlight navbar link based on scroll position
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// Re-trigger About Me animation when section enters viewport
const aboutText = document.querySelector('.about-text');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutText.style.animation = 'none';
        // Force reflow to restart animation
        void aboutText.offsetWidth;
        aboutText.style.animation = 'fadeSlideUp 1.2s cubic-bezier(.77,0,.18,1) forwards';
      } else {
        aboutText.style.animation = 'none';
      }
    });
  },
  { threshold: 0.3 }
);

if (aboutText) {
  observer.observe(aboutText);
}

// Re-trigger Home animation when section enters viewport
const heroText = document.querySelector('.hero-content');
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroText.style.animation = 'none';
        // Force reflow to restart animation
        void heroText.offsetWidth;
        heroText.style.animation = 'fadeSlideUp 1.2s cubic-bezier(.77,0,.18,1) forwards';
      }
    });
  },
  { threshold: 0.3 }
);

if (heroText) {
  heroObserver.observe(heroText);
}

// Project gallery controls
document.querySelectorAll('.project-gallery').forEach(g => {
  const slides = [...g.querySelectorAll('.pg-slide')];
  const dots = [...g.querySelectorAll('.pg-dot')];
  const prev = g.querySelector('.pg-prev');
  const next = g.querySelector('.pg-next');
  let i = 0;
  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };
  prev?.addEventListener('click', () => show(i - 1));
  next?.addEventListener('click', () => show(i + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
  show(0);
});
