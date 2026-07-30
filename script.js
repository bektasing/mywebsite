document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navAnchors = [...document.querySelectorAll(".nav__links a")];
  const modals = [...document.querySelectorAll(".project-modal")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocusedElement = null;

  document.getElementById("year").textContent = new Date().getFullYear();

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const willOpen = !navLinks.classList.contains("is-open");
    navLinks.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
  });

  navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("is-open") &&
      !navLinks.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  const sections = [...document.querySelectorAll("main section[id]")];
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navAnchors.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          if (isCurrent) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
  );

  sections.forEach((section) => navigationObserver.observe(section));

  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const closeModal = (modal) => {
    if (!modal?.open || modal.classList.contains("is-closing")) return;

    const finishClose = () => {
      modal.close();
      modal.classList.remove("is-closing");
      document.body.classList.remove("modal-open");
      lastFocusedElement?.focus();
    };

    if (reducedMotion) {
      finishClose();
      return;
    }

    modal.classList.add("is-closing");
    window.setTimeout(finishClose, 160);
  };

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.openModal);
      if (!modal) return;

      lastFocusedElement = button;
      document.body.classList.add("modal-open");
      modal.showModal();
      modal.querySelector("[data-close-modal]")?.focus();
    });
  });

  modals.forEach((modal) => {
    modal.querySelector("[data-close-modal]")?.addEventListener("click", () => {
      closeModal(modal);
    });

    modal.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeModal(modal);
    });

    modal.addEventListener("click", (event) => {
      const bounds = modal.getBoundingClientRect();
      const clickedBackdrop =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (clickedBackdrop) closeModal(modal);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
});
