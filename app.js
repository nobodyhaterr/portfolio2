/* NOBODYHATERR® — behaviour. Plain JS, no build step, works from file:// too. */
(function () {
  "use strict";

  var S = window.SITE, STR = window.STR;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var canVT = typeof document.startViewTransition === "function";
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ------------------------------------------------------------------ i18n */
  var LANG = "en";
  try { LANG = localStorage.getItem("lang"); } catch (e) {}
  if (LANG !== "fr" && LANG !== "en") LANG = (navigator.language || "").toLowerCase().indexOf("fr") === 0 ? "fr" : "en";
  var T = function (k) { return (STR[LANG] && STR[LANG][k]) || STR.en[k] || k; };
  var loc = function (o) { return o[LANG] || o.en; };

  function applyI18n(root) {
    $$("[data-i18n]", root).forEach(function (e) { e.textContent = T(e.dataset.i18n); });
    $$("[data-i18n-html]", root).forEach(function (e) { e.innerHTML = T(e.dataset.i18nHtml); });
    $$("[data-i18n-attr]", root).forEach(function (e) {
      e.dataset.i18nAttr.split(";").forEach(function (p) { var kv = p.split(":"); e.setAttribute(kv[0], T(kv[1])); });
    });
  }

  /* --------------------------------------------------------------- springs */
  /* Apple's two-parameter spring: `response` (seconds to reach target) and `damping` ratio
     (1 = no overshoot). Animates from the CURRENT value with the CURRENT velocity, so it can be
     grabbed and redirected at any instant. */
  function spring(from, to, v0, o, onUpdate, onDone) {
    var response = o.response || 0.4, zeta = o.damping == null ? 1 : o.damping;
    var k = Math.pow(2 * Math.PI / response, 2), c = 4 * Math.PI * zeta / response;
    var x = from, v = v0, last = performance.now(), raf, dead = false;
    function step(now) {
      if (dead) return;
      var dt = Math.min((now - last) / 1000, 0.034); last = now;
      var n = Math.ceil(dt / 0.004) || 1, h = dt / n;
      for (var i = 0; i < n; i++) { v += (-k * (x - to) - c * v) * h; x += v * h; }
      if (Math.abs(x - to) < 0.2 && Math.abs(v) < 4) { onUpdate(to); if (onDone) onDone(); return; }
      onUpdate(x); raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return { stop: function () { dead = true; cancelAnimationFrame(raf); } };
  }
  /* Where a flick will come to rest (exponential-decay form Apple ships, not v²/2a). */
  function project(v, d) { d = d || 0.998; return (v / 1000) * d / (1 - d); }
  /* Progressive resistance past an edge. */
  function rubber(over, dim) { var c = 0.55; return (over * dim * c) / (dim + c * Math.abs(over)); }

  /* -------------------------------------------------------------- carousel */
  function Carousel(root, opts) {
    var view = $(".car__view", root), track = $(".car__track", root), slides = $$(".car__slide", root), n = slides.length;
    var prev = $("[data-car=prev]", root), next = $("[data-car=next]", root), count = $(".car__count", root), thumbs = $$(".car__thumbs button", root);
    var W = view.clientWidth, i = opts.start || 0, x = 0, anim = null, drag = null, wasAnim = false;

    function snap(k) { return -k * W; }
    function set(v) { x = v; track.style.transform = "translate3d(" + v + "px,0,0)"; }
    function ui() {
      count.innerHTML = "<b>" + (i + 1) + "</b> / " + n;
      prev.setAttribute("aria-disabled", i === 0); next.setAttribute("aria-disabled", i === n - 1);
      thumbs.forEach(function (b, k) { if (k === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      slides.forEach(function (s, k) { s.inert = k !== i; });
      if (opts.onChange) opts.onChange(i);
    }
    function go(k, v) {
      k = Math.max(0, Math.min(n - 1, k)); v = v || 0;
      if (k !== i) { i = k; ui(); }
      if (anim) anim.stop();
      if (reduce.matches) { set(snap(k)); return; }
      /* bounce only when the gesture carried momentum */
      anim = spring(x, snap(k), v, { response: 0.42, damping: Math.abs(v) > 400 ? 0.82 : 1 }, set, function () { anim = null; });
    }

    view.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      wasAnim = !!anim; if (anim) { anim.stop(); anim = null; }           /* grab it mid-flight */
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, startX: x, on: false, s: [{ t: e.timeStamp, x: e.clientX }] };
    });
    view.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.on) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;                  /* hysteresis */
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }          /* vertical: let the page scroll */
        drag.on = true; drag.x0 = e.clientX; dx = 0;                       /* track from where the finger is */
        view.setPointerCapture(e.pointerId); root.classList.add("is-drag");
      }
      var raw = drag.startX + dx, min = -(n - 1) * W;
      set(raw > 0 ? rubber(raw, W) : raw < min ? min + rubber(raw - min, W) : raw);   /* 1:1, soft edges */
      drag.s.push({ t: e.timeStamp, x: e.clientX });
      while (drag.s.length > 2 && e.timeStamp - drag.s[0].t > 100) drag.s.shift();
    });
    function release(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag; drag = null; root.classList.remove("is-drag");
      if (!d.on) { if (wasAnim) go(i, 0); return; }
      var s = d.s, a = s[0], b = s[s.length - 1], dt = (b.t - a.t) / 1000;
      var v = cancelled || dt <= 0 ? 0 : (b.x - a.x) / dt;                  /* px/s at release */
      var target = Math.round(-(x + project(v)) / W);                       /* land where the flick is heading */
      go(Math.max(i - 1, Math.min(i + 1, target)), v);                      /* hand the velocity to the spring */
    }
    view.addEventListener("pointerup", function (e) { release(e, false); });
    view.addEventListener("pointercancel", function (e) { release(e, true); });
    view.addEventListener("lostpointercapture", function (e) { if (drag && drag.on) release(e, true); });

    prev.addEventListener("click", function () { go(i - 1); });
    next.addEventListener("click", function () { go(i + 1); });
    thumbs.forEach(function (b, k) { b.addEventListener("click", function () { go(k); }); });
    root.addEventListener("keydown", function (e) {
      if (e.target.closest("iframe") || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); } else if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    });
    var ro = new ResizeObserver(function () { W = view.clientWidth; if (!drag) { if (anim) anim.stop(); anim = null; set(snap(i)); } });
    ro.observe(view);

    set(snap(i)); ui();
    return { index: function () { return i; }, destroy: function () { ro.disconnect(); if (anim) anim.stop(); } };
  }

  /* ---------------------------------------------------------------- render */
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var PLAY = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  var GRAPHICS = S.projects.map(function (_, k) { return k; }).reverse();   /* newest first, like the original */
  var MOTION = S.videos.map(function (_, k) { return k; }).reverse();

  function renderGrids(instant) {
    var d = instant ? " in" : "";
    $("#grid").innerHTML = GRAPHICS.map(function (k, n) {
      var p = S.projects[k], s0 = p.slides[0].src;
      return '<a class="card rv' + d + '" href="#p' + k + '" data-open="p' + k + '" style="transition-delay:' + (n * 70) + 'ms">' +
        '<figure class="card__media"><img src="assets/' + s0 + '-s.webp" alt="" width="720" height="900" decoding="async"' + (n > 1 ? ' loading="lazy"' : "") + "></figure>" +
        '<div class="card__cap"><span class="card__n" aria-hidden="true">' + pad(k + 1) + '</span><h3 class="card__t">' + esc(p.title) + '</h3><span class="card__y">' + p.year + "</span>" +
        '<p class="card__c">' + esc(loc(p.cat)) + "</p></div></a>";
    }).join("");
    $("#vgrid").innerHTML = MOTION.map(function (k) {
      var v = S.videos[k];
      return '<a class="card card--wide rv' + d + '" href="#v' + k + '" data-open="v' + k + '">' +
        '<figure class="card__media"><img src="assets/yt-' + v.yt[0] + '.webp" alt="" width="960" height="540" decoding="async" loading="lazy">' +
        '<span class="card__play" aria-hidden="true">' + PLAY + "</span></figure>" +
        '<div class="card__cap"><span class="card__n" aria-hidden="true">' + pad(k + 1) + '</span><h3 class="card__t">' + esc(v.title) + '</h3><span class="card__y">' + v.year + "</span>" +
        '<p class="card__c">' + esc(loc(v.cat)) + "</p></div></a>";
    }).join("");
    observeReveals();
  }

  function renderAcc() {
    $("#acc").innerHTML = [0, 1, 2, 3, 4, 5].map(function (k) {
      return '<details name="disc"><summary data-i18n="d' + k + '.t"></summary><p data-i18n="d' + k + '.p"></p></details>';
    }).join("");
  }

  /* ------------------------------------------------------- reveal on scroll */
  var io = null;
  function observeReveals() {
    var els = $$(".rv:not(.in)");
    if (!("IntersectionObserver" in window) || reduce.matches) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ------------------------------------------------------- header + wayfinding */
  var bar = $("#bar"), links = $$(".nav a"), pill = $(".nav__pill");
  var secs = ["work", "video", "about", "contact"].map(function (id) { return document.getElementById(id); });
  function placePill() {
    var a = $(".nav a[aria-current]");
    if (!a) { pill.classList.remove("on"); return; }
    pill.style.setProperty("--x", a.offsetLeft + "px"); pill.style.setProperty("--w", a.offsetWidth + "px"); pill.classList.add("on");
  }
  var cur = null, ticking = false;
  function spy() {
    ticking = false;
    var y = scrollY + innerHeight * 0.35, id = "";
    secs.forEach(function (s) { if (s.offsetTop <= y) id = s.id; });
    if (id !== cur) {
      cur = id;
      links.forEach(function (a) { if (a.dataset.sec === id) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
      placePill();
    }
    bar.classList.toggle("is-scrolled", scrollY > 8);
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });

  /* ------------------------------------------------------------------ hero */
  function fitHero() {
    var wm = $(".hero__wm"), a = $(".ln--a"), b = $(".ln--b"), meta = $(".hero__meta"), hero = $(".hero");
    if (!wm || !a.offsetWidth) return;
    a.style.fontSize = b.style.fontSize = "100px";
    wm.style.setProperty("--wa", a.offsetWidth / 100); wm.style.setProperty("--wb", b.offsetWidth / 100);
    a.style.fontSize = b.style.fontSize = "";
    wm.style.setProperty("--k", 1);
    var avail = innerHeight - parseFloat(getComputedStyle(hero).paddingTop) - meta.offsetHeight - 8;
    var need = wm.getBoundingClientRect().height;
    if (need > avail) wm.style.setProperty("--k", Math.max(0.35, avail / need).toFixed(4));
  }

  /* ------------------------------------------------------------------ sheet */
  var sheet = $("#sheet"), scroller = $("#sheet-scroll"), main = $("#main");
  var st = { open: null, opener: null, y: 0, inApp: false, car: null, last: null };

  function parseHash() {
    var m = /^#([pv])(\d+)$/.exec(location.hash); if (!m) return null;
    var list = m[1] === "p" ? S.projects : S.videos, i = +m[2];
    return list[i] ? { k: m[1], i: i } : null;
  }

  function carouselHTML(k, p, id) {
    var isP = k === "p", n = isP ? p.slides.length : p.yt.length;
    var ar = isP ? p.ratio : [16, 9], arn = ar[0] / ar[1];
    var slidesHTML = (isP ? p.slides : p.yt).map(function (s, j) {
      var inner = isP
        ? '<img src="assets/' + s.src + '.webp" alt="' + esc(loc(s.alt)) + '" width="' + (ar[0] > 100 ? 842 : 1200) + '" height="' + (ar[0] > 100 ? 1191 : 1200) + '" decoding="async"' + (j ? ' loading="lazy"' : "") + ">"
        : '<div class="pl" data-id="' + s + '"><img src="assets/yt-' + s + '.webp" alt="" width="960" height="540" decoding="async"><button class="card__play" type="button" aria-label="' + esc(T("p.play") + " " + (j + 1)) + '">' + PLAY + "</button></div>";
      return '<li class="car__slide" role="group" aria-roledescription="slide" aria-label="' + (j + 1) + " " + T("p.of") + " " + n + '">' + inner + "</li>";
    }).join("");
    var thumbs = isP ? '<div class="car__thumbs">' + p.slides.map(function (s, j) {
      return '<button type="button" aria-label="' + esc(T("p.var1") + " " + (j + 1)) + '"><img src="assets/' + s.src + '-s.webp" alt="" width="88" height="88" loading="lazy"></button>';
    }).join("") + "</div>" : '<div class="car__thumbs"></div>';
    return '<div class="car" role="group" aria-roledescription="carousel" aria-label="' + esc(T("p.var")) + '" tabindex="0" style="--ar:' + ar[0] + "/" + ar[1] + ";--arn:" + arn + '">' +
      '<div class="car__view"><ul class="car__track">' + slidesHTML + "</ul></div>" +
      '<div class="car__ctl"><button class="ibtn" type="button" data-car="prev" aria-label="' + esc(T("p.prevv")) + '">' + ARROW + '<path d="M15 5l-7 7 7 7"/></svg></button>' +
      thumbs + '<span class="label car__count" aria-live="polite"></span>' +
      '<button class="ibtn" type="button" data-car="next" aria-label="' + esc(T("p.nextv")) + '">' + ARROW + '<path d="M9 5l7 7-7 7"/></svg></button></div>' +
      (isP ? "" : '<div class="car__ext"><a class="yl" href="#" target="_blank" rel="noopener">' + esc(T("p.watch")) + ' ↗<span class="sr"> (' + esc(T("p.new")) + ")</span></a></div>") +
      "</div>";
  }

  function buildSheet(r, startIdx) {
    var isP = r.k === "p", list = isP ? S.projects : S.videos, p = list[r.i], order = isP ? GRAPHICS : MOTION;
    var pos = order.indexOf(r.i), total = order.length;
    var prevI = order[(pos + total - 1) % total], nextI = order[(pos + 1) % total];
    var sec = T(isP ? "nav.work" : "nav.video");
    var ig = p.ig ? '<p><a class="link" href="' + p.ig + '" target="_blank" rel="noopener">' + esc(T("p.ig")) + ' ↗<span class="sr"> (' + esc(T("p.new")) + ")</span></a></p>" : "";
    scroller.innerHTML =
      '<div class="sheet__bar"><button class="pill glass" type="button" data-close aria-label="' + esc(T("p.back") + " " + sec) + '">' + ARROW + '<path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>' + esc(sec) + "</span></button>" +
      "</div>" +
      '<article class="proj"><h2 class="proj__title" id="sheet-title">' + esc(p.title) + "</h2>" +
      '<dl class="proj__info label">' +
      "<div><dt>" + T("p.no") + "</dt><dd>" + pad(r.i + 1) + "</dd></div>" +
      "<div><dt>" + T("p.year") + "</dt><dd>" + p.year + "</dd></div>" +
      "<div><dt>" + T("p.cat") + "</dt><dd>" + esc(loc(p.cat)) + "</dd></div>" +
      "<div><dt>" + T(isP ? "p.role" : "p.format") + "</dt><dd>" + T(isP ? "p.role.v" : "p.video") + "</dd></div></dl>" +
      carouselHTML(r.k, p) +
      '<div class="proj__body"><h3 class="label">' + T("p.desc") + '</h3><div class="proj__desc">' + loc(p.desc).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + ig + "</div></div>" +
      '<div class="proj__body"><h3 class="label">' + T("p.credits") + '</h3><div><dl class="credits"><dt>' + T("p.design") + "</dt><dd>" + esc(p.title) + "</dd><dt>" + T("p.tools") + "</dt><dd>" + esc(p.tools) + "</dd></dl></div></div>" +
      (total > 1 ? '<nav class="proj__nav" aria-label="' + esc(sec) + '"><a href="#' + r.k + prevI + '" data-step><span class="label">' + T("p.prev") + "</span><b>" + esc(list[prevI].title) + '</b></a><a href="#' + r.k + nextI + '" data-step><span class="label">' + T("p.next") + "</span><b>" + esc(list[nextI].title) + "</b></a></nav>" : "") +
      "</article>";
    if (st.car) st.car.destroy();
    var root = $(".car", scroller), yl = $(".yl", scroller);
    st.car = Carousel(root, {
      start: startIdx || 0,
      onChange: function (j) { if (yl) yl.href = "https://www.youtube.com/watch?v=" + p.yt[j]; }
    });
  }

  function setBackground(on) {
    main.inert = on; bar.inert = on;
    document.documentElement.classList.toggle("sheet-open", on);
  }
  function nameEl(el, name) { if (el) el.style.viewTransitionName = name || ""; }

  function openSheet(r, instant) {
    var first = !st.open, startIdx = 0;
    if (!first && st.open.k === r.k && st.open.i === r.i && st.car) startIdx = st.car.index();   /* language switch keeps the variation */
    var card = $('.card[data-open="' + r.k + r.i + '"]');
    var show = function () {
      if (first) { st.y = scrollY; sheet.hidden = false; setBackground(true); }
      st.open = r; buildSheet(r, startIdx); scroller.scrollTop = 0;
      applyI18n(scroller);
      scroller.focus({ preventScroll: true });
    };
    if (canVT && !reduce.matches && !instant) {
      var morph = first && card;
      if (morph) nameEl($(".card__media", card), "cover");
      var t = document.startViewTransition(function () {
        if (morph) nameEl($(".card__media", card), "");
        show();
        if (morph) nameEl($(".car__view", scroller), "cover");
      });
      t.finished.then(function () { nameEl($(".car__view", scroller), ""); }, function () {});
    } else {
      show();
      if (first && !instant && !reduce.matches) { sheet.classList.add("enter"); setTimeout(function () { sheet.classList.remove("enter"); }, 500); }
    }
  }

  function closeSheet(instant) {
    if (!st.open) return;
    var key = st.open.k + st.open.i, card = $('.card[data-open="' + key + '"]');
    var done = function () {
      sheet.hidden = true; setBackground(false); st.open = null;
      if (st.car) { st.car.destroy(); st.car = null; }
      scroller.innerHTML = "";
      scrollTo({ top: st.y, behavior: "instant" });
      if (card) {
        var r = card.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) card.scrollIntoView({ block: "center", behavior: "instant" });
        card.focus({ preventScroll: true });     /* back where the user came from */
      }
    };
    if (canVT && !reduce.matches && !instant) {
      var view = $(".car__view", scroller);
      nameEl(view, "cover");
      var t = document.startViewTransition(function () {
        nameEl(view, ""); done();
        if (card) nameEl($(".card__media", card), "cover");
      });
      t.finished.then(function () { if (card) nameEl($(".card__media", card), ""); }, function () {});
    } else {
      sheet.classList.add("leave");
      var end = function () { sheet.classList.remove("leave"); done(); };
      if (reduce.matches || instant) end(); else setTimeout(end, 230);
    }
    st.inApp = false;
  }

  function route(initial) {
    var r = parseHash();
    if (r) openSheet(r, initial);
    else if (st.open) closeSheet(false);
  }

  /* ------------------------------------------------------------- events */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-open]");
    if (a) { st.opener = a; st.inApp = true; return; }                               /* default hash navigation does the rest */
    var step = e.target.closest("a[data-step]");
    if (step) { e.preventDefault(); location.replace(step.getAttribute("href")); return; }   /* project ↔ project: no history pile-up */
    if (e.target.closest("[data-close]")) {
      if (st.inApp) history.back();
      else location.hash = st.open && st.open.k === "v" ? "#video" : "#work";
      return;
    }
    var lb = e.target.closest("[data-lang]");
    if (lb) { setLang(lb.dataset.lang); return; }
    var pb = e.target.closest(".pl .card__play");
    if (pb) {
      var box = pb.parentNode;
      box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + box.dataset.id + '?autoplay=1&rel=0&playsinline=1" title="' + esc(S.videos[st.open.i].title) + '" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
      $("iframe", box).focus();
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && st.open) { e.preventDefault(); $("[data-close]", sheet).click(); } });
  addEventListener("hashchange", function () { route(false); });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function setLang(l) {
    LANG = l; try { localStorage.setItem("lang", l); } catch (e) {}
    document.documentElement.lang = l;
    $$("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === l)); });
    applyI18n();
    renderGrids(true);
    if (st.open) { var r = st.open; buildSheet(r, st.car ? st.car.index() : 0); applyI18n(scroller); }
    requestAnimationFrame(function () { placePill(); fitHero(); });
  }

  /* copy email: feedback in the interface, not an alert */
  var copyBtn = $("#copy"), copyStatus = $("#copy-status"), copyTimer;
  copyBtn.addEventListener("click", function () {
    var label = $("span", copyBtn);
    function ok() {
      copyBtn.dataset.done = "true"; label.textContent = T("contact.done"); copyStatus.textContent = T("contact.copied");
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { delete copyBtn.dataset.done; label.textContent = T("contact.copy"); copyStatus.textContent = ""; }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(S.email).then(ok, function () { location.href = "mailto:" + S.email; });
    else { var ta = document.createElement("textarea"); ta.value = S.email; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { location.href = "mailto:" + S.email; } ta.remove(); }
  });

  /* ------------------------------------------------------------------ boot */
  STR.en["contact.done"] = "Copied"; STR.fr["contact.done"] = "Copié";
  document.documentElement.lang = LANG;
  $$("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === LANG)); });
  renderAcc(); applyI18n(); renderGrids(false);
  spy();
  addEventListener("resize", function () { placePill(); fitHero(); });

  var mark = $(".hero__mark");
  function start() {
    fitHero(); placePill();
    if (parseHash()) route(true);
    requestAnimationFrame(function () { requestAnimationFrame(function () { mark.classList.remove("pre"); }); });
  }
  if (reduce.matches) mark.classList.remove("pre");
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  fitHero();
})();
