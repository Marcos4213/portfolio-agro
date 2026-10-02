(function () {
  const cfg = window.PORTFOLIO || {
    name: "DevBrasil",
    brand: "DevBrasil",
    whatsapp: "5511930729435"
  };

  function waUrl(message) {
    const n = String(cfg.whatsapp || "5511930729435").replace(/\D/g, "");
    const text = message || ("Olá, " + cfg.name + ". Vi o portfólio e quero uma prévia do meu site.");
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(text);
  }

  window.portfolioWa = waUrl;

  function initWa() {
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      el.textContent = cfg.brand;
    });
    document.querySelectorAll("[data-owner]").forEach(function (el) {
      el.textContent = cfg.name;
    });
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      el.setAttribute("href", waUrl(el.getAttribute("data-wa")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  function initNav() {
    const btn = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav]");
    const header = document.querySelector("[data-header]");
    if (btn && menu) {
      btn.addEventListener("click", function () {
        const open = menu.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        });
      });
    }
    if (header) {
      const onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 6);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  function initReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    nodes.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) return;
      el.classList.add("wait");
    });
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("wait");
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (el) {
      if (el.classList.contains("wait")) io.observe(el);
    });
  }

  function initParallax() {
    const els = document.querySelectorAll("[data-parallax]");
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 800px)").matches) return;
    let ticking = false;
    const onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        els.forEach(function (el) {
          const rect = el.getBoundingClientRect();
          const speed = parseFloat(el.dataset.parallax) || 0.12;
          const y = rect.top * speed;
          el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initFaq() {
    document.querySelectorAll("[data-faq]").forEach(function (item) {
      const btn = item.querySelector("button");
      if (!btn) return;
      btn.addEventListener("click", function () {
        const open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initCatalog() {
    const root = document.querySelector("[data-catalog]");
    if (!root) return;
    const cards = Array.prototype.slice.call(root.querySelectorAll("[data-item]"));
    const filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    const culturaSelect = document.querySelector("[data-cultura-filter]");
    const empty = document.querySelector("[data-catalog-empty]");
    let cat = "all";
    let cultura = "all";

    function apply() {
      let visible = 0;
      cards.forEach(function (card) {
        const cats = (card.dataset.cat || "").split(/\s+/);
        const cults = (card.dataset.cultura || "").split(/\s+/);
        const okCat = cat === "all" || cats.indexOf(cat) !== -1;
        const okCu = cultura === "all" || cults.indexOf(cultura) !== -1;
        const show = okCat && okCu;
        card.hidden = !show;
        if (show) visible += 1;
      });
      filters.forEach(function (f) {
        f.setAttribute("aria-pressed", f.dataset.filter === cat ? "true" : "false");
      });
      if (empty) empty.hidden = visible !== 0;
    }

    filters.forEach(function (f) {
      f.addEventListener("click", function () {
        cat = f.dataset.filter || "all";
        apply();
      });
    });
    if (culturaSelect) {
      culturaSelect.addEventListener("change", function () {
        cultura = culturaSelect.value || "all";
        apply();
      });
    }
    apply();

    const modal = document.querySelector("[data-modal]");
    if (!modal) return;
    const title = modal.querySelector("[data-modal-title]");
    const body = modal.querySelector("[data-modal-body]");
    const wa = modal.querySelector("[data-modal-wa]");
    let last = null;

    function open(card) {
      last = document.activeElement;
      if (title) title.textContent = card.dataset.title || "";
      if (body) {
        body.replaceChildren();
        const tpl = card.querySelector("template");
        if (tpl) body.appendChild(tpl.content.cloneNode(true));
      }
      if (wa) {
        const msg = card.dataset.waMsg || ("Olá, " + cfg.name + ". Quero um catálogo assim no site da minha empresa.");
        wa.setAttribute("data-wa", msg);
        wa.href = waUrl(msg);
        wa.target = "_blank";
        wa.rel = "noopener noreferrer";
      }
      modal.hidden = false;
      document.body.classList.add("modal-open");
      const closeBtn = modal.querySelector("[data-modal-close]");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (last && last.focus) last.focus();
    }

    cards.forEach(function (card) {
      if (!card.hasAttribute("tabindex")) card.tabIndex = 0;
      card.setAttribute("role", "button");
      var label = card.dataset.title || "Abrir ficha";
      if (!card.hasAttribute("aria-label")) card.setAttribute("aria-label", "Abrir ficha: " + label);
      card.addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        open(card);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(card);
        }
      });
    });
    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    modal.addEventListener("click", function (event) {
      if (event.target === modal) close();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) close();
    });
  }

  function initLightbox() {
    const modal = document.querySelector("[data-lightbox]");
    if (!modal) return;
    const img = modal.querySelector("img");
    document.querySelectorAll("[data-lightbox-src]").forEach(function (el) {
      el.addEventListener("click", function () {
        img.src = el.getAttribute("data-lightbox-src");
        img.alt = el.getAttribute("data-lightbox-alt") || "";
        modal.hidden = false;
      });
    });
    function close() {
      modal.hidden = true;
      img.src = "";
    }
    modal.querySelectorAll("[data-lightbox-close]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    modal.addEventListener("click", function (event) {
      if (event.target === modal) close();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) close();
    });
  }

  function boot() {
    initWa();
    initNav();
    initReveal();
    initParallax();
    initFaq();
    initCatalog();
    initLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
