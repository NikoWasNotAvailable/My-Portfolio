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
