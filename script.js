(function () {
  "use strict";

  /* ============================================================
     CONFIG — edit these to make the invite yours by @gauravagrawal
     ============================================================ */
  var CONFIG = {
    coupleNames: "Pratibha Jha & Shreenath Alok",
    // ISO date/time the countdown counts down to
    weddingDateTime: "2026-12-08T10:00:00+05:30",
    // WhatsApp number to receive RSVPs, country code + number, no spaces or +
    whatsappNumber: "918871922851",
  };

  /* ============================================================
     ENTRY GATE by @gauravagrawal
     ============================================================ */
  var gate = document.getElementById("gate");
  var gateBtn = document.getElementById("gateBtn");
  var main = document.getElementById("main");

  function openInvitation() {
    gate.classList.add("is-hidden");
    main.hidden = false;
    document.body.style.overflow = "";
    // move focus into the page for keyboard/screen-reader users
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    startCountdown();
    initReveal();
    startAudio();
    startPetals();
  }

  if (gateBtn) {
    document.body.style.overflow = "hidden";
    gateBtn.addEventListener("click", openInvitation);
  } else {
    // no gate present, just start everything
    main.hidden = false;
    startCountdown();
    initReveal();
  }

  /* ============================================================
     BACKGROUND AUDIO by @gauravagrawal
     ============================================================ */
  var bgAudio = document.getElementById("bgAudio");
  var soundToggle = document.getElementById("soundToggle");

  function startAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.35;
    var playPromise = bgAudio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        // autoplay blocked; reflect muted state on the toggle so the user can start it manually
        if (soundToggle) soundToggle.setAttribute("aria-pressed", "false");
      });
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener("click", function () {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        bgAudio.play();
        soundToggle.setAttribute("aria-pressed", "true");
        soundToggle.setAttribute("aria-label", "Mute background music");
      } else {
        bgAudio.pause();
        soundToggle.setAttribute("aria-pressed", "false");
        soundToggle.setAttribute("aria-label", "Play background music");
      }
    });
  }

  /* ============================================================
     FALLING PETALS by @gauravagrawal
     ============================================================ */
  var petalsStarted = false;
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startPetals() {
    if (petalsStarted || prefersReducedMotion) return;
    petalsStarted = true;

    var layer = document.getElementById("petalsLayer");
    if (!layer) return;

    var colors = ["#E8A33D", "#D9A404", "#8B3A3A", "#F4C77A"];
    var maxPetals = 16;
    var active = 0;
    var svgns = "http://www.w3.org/2000/svg";

    function spawnPetal() {
      if (document.hidden || active >= maxPetals) return;

      var wrapper = document.createElement("div");
      wrapper.className = "petal";

      var size = 10 + Math.random() * 10;
      var left = Math.random() * 100;
      var fallDuration = 9 + Math.random() * 7;
      var swayDuration = 2 + Math.random() * 2;
      var color = colors[Math.floor(Math.random() * colors.length)];

      wrapper.style.left = left + "vw";
      wrapper.style.animationDuration = fallDuration + "s";

      var svg = document.createElementNS(svgns, "svg");
      svg.classList.add("petal__shape");
      svg.setAttribute("viewBox", "0 0 20 20");
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.style.animationDuration = swayDuration + "s";
      svg.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);

      var path = document.createElementNS(svgns, "path");
      path.setAttribute("d", "M10 1c5 3 8 8 8 12a8 8 0 0 1-16 0c0-4 3-9 8-12Z");
      path.setAttribute("fill", color);
      svg.appendChild(path);
      wrapper.appendChild(svg);

      wrapper.addEventListener("animationend", function (e) {
        if (e.target === wrapper) {
          wrapper.remove();
          active--;
        }
      });

      layer.appendChild(wrapper);
      active++;
    }

    setInterval(spawnPetal, 650);
  }

  /* ============================================================
     COUNTDOWN by @gauravagrawal
     ============================================================ */
  var countdownStarted = false;
  function startCountdown() {
    if (countdownStarted) return;
    countdownStarted = true;

    var target = new Date(CONFIG.weddingDateTime).getTime();
    var daysEl = document.getElementById("cd-days");
    var hoursEl = document.getElementById("cd-hours");
    var minsEl = document.getElementById("cd-mins");
    var secsEl = document.getElementById("cd-secs");

    if (!daysEl || isNaN(target)) return;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      var now = Date.now();
      var diff = target - now;

      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        clearInterval(timer);
        return;
      }

      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minsEl.textContent = pad(mins);
      secsEl.textContent = pad(secs);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ============================================================
     SCROLL REVEAL by @gauravagrawal
     ============================================================ */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".story__item, .event, .gallery__tile, .venue__map, .venue__info > div, .rsvp__form"
    );
    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     DECORATIVE PETALS (gate + footer marigold flourish) by @gauravagrawal
     ============================================================ */
  function drawPetals(groupId, petalCount, radius) {
    var group = document.getElementById(groupId);
    if (!group) return;
    var cx = 50, cy = 50;
    var svgns = "http://www.w3.org/2000/svg";
    for (var i = 0; i < petalCount; i++) {
      var angle = (i / petalCount) * Math.PI * 2;
      var x1 = cx + Math.cos(angle) * 8;
      var y1 = cy + Math.sin(angle) * 8;
      var x2 = cx + Math.cos(angle) * radius;
      var y2 = cy + Math.sin(angle) * radius;
      var path = document.createElementNS(svgns, "path");
      var midAngle = angle + 0.18;
      var mx = cx + Math.cos(midAngle) * (radius * 0.6);
      var my = cy + Math.sin(midAngle) * (radius * 0.6);
      path.setAttribute(
        "d",
        "M" + x1 + "," + y1 + " Q" + mx + "," + my + " " + x2 + "," + y2
      );
      group.appendChild(path);
    }
  }
  drawPetals("petals", 8, 34);
  drawPetals("footerPetals", 8, 26);

  /* ============================================================
     RSVP → WHATSAPP by @gauravagrawal
     ============================================================ */
  var rsvpForm = document.getElementById("rsvpForm");
  var rsvpStatus = document.getElementById("rsvpStatus");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = rsvpForm.elements["name"].value.trim();
      if (!name) {
        rsvpStatus.textContent = "Please enter your name so we know who's coming.";
        rsvpStatus.classList.add("is-error");
        rsvpForm.elements["name"].focus();
        return;
      }
      rsvpStatus.classList.remove("is-error");

      var attending = rsvpForm.elements["attending"].value;
      var guests = rsvpForm.elements["guests"].value || "1";
      var message = rsvpForm.elements["message"].value.trim();

      var eventBoxes = rsvpForm.querySelectorAll('input[name="events"]:checked');
      var events = Array.prototype.map.call(eventBoxes, function (cb) {
        return cb.value;
      });

      var lines = [
        "RSVP for " + CONFIG.coupleNames + "'s wedding",
        "Name: " + name,
        "Attending: " + attending,
        "Guests: " + guests,
        "Events: " + (events.length ? events.join(", ") : "None selected"),
      ];
      if (message) lines.push("Note: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + text;

      rsvpStatus.textContent = "Opening WhatsApp to send your RSVP…";
      window.open(url, "_blank", "noopener");
    });
  }
})();
