document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const yearEl = document.getElementById('year');
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  // Current year in footer
  yearEl.textContent = new Date().getFullYear();

  // Header scroll effect
  const handleScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile navigation
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    navToggle.classList.toggle('nav__toggle--open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinkEls.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav__links--open');
      navToggle.classList.remove('nav__toggle--open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const observerNav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach((link) => {
            link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observerNav.observe(section));

  // Reveal animations on scroll
  const revealEls = document.querySelectorAll('.reveal');

  const observerReveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observerReveal.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observerReveal.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
