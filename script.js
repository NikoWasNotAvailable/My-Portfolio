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

// 3-up rotating gallery (center big, left/right smaller behind)
document.querySelectorAll('.project-gallery').forEach(gallery => {
  const slides = Array.from(gallery.querySelectorAll('.pg-slide'));
  const dots   = Array.from(gallery.querySelectorAll('.pg-dot'));
  const prev   = gallery.querySelector('.pg-prev');
  const next   = gallery.querySelector('.pg-next');
  if (slides.length < 3) return; // expects 3 images

  let i = 0; // center index

  const paint = () => {
    const n = slides.length;
    const L = (i - 1 + n) % n;
    const R = (i + 1) % n;

    slides.forEach((s, idx) => {
      s.classList.remove('pg-left','pg-center','pg-right','pg-off','is-active',
        'enter-from-right','enter-from-left','exit-to-left','exit-to-right');
      if (idx === i)      s.classList.add('pg-center','is-active');
      else if (idx === L) s.classList.add('pg-left');
      else if (idx === R) s.classList.add('pg-right');
      else                s.classList.add('pg-off');
    });
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };

  const nextFn = () => { i = (i + 1) % slides.length; paint(); };
  const prevFn = () => { i = (i - 1 + slides.length) % slides.length; paint(); };

  prev?.addEventListener('click', prevFn);
  next?.addEventListener('click', nextFn);
  dots.forEach((d, k) => d.addEventListener('click', () => { i = k; paint(); }));

  paint();
});
