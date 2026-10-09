(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const veil = document.getElementById("veil");
  const pieces = Array.from(document.querySelectorAll(".piece"));
  const heroMedia = document.getElementById("hero-media");
  const hero = document.getElementById("hero");
  const river = document.getElementById("river");
  const riverTrack = document.getElementById("river-track");
  const wall = document.getElementById("wall");
  const sheet = document.getElementById("sheet");
  const lb = document.getElementById("lb");
  const lbImg = document.getElementById("lb-img");
  const lbTitle = document.getElementById("lb-title");
  const lbCount = document.getElementById("lb-count");
  let travelLock = false;
  let trip = 0;
  let suppressClick = false;
  let lbIndex = 0;
  let lbGroup = null;
  let lbReturn = null;

  function closeMenu() {
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "关闭" : "菜单";
      if (open) placeGlider(navLinks.querySelector("[aria-current='page']"));
    });
  }

  function go(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    closeMenu();
    if (reduce || travelLock) {
      el.scrollIntoView();
      history.pushState(null, "", hash);
      return;
    }
    const my = ++trip;
    travelLock = true;
    veil.classList.remove("is-open");
    veil.classList.add("is-shut");
    let done = false;
    function finish(e) {
      if (my !== trip || done) return;
      if (e && e.animationName && e.animationName !== "shut") return;
      done = true;
      veil.removeEventListener("animationend", finish);
      el.scrollIntoView();
      history.pushState(null, "", hash);
      veil.classList.remove("is-shut");
      veil.classList.add("is-open");
      veil.addEventListener("animationend", function openEnd(ev) {
        if (ev.animationName !== "open" || my !== trip) return;
        veil.removeEventListener("animationend", openEnd);
        veil.classList.remove("is-open");
        travelLock = false;
      });
    }
    veil.addEventListener("animationend", finish);
    window.setTimeout(finish, 620);
    window.setTimeout(function () {
      if (my !== trip) return;
      veil.classList.remove("is-shut", "is-open");
      travelLock = false;
    }, 1400);
  }

  document.querySelectorAll("[data-travel]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const hash = link.getAttribute("href");
      if (!hash || hash.charAt(0) !== "#") return;
      e.preventDefault();
      go(hash);
    });
  });

  window.addEventListener("popstate", function () {
    const el = document.querySelector(location.hash || "#top");
    if (el) el.scrollIntoView();
  });

  const navLinks = document.getElementById("nav-links");
  const glider = document.getElementById("nav-glider");
  const navItems = navLinks ? Array.from(navLinks.querySelectorAll("a")) : [];

  function placeGlider(el) {
    if (!glider) return;
    if (!el) {
      glider.classList.remove("is-on");
      return;
    }
    glider.classList.add("is-on");
    glider.style.width = el.offsetWidth + "px";
    glider.style.height = el.offsetHeight + "px";
    glider.style.transform = "translate3d(" + el.offsetLeft + "px," + el.offsetTop + "px,0)";
  }

  if (navLinks) {
    navLinks.addEventListener("pointerover", function (e) {
      const link = e.target.closest("a");
      if (link && navLinks.contains(link)) placeGlider(link);
    });
    navLinks.addEventListener("pointerleave", function () {
      placeGlider(navLinks.querySelector("[aria-current='page']"));
    });
    navItems.forEach(function (link) {
      link.addEventListener("click", function () { placeGlider(link); });
    });
    window.addEventListener("resize", function () {
      placeGlider(navLinks.querySelector("[aria-current='page']"));
    });
  }

  const travelLinks = Array.from(document.querySelectorAll("nav [data-travel]"));
  if ("IntersectionObserver" in window) {
    const watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        travelLinks.forEach(function (link) {
          const on = link.getAttribute("href") === "#" + entry.target.id;
          if (on) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
        const current = document.querySelector("#nav-links [aria-current='page']");
        if (current && !navLinks.matches(":hover")) placeGlider(current);
      });
    }, { rootMargin: "-45% 0px -48% 0px", threshold: 0.01 });
    travelLinks.forEach(function (link) {
      const section = document.querySelector(link.getAttribute("href"));
      if (section) watch.observe(section);
    });
  }

  let scrollQueued = false;
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      scrollQueued = false;
      const y = window.scrollY;
      nav.classList.toggle("is-solid", y > 20);
      if (!reduce && heroMedia && y < window.innerHeight * 1.2) {
        heroMedia.style.transform = "translate3d(0," + Math.round(y * 0.22) + "px,0)";
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  startRain();
  startLiquid();
  startRiver();
  startWall();
  startSheet();

  pieces.forEach(function (el) {
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "放大" + el.querySelector("img").alt);
    el.addEventListener("click", function () {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      openEl(el);
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEl(el);
      }
    });
  });

  function startRain() {
    const canvas = document.getElementById("rain");
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const glyphs = "01{}[]()<>=/+-*;_$#&|~^%ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let drops = [];
    function size() {
      canvas.width = hero.clientWidth;
      canvas.height = hero.clientHeight;
      const cols = Math.ceil(canvas.width / 18);
      const rows = Math.ceil(canvas.height / 18);
      drops = Array.from({ length: cols }, function () { return Math.random() * rows; });
    }
    function tick() {
      ctx.fillStyle = "rgba(0,0,0,.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "15px ui-monospace, monospace";
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += 1;
      }
    }
    size();
    window.addEventListener("resize", size);
    setInterval(tick, 70);
  }

  function startTerm() {
    const stage = document.getElementById("term-stage");
    const canvas = document.getElementById("term-field");
    const photo = document.getElementById("term-photo");
    const xEl = document.getElementById("term-x");
    const yEl = document.getElementById("term-y");
    if (!stage || !canvas || !photo) return;
    const ctx = canvas.getContext("2d");
    const sparks = [];
    function size() {
      canvas.width = stage.clientWidth;
      canvas.height = stage.clientHeight;
    }
    function pad(n) { return String(Math.max(0, Math.round(n))).padStart(4, "0"); }
    function aim(clientX, clientY) {
      const rect = stage.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      stage.style.setProperty("--px", x + "px");
      stage.style.setProperty("--py", y + "px");
      if (xEl) xEl.textContent = "X " + pad(x);
      if (yEl) yEl.textContent = "Y " + pad(y);
      sparks.push({ x: x, y: y, life: 1 });
      if (sparks.length > 28) sparks.shift();
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(57,255,115,.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.life -= 0.02;
        if (spark.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = "rgba(185,255,201," + spark.life.toFixed(2) + ")";
        ctx.fillRect(spark.x - 1, spark.y - 1, 3, 3);
      }
      if (!reduce) requestAnimationFrame(draw);
    }
    size();
    window.addEventListener("resize", size);
    stage.addEventListener("pointermove", function (e) { aim(e.clientX, e.clientY); });
    stage.addEventListener("pointerleave", function () {
      if (xEl) xEl.textContent = "X ----";
      if (yEl) yEl.textContent = "Y ----";
    });
    document.querySelectorAll(".term-channels button").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll(".term-channels button").forEach(function (item) {
          item.classList.toggle("is-on", item === button);
        });
        photo.src = button.getAttribute("data-src");
        photo.alt = button.getAttribute("data-alt") || "";
        const figure = photo.parentElement;
        figure.classList.remove("is-swap");
        void figure.offsetWidth;
        figure.classList.add("is-swap");
      });
    });
    if (!reduce) requestAnimationFrame(draw);
  }

  function startLiquid() {
    document.querySelectorAll(".is-liquid").forEach(function (piece) {
      const canvas = piece.querySelector("canvas.liquid");
      const source = piece.querySelector("img");
      if (!canvas || !source || reduce) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      const buffer = document.createElement("canvas");
      const bctx = buffer.getContext("2d", { alpha: false });
      if (!ctx || !bctx) return;
      let playing = false;
      let pad = 0;
      function bake() {
        const w = source.clientWidth;
        const h = source.clientHeight;
        if (w < 2 || h < 2) return;
        canvas.style.left = source.offsetLeft + "px";
        canvas.style.top = source.offsetTop + "px";
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        pad = Math.round(canvas.width * 0.08);
        buffer.width = canvas.width + pad * 2;
        buffer.height = canvas.height;
        const iw = source.naturalWidth || canvas.width;
        const ih = source.naturalHeight || canvas.height;
        const scale = Math.max(buffer.width / iw, buffer.height / ih);
        bctx.drawImage(source, (buffer.width - iw * scale) / 2, (buffer.height - ih * scale) / 2, iw * scale, ih * scale);
        piece.classList.add("is-flowing");
      }
      function frame(now) {
        if (!playing || !buffer.width) return;
        const w = canvas.width;
        const h = canvas.height;
        const t = now * 0.001;
        const band = 3;
        const drift = Math.sin(t * 0.28) * w * 0.012;
        for (let y = 0; y < h; y += band) {
          const wave = Math.sin(y * 0.02 + t * 0.7) * w * 0.02 + Math.sin(y * 0.008 - t * 0.3) * w * 0.016;
          const srcY = Math.max(0, Math.min(h - band - 1, y + Math.sin(y * 0.03 + t * 0.5) * 6));
          const srcX = Math.max(0, Math.min(buffer.width - w, pad + drift + wave));
          ctx.drawImage(buffer, srcX, srcY, w, band, 0, y, w, band + 1);
        }
        requestAnimationFrame(frame);
      }
      function boot() {
        bake();
        playing = true;
        requestAnimationFrame(frame);
      }
      if (source.complete && source.naturalWidth) boot();
      else source.addEventListener("load", boot, { once: true });
      window.addEventListener("resize", bake);
    });
  }

  function startBook() {
    const grid = document.getElementById("syn-grid");
    const replay = document.getElementById("syn-replay");
    const charts = window.SYN_CHARTS;
    if (!grid || !charts) return;
    const html = [
      '<article class="syn-ink-card" style="--card-index:0"><div class="syn-ink-card-top"><span class="syn-ink-number">01</span><span>FOUR PILLARS</span></div><div class="syn-ink-card-body"><div class="syn-ink-copy"><span class="syn-ink-method">八字</span><h3>四柱成局</h3><p>以日主为轴，观四柱干支与五行流转。</p><small>日主戊 · 土</small></div><div class="syn-ink-visual"><div class="syn-mini-bazi"><div class="syn-mini-pillar" style="--pillar-index:0"><small>年柱</small><b>庚</b><b>辰</b></div><div class="syn-mini-pillar" style="--pillar-index:1"><small>月柱</small><b>庚</b><b>辰</b></div><div class="syn-mini-pillar is-day" style="--pillar-index:2"><small>日柱</small><b>戊</b><b>午</b></div><div class="syn-mini-pillar" style="--pillar-index:3"><small>时柱</small><b>丁</b><b>巳</b></div></div></div></div></article>',
      '<article class="syn-ink-card" style="--card-index:1"><div class="syn-ink-card-top"><span class="syn-ink-number">02</span><span>ZI WEI · 12 PALACES</span></div><div class="syn-ink-card-body"><div class="syn-ink-copy"><span class="syn-ink-method">紫微</span><h3>星曜布十二宫</h3><p>以命宫为枢，星曜落宫，四化牵引。</p><small>命宫 · 身宫</small></div><div class="syn-ink-visual"><div class="syn-mini-ziwei">' + charts.grid + '</div></div></div></article>',
      '<article class="syn-ink-card" style="--card-index:2"><div class="syn-ink-card-top"><span class="syn-ink-number">03</span><span>WESTERN ASTROLOGY</span></div><div class="syn-ink-card-body"><div class="syn-ink-copy"><span class="syn-ink-method">西占</span><h3>行星映射星盘</h3><p>沿黄道宫位，观察行星与相位关系。</p><small>日 ' + charts.sun + ' · 月 ' + charts.moon + ' · 上升 ' + charts.asc + '</small></div><div class="syn-ink-visual"><div class="syn-mini-western">' + charts.wheel + '</div></div></div></article>',
      '<article class="syn-ink-card" style="--card-index:3"><div class="syn-ink-card-top"><span class="syn-ink-number">04</span><span>VEDIC · D1 / DASHA</span></div><div class="syn-ink-card-body"><div class="syn-ink-copy"><span class="syn-ink-method">吠陀</span><h3>D1 与主限节律</h3><p>由 Lagna 定位本命格局，循主限推移。</p><small>Lagna ' + charts.lagna + ' · ' + charts.nak + '</small></div><div class="syn-ink-visual"><div class="syn-mini-jyotish"><span class="syn-mini-d1-label">D1 · RASI</span>' + charts.rasi + '</div></div></div></article>'
    ].join("");
    function play() {
      grid.innerHTML = "";
      void grid.offsetWidth;
      grid.innerHTML = html;
    }
    play();
    if (replay) replay.addEventListener("click", play);
  }

  function startOraFlip() {
    document.querySelectorAll(".ora-card").forEach(function (card) {
      const holo = card.querySelector(".holo-card");
      card.addEventListener("click", function () {
        const open = card.classList.toggle("is-open");
        card.setAttribute("aria-pressed", open ? "true" : "false");
      });
      card.addEventListener("pointermove", function (e) {
        if (!card.classList.contains("is-open") || !holo) return;
        const rect = holo.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const dx = px - 0.5;
        const dy = py - 0.5;
        holo.style.setProperty("--pointer-x", (px * 100).toFixed(2) + "%");
        holo.style.setProperty("--pointer-y", (py * 100).toFixed(2) + "%");
        holo.style.setProperty("--background-x", (px * 100).toFixed(2) + "%");
        holo.style.setProperty("--background-y", (py * 100).toFixed(2) + "%");
        holo.style.setProperty("--rotate-x", (dx * 18).toFixed(2) + "deg");
        holo.style.setProperty("--rotate-y", (dy * -14).toFixed(2) + "deg");
        holo.style.setProperty("--card-opacity", "1");
        holo.style.setProperty("--pointer-from-center", Math.min(1, Math.hypot(dx, dy) * 2).toFixed(3));
        holo.classList.add("holo-card--interacting");
      });
      card.addEventListener("pointerleave", function () {
        if (holo) holo.classList.remove("holo-card--interacting");
      });
    });
  }

  function startMuyu() {
    const stage = document.getElementById("btn-muyu");
    if (!stage) return;
    const floats = ["功德+1", "随喜赞叹", "福慧双增", "善念升起", "身心清凉", "吉祥如意"];
    let session = 0;
    const goal = 21;
    let audioCtx = null;
    function ding() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(580, now);
        filter.Q.setValueAtTime(4.2, now);
        osc.type = "sine";
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.85, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.15);
      } catch (err) {}
    }
    function hit() {
      stage.classList.remove("is-hit");
      void stage.offsetWidth;
      stage.classList.add("is-hit");
      window.setTimeout(function () { stage.classList.remove("is-hit"); }, 560);
      setTimeout(ding, reduce ? 0 : 150);
      session += 1;
      document.getElementById("count-session").innerHTML = session + "<em>遍</em>";
      const pct = Math.min(100, Math.round(session / goal * 100));
      document.getElementById("goal-pct").textContent = pct + "%";
      document.getElementById("goal-fill").style.width = pct + "%";
      const node = document.createElement("div");
      node.className = "float-txt";
      node.textContent = floats[Math.floor(Math.random() * floats.length)];
      node.style.left = (50 + (Math.random() - 0.5) * 40) + "%";
      document.getElementById("float-mount").appendChild(node);
      setTimeout(function () { node.remove(); }, 1100);
    }
    stage.addEventListener("click", hit);
    stage.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(); }
    });
  }

  function startHeroFlow() {
    const canvas = document.getElementById("hero-flow");
    const source = document.getElementById("hero-source");
    if (!canvas || !source || !hero || reduce) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d", { alpha: false });
    if (!ctx || !bctx) return;
    let raf = 0;
    let playing = true;
    let pad = 0;

    function bake() {
      const w = Math.max(1, heroMedia.clientWidth);
      const h = Math.max(1, heroMedia.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const bw = canvas.width;
      const bh = canvas.height;
      pad = Math.round(bw * 0.1);
      buffer.width = bw + pad * 2;
      buffer.height = bh;
      const iw = source.naturalWidth || 2000;
      const ih = source.naturalHeight || 1500;
      const scale = Math.max(buffer.width / iw, buffer.height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const ox = (buffer.width - dw) * 0.62;
      const oy = (buffer.height - dh) * 0.38;
      bctx.drawImage(source, ox, oy, dw, dh);
    }

    function frame(now) {
      if (!playing || !buffer.width) return;
      const w = canvas.width;
      const h = canvas.height;
      const t = now * 0.001;
      const band = 4;
      const drift = Math.sin(t * 0.28) * w * 0.012;
      for (let y = 0; y < h; y += band) {
        const wave = Math.sin(y * 0.007 + t * 0.62) * w * 0.014
          + Math.sin(y * 0.0032 - t * 0.27) * w * 0.02;
        const srcY = Math.max(0, Math.min(h - band - 1, y + Math.sin(y * 0.012 + t * 0.5) * 7));
        const srcX = Math.max(0, Math.min(buffer.width - w, pad + drift + wave));
        ctx.drawImage(buffer, srcX, srcY, w, band, 0, y, w, band + 1);
      }
      raf = requestAnimationFrame(frame);
    }

    function boot() {
      bake();
      playing = !document.hidden;
      if (playing) frame(performance.now());
      hero.classList.add("is-flow");
    }

    if (source.complete && source.naturalWidth) boot();
    else source.addEventListener("load", boot, { once: true });

    window.addEventListener("resize", function () {
      if (source.naturalWidth) bake();
    });
    document.addEventListener("visibilitychange", function () {
      playing = !document.hidden;
      if (playing) raf = requestAnimationFrame(frame);
    });
    if ("IntersectionObserver" in window) {
      const watch = new IntersectionObserver(function (entries) {
        playing = entries[0].isIntersecting && !document.hidden;
        if (playing) raf = requestAnimationFrame(frame);
      });
      watch.observe(hero);
    }
  }

  function startRiver() {
    if (!river || !riverTrack) return;
    const cards = Array.from(riverTrack.children);
    let grab = 0;
    let pointer = null;
    let raf = 0;
    let playing = true;

    const narrow = window.matchMedia("(max-width: 899px)");
    function tick(now) {
      if (!playing) return;
      const flow = reduce || narrow.matches ? 0 : Math.sin(now * 0.00045) * 48;
      riverTrack.style.transform = "translateX(" + (flow + grab) + "px)";
      if (!reduce) {
        cards.forEach(function (card, i) {
          const bob = Math.sin(now * 0.0011 + i * 1.2) * 8;
          card.style.translate = "0 " + bob.toFixed(2) + "px";
        });
      }
      raf = requestAnimationFrame(tick);
    }

    river.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;
      pointer = { id: e.pointerId, x: e.clientX, grab: grab, moved: false };
    });
    river.addEventListener("pointermove", function (e) {
      if (!pointer || e.pointerId !== pointer.id) return;
      const dx = e.clientX - pointer.x;
      if (!pointer.moved && Math.abs(dx) > 6) {
        pointer.moved = true;
        river.classList.add("is-grabbing");
        river.setPointerCapture(e.pointerId);
      }
      if (!pointer.moved) return;
      grab = pointer.grab + dx;
    });
    function endPointer(e) {
      if (!pointer || e.pointerId !== pointer.id) return;
      if (pointer.moved) {
        suppressClick = true;
        window.setTimeout(function () { suppressClick = false; }, 40);
      }
      pointer = null;
      river.classList.remove("is-grabbing");
    }
    river.addEventListener("pointerup", endPointer);
    river.addEventListener("pointercancel", endPointer);

    if (!reduce) {
      raf = requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", function () {
        playing = !document.hidden;
        if (playing) raf = requestAnimationFrame(tick);
      });
    }
  }

  function startWall() {
    if (!wall || reduce) return;
    const cards = Array.from(wall.querySelectorAll(".piece"));
    wall.addEventListener("pointermove", function (e) {
      cards.forEach(function (card) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const influence = Math.max(0, 1 - dist / 520);
        const ry = Math.max(-14, Math.min(14, dx * 18 * influence));
        const rx = Math.max(-10, Math.min(10, -dy * 12 * influence));
        card.style.transform = "rotateY(" + ry.toFixed(2) + "deg) rotateX(" + rx.toFixed(2) + "deg)";
      });
    });
    wall.addEventListener("pointerleave", function () {
      cards.forEach(function (card) { card.style.transform = ""; });
    });
  }

  function startSheet() {
    if (!sheet) return;
    const cards = Array.from(sheet.querySelectorAll(".piece"));
    let drag = null;
    cards.forEach(function (el) {
      el.addEventListener("pointerdown", function (e) {
        if (e.button > 0 || e.pointerType === "touch") return;
        el.setPointerCapture(e.pointerId);
        drag = {
          el: el,
          id: e.pointerId,
          sx: e.clientX,
          sy: e.clientY,
          ox: e.clientX,
          oy: e.clientY,
          x: parseFloat(el.dataset.tx || "0"),
          y: parseFloat(el.dataset.ty || "0"),
          moved: false
        };
        el.classList.add("is-lifted");
      });
      el.addEventListener("pointermove", function (e) {
        if (!drag || drag.el !== el || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.sx;
        const dy = e.clientY - drag.sy;
        if (Math.hypot(e.clientX - drag.ox, e.clientY - drag.oy) > 7) drag.moved = true;
        const x = drag.x + dx;
        const y = drag.y + dy;
        el.dataset.tx = String(x);
        el.dataset.ty = String(y);
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate(-2.5deg) scale(1.04)";
      });
      function endDrag(e) {
        if (!drag || drag.el !== el || e.pointerId !== drag.id) return;
        const moved = drag.moved;
        drag = null;
        el.classList.remove("is-lifted");
        if (!moved) return;
        suppressClick = true;
        const placed = el.style.transform.replace(" scale(1.04)", "").replace(" rotate(-2.5deg)", "");
        el.style.transform = placed;
      }
      el.addEventListener("pointerup", endDrag);
      el.addEventListener("pointercancel", endDrag);
    });
    const restick = document.getElementById("restick");
    if (restick) {
      restick.addEventListener("click", function () {
        cards.forEach(function (el) {
          el.dataset.tx = "0";
          el.dataset.ty = "0";
          el.style.transform = "";
          el.classList.remove("is-lifted");
        });
      });
    }
  }

  function sequence() {
    if (!lbGroup) return pieces;
    return Array.from(lbGroup.querySelectorAll(".piece"));
  }

  function openAt(index) {
    const seq = sequence();
    lbIndex = (index + seq.length) % seq.length;
    const el = seq[lbIndex];
    const img = el.querySelector("img");
    const wasHidden = lb.hidden;
    lbImg.src = el.dataset.full;
    lbImg.alt = img.alt;
    lbTitle.textContent = img.alt;
    lbCount.textContent = (lbIndex + 1) + " / " + seq.length;
    lbReturn = el;
    lb.hidden = false;
    document.documentElement.classList.add("lb-open");
    if (wasHidden) document.getElementById("lb-close").focus();
  }

  function openEl(el) {
    lbGroup = el.closest("[data-group]");
    openAt(sequence().indexOf(el));
  }

  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.documentElement.classList.remove("lb-open");
    if (lbReturn) lbReturn.focus();
  }

  document.getElementById("lb-close").addEventListener("click", closeLb);
  document.getElementById("lb-prev").addEventListener("click", function () { openAt(lbIndex - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { openAt(lbIndex + 1); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openAt(lbIndex - 1);
    if (e.key === "ArrowRight") openAt(lbIndex + 1);
  });
})();
