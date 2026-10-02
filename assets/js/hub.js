(function () {
  const root = document.body;
  const toggles = document.querySelectorAll("[data-mode]");

  function fitFrames() {
    const mode = root.dataset.device || "desktop";
    const baseW = mode === "mobile" ? 390 : 1280;
    const baseH = mode === "mobile" ? 844 : 800;
    const maxH = mode === "mobile" ? 520 : 340;
    document.querySelectorAll("[data-preview] .screen").forEach(function (screen) {
      const iframe = screen.querySelector("iframe");
      if (!iframe) return;
      const scale = screen.clientWidth / baseW;
      iframe.style.width = baseW + "px";
      iframe.style.height = baseH + "px";
      iframe.style.transform = "scale(" + scale + ")";
      screen.style.height = Math.min(baseH * scale, maxH) + "px";
    });
  }

  function setDevice(mode) {
    root.dataset.device = mode;
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.dataset.mode === mode ? "true" : "false");
    });
    requestAnimationFrame(fitFrames);
  }

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDevice(btn.dataset.mode);
    });
  });

  let current = null;
  document.querySelectorAll("[data-preview]").forEach(function (card) {
    const iframe = card.querySelector("iframe");
    const play = card.querySelector("[data-play]");
    function activate() {
      if (!iframe) return;
      if (current && current !== card) {
        current.classList.remove("is-live");
      }
      current = card;
      if (!iframe.getAttribute("src")) {
        iframe.addEventListener("load", function () {
          card.classList.add("is-ready");
        }, { once: true });
        iframe.src = iframe.dataset.src;
      }
      card.classList.add("is-live");
      fitFrames();
    }
    card.addEventListener("mouseenter", activate);
    card.addEventListener("focusin", activate);
    if (play) play.addEventListener("click", activate);
  });

  const start = window.matchMedia("(max-width: 720px)").matches ? "mobile" : "desktop";
  setDevice(start);
  window.addEventListener("resize", fitFrames);
  window.addEventListener("load", fitFrames);
})();
