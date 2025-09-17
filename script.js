// Toggle navbar menu for mobile
const menuToggle = document.getElementById("menu-toggle");
const navLinksContainer = document.getElementById("nav-links");

// Smooth scroll helpers (keep center for Home/Contact)
(function () {
  const nav = document.querySelector('nav');

  function scrollToCenter(target) {
    if (!target) return;
    const navH = (nav?.offsetHeight || 72);
    const top = target.getBoundingClientRect().top + window.scrollY;
    const center = top + (target.offsetHeight / 2);
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const visibleCenterFromDocTop = (viewportH + navH) / 2;
    let scrollTop = center - visibleCenterFromDocTop;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportH);
    window.scrollTo({ top: Math.max(0, Math.min(scrollTop, maxScroll)), behavior: 'smooth' });
  }

  // Generic: align any anchor slightly below the navbar
  function scrollToAnchorWithOffset(anchorEl, extra = 16) {
    if (!anchorEl) return;
    const navH = (nav?.offsetHeight || 72);
    const y = anchorEl.getBoundingClientRect().top + window.scrollY - navH - extra;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: 'smooth' });
  }

  // About: slightly above the profile image
  function scrollAboutImage() {
    const about = document.querySelector('#about');
    if (!about) return;
    const img =
      about.querySelector('.about-avatar, .about-image, .profile-image, .profile, img');
    scrollToAnchorWithOffset(img || about, 24); // a bit more gap for the image
  }

  // Projects: slightly above the title
  function scrollProjectsTitle() {
    const projects = document.querySelector('#projects');
    if (!projects) return;
    const title = projects.querySelector('h1, h2, .section-title');
    scrollToAnchorWithOffset(title || projects, 25);
  }

  // Handle clicks on all in-page nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();

      // Keep Home/Contact centered; customize About/Projects
      if (id === '#about') {
        scrollAboutImage();
      } else if (id === '#projects') {
        scrollProjectsTitle();
      } else {
        scrollToCenter(el); // home and contact unchanged
      }

      // close mobile menu if open
      navLinksContainer?.classList?.remove('active');
      menuToggle?.classList?.remove('active');
    });
  });
})();

menuToggle.addEventListener("click", () => {
  navLinksContainer.classList.toggle("active");
});

// Improved active-link highlight: switches at each section's top
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
const navEl = document.querySelector('nav');

function updateActiveNav() {
  const navH = (navEl?.offsetHeight || 72);
  const marker = window.scrollY + navH + 1; // line just under the navbar

  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (marker >= top && marker < bottom) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("resize", updateActiveNav);
window.addEventListener("load", updateActiveNav);

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
  const dots = Array.from(gallery.querySelectorAll('.pg-dot'));
  const prev = gallery.querySelector('.pg-prev');
  const next = gallery.querySelector('.pg-next');
  if (slides.length < 3) return; // expects 3 images

  let i = 0; // center index

  const paint = () => {
    const n = slides.length;
    const L = (i - 1 + n) % n;
    const R = (i + 1) % n;

    slides.forEach((s, idx) => {
      s.classList.remove('pg-left', 'pg-center', 'pg-right', 'pg-off', 'is-active',
        'enter-from-right', 'enter-from-left', 'exit-to-left', 'exit-to-right');
      if (idx === i) s.classList.add('pg-center', 'is-active');
      else if (idx === L) s.classList.add('pg-left');
      else if (idx === R) s.classList.add('pg-right');
      else s.classList.add('pg-off');
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

// Replay fadeSlideUp (same as Hero/About) for Projects and Contact
document.addEventListener('DOMContentLoaded', () => {
  const sel = [
    '#projects h2',
    '#projects .project-gallery',
    '#projects .project-card',
    '#contact .contact-card',
    '#contact .contact-card > *'
  ].join(', ');

  const targets = Array.from(document.querySelectorAll(sel));
  targets.forEach(el => el.classList.add('reveal'));

  // Stagger: project galleries/cards
  const projItems = Array.from(document.querySelectorAll('#projects .project-gallery, #projects .project-card'));
  projItems.forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 0.08}s`));

  // Stagger: contact card children
  const contactKids = Array.from(document.querySelectorAll('#contact .contact-card > *'));
  contactKids.forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 0.08}s`));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('is-inview');
      } else {
        // remove so it animates again next time
        el.classList.remove('is-inview');
      }
    });
  }, { threshold: 0.25 });

  targets.forEach(el => io.observe(el));
});
