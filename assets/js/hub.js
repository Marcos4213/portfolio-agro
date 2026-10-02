(function () {
  const viewer = document.querySelector("[data-viewer]");
  const links = Array.prototype.slice.call(document.querySelectorAll("[data-case]"));
  if (!viewer || !links.length) return;

  const frame = viewer.querySelector("[data-viewer-frame]");
  const titleEl = viewer.querySelector("[data-viewer-title]");
  const external = viewer.querySelector("[data-viewer-external]");
  const loading = viewer.querySelector("[data-viewer-loading]");
  const closeBtn = viewer.querySelector("[data-viewer-close]");
  const prevBtn = viewer.querySelector("[data-viewer-prev]");
  const nextBtn = viewer.querySelector("[data-viewer-next]");
  const focusable = [external, prevBtn, nextBtn, closeBtn];
  let index = -1;
  let lastFocus = null;
  let scrollY = 0;
  const baseTitle = document.title;

  function lock() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = "-" + scrollY + "px";
    document.body.classList.add("viewer-open");
  }

  function unlock() {
    document.body.classList.remove("viewer-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  }

  function writeUrl(i, mode) {
    const url = new URL(window.location.href);
    url.searchParams.set("case", links[i].getAttribute("data-case"));
    const state = { viewer: true };
    if (mode === "push") history.pushState(state, "", url);
    else if (mode === "replace") history.replaceState(state, "", url);
  }

  function show(i, historyMode) {
    const el = links[i];
    if (!el || !frame) return;
    const wasOpen = !viewer.hidden;
    index = i;
    const name = el.getAttribute("data-case-title") || "Case";
    const href = el.getAttribute("href");
    if (!wasOpen) {
      lastFocus = document.activeElement;
      lock();
    }
    titleEl.textContent = name;
    viewer.setAttribute("aria-label", name);
    frame.title = "Case " + name;
    external.href = href;
    loading.hidden = false;
    viewer.hidden = false;
    try {
      frame.contentWindow.location.replace(href);
    } catch (err) {
      frame.src = href;
    }
    document.title = name + " · DevBrasil";
    if (historyMode) writeUrl(i, historyMode);
    closeBtn.focus();
  }

  function hide(fromPop) {
    if (viewer.hidden) return;
    viewer.hidden = true;
    unlock();
    try {
      frame.contentWindow.location.replace("about:blank");
    } catch (err) {
      frame.removeAttribute("src");
    }
    loading.hidden = true;
    document.title = baseTitle;
    index = -1;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    if (!fromPop) {
      if (history.state && history.state.viewer) history.back();
      else {
        const url = new URL(window.location.href);
        url.searchParams.delete("case");
        history.replaceState({}, "", url);
      }
    }
  }

  function step(dir) {
    if (viewer.hidden) return;
    const next = (index + dir + links.length) % links.length;
    show(next, "replace");
  }

  links.forEach(function (el, i) {
    el.addEventListener("click", function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const menu = document.querySelector("[data-nav]");
      const toggle = document.querySelector("[data-nav-toggle]");
      if (menu) menu.classList.remove("is-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
      show(i, "push");
    });
  });

  function onViewerKey(event) {
    if (viewer.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      hide(false);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Tab" && event.currentTarget === document) {
      const list = focusable.filter(Boolean);
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  frame.addEventListener("load", function () {
    let src = "";
    try { src = frame.contentWindow.location.href; } catch (err) { src = frame.src || ""; }
    if (!src || src.indexOf("about:blank") !== -1) return;
    loading.hidden = true;
    try {
      frame.contentWindow.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          event.preventDefault();
          hide(false);
        }
      });
    } catch (err) {}
  });

  closeBtn.addEventListener("click", function () { hide(false); });
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  document.addEventListener("keydown", onViewerKey);

  window.addEventListener("popstate", function () {
    const id = new URLSearchParams(window.location.search).get("case");
    if (!id) {
      hide(true);
      return;
    }
    const i = links.findIndex(function (el) { return el.getAttribute("data-case") === id; });
    if (i >= 0) show(i, null);
  });

  const initial = new URLSearchParams(window.location.search).get("case");
  if (initial) {
    const i = links.findIndex(function (el) { return el.getAttribute("data-case") === initial; });
    if (i >= 0) show(i, null);
  }

  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      requestAnimationFrame(function () {
        const open = menu.classList.contains("is-open");
        toggle.textContent = open ? "Fechar" : "Menu";
      });
    });
  }

  const dock = document.querySelector("[data-dock]");
  const finalCta = document.querySelector("#cta");
  if (dock) {
    const place = function () {
      const past = window.scrollY > window.innerHeight * 0.55;
      let covered = false;
      if (finalCta) {
        const rect = finalCta.getBoundingClientRect();
        covered = rect.top < window.innerHeight * 0.72 && rect.bottom > 80;
      }
      dock.classList.toggle("is-on", past && !covered && viewer.hidden);
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
  }
})();
