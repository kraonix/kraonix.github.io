(() => {
  const navbar = document.querySelector("[data-navbar]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const yearEl = document.querySelector("[data-year]");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const setScrolled = () => {
    const scrolled = window.scrollY > 6;
    if (navbar) navbar.classList.toggle("is-scrolled", scrolled);
  };

  const closeMenu = () => {
    if (!navbar || !toggle) return;
    navbar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!navbar || !toggle) return;
    navbar.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (!navbar) return;
      const isOpen = navbar.classList.contains("is-open");
      if (isOpen) closeMenu();
      else openMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (!navbar || !toggle) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    const clickedInside = navbar.contains(target);
    if (!clickedInside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  const smoothScrollHandler = (e) => {
    const a = e.currentTarget;
    if (!(a instanceof HTMLAnchorElement)) return;
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  };

  Array.from(document.querySelectorAll("[data-scroll]")).forEach((a) => {
    a.addEventListener("click", smoothScrollHandler);
  });

  navLinks.forEach((a) => {
    a.addEventListener("click", smoothScrollHandler);
  });

  const sections = ["#home", "#projects", "#skills"]
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const match = (a.getAttribute("href") || "") === id;
      a.classList.toggle("is-active", match);
      if (match) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((x) => x.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible && visible.target && visible.target.id) setActive(`#${visible.target.id}`);
      },
      { root: null, threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((s) => io.observe(s));
  }

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 720) closeMenu();
  });
})();
