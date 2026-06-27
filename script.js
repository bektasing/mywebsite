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

  // Expandable project cards
  document.querySelectorAll('.project--expandable').forEach((project) => {
    const closeBtn = project.querySelector('.project__close');

    const setExpanded = (expanded) => {
      project.classList.toggle('project--expanded', expanded);
      project.setAttribute('aria-expanded', String(expanded));
    };

    project.addEventListener('click', (e) => {
      if (e.target.closest('.project__close') || e.target.closest('a')) return;
      setExpanded(!project.classList.contains('project--expanded'));
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setExpanded(false);
    });
  });

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

  const visitorCountEl = document.getElementById('visitor-count');

  const formatVisitorCount = (value) => String(value).padStart(4, '0');

  const animateVisitorCount = (targetValue) => {
    if (!visitorCountEl) return;

    const startValue = 0;
    const duration = 1500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = Math.min(currentTime - startTime, duration);
      const progress = elapsed / duration;
      const current = Math.round(startValue + (targetValue - startValue) * progress);
      visitorCountEl.textContent = formatVisitorCount(current);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const loadVisitorCount = async () => {
    if (!visitorCountEl) return;

    try {
      const response = await fetch('https://api.counterapi.dev/v1/bektasing/mywebsite/up', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Counter API responded with ${response.status}`);
      }

      const data = await response.json();
      const value = Number(data.value ?? data.count ?? 0);

      animateVisitorCount(Number.isFinite(value) && value >= 0 ? value : 0);
    } catch (error) {
      console.error('Visitor counter yüklenemedi:', error);
      if (visitorCountEl) {
        visitorCountEl.textContent = formatVisitorCount(0);
      }
    }
  };

  loadVisitorCount();
});
