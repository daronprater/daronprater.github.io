/* Kenwood Advanced Dentistry — site interactions (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---- Online booking & bill pay ------------------------------------
     Paste the links from the office's booking service and payment processor
     here, no rebuild needed.
     Every "Book online" / "Pay your bill" button on the site turns on as soon
     as its link is filled in. Leave a link empty ("") to keep those hidden. */
  var LINKS = {
    booking: "",  // e.g. the online scheduling link from the booking service
    payment: ""   // e.g. the secure "pay your bill" page from the payment processor
  };
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = LINKS[el.getAttribute("data-link")];
    if (!url) return;
    var a = el.tagName === "A" ? el : el.querySelector("a");
    if (a) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    el.hidden = false;
  });
  // Elements that should step aside once a link is live (e.g. "Directions" in the phone bar)
  document.querySelectorAll("[data-unless]").forEach(function (el) {
    if (LINKS[el.getAttribute("data-unless")]) el.hidden = true;
  });

  /* ---- Office hours (Eastern time). Edit here if hours change. ---------- */
  // [openHour, closeHour] in 24h time, or null when closed. Index 0 = Sunday.
  var HOURS = [null, [8, 18], [8, 16], [8, 16], [8, 18], [8, 13], null];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function fmt(h) {
    var suffix = h >= 12 ? "pm" : "am";
    var hr = h % 12 === 0 ? 12 : h % 12;
    return hr + suffix;
  }

  function easternNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
      var hour = parseInt(map.hour, 10) % 24;
      return { day: day, time: hour + parseInt(map.minute, 10) / 60 };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), time: d.getHours() + d.getMinutes() / 60 };
    }
  }

  function status() {
    var now = easternNow();
    var today = HOURS[now.day];
    if (today && now.time >= today[0] && now.time < today[1]) {
      return { open: true, text: "Open now · until " + fmt(today[1]), day: now.day };
    }
    if (today && now.time < today[0]) {
      return { open: false, text: "Opens today at " + fmt(today[0]), day: now.day };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var label = i === 1 ? "tomorrow" : DAYS[d];
        return { open: false, text: "Closed · opens " + label + " " + fmt(HOURS[d][0]), day: now.day };
      }
    }
    return { open: false, text: "Call to schedule", day: now.day };
  }

  var s = status();
  document.querySelectorAll("[data-open-status]").forEach(function (el) { el.textContent = s.text; });
  document.querySelectorAll("[data-open-dot]").forEach(function (el) { el.classList.toggle("is-open", s.open); });
  document.querySelectorAll(".hours li[data-day]").forEach(function (li) {
    var days = li.getAttribute("data-day").split(",").map(Number);
    if (days.indexOf(s.day) > -1) li.classList.add("is-today");
  });

  /* ---- Header: shadow on scroll + mobile menu --------------------------- */
  var header = document.querySelector(".site-header");
  var callBar = document.querySelector(".call-bar");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (callBar) callBar.classList.toggle("is-visible", y > 420);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      if (header) document.documentElement.style.setProperty("--nav-top", Math.max(0, header.getBoundingClientRect().bottom) + "px");
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Reveal on scroll -------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Services page: highlight current section in side nav ------------- */
  var svcLinks = document.querySelectorAll(".svc-nav a");
  if (svcLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    svcLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          svcLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var link = byId[entry.target.id];
          if (link) {
            link.classList.add("is-active");
            if (window.innerWidth <= 960) link.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
          }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".svc[id]").forEach(function (sec) { spy.observe(sec); });
  }

  /* ---- Lightbox for galleries ------------------------------------------- */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (items.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox__prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<img alt="">' +
      '<button class="lightbox__next" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<div class="lightbox__cap"></div>';
    document.body.appendChild(box);
    var img = box.querySelector("img");
    var cap = box.querySelector(".lightbox__cap");
    var idx = 0, lastFocus = null;

    function show(i) {
      idx = (i + items.length) % items.length;
      var el = items[idx];
      var src = el.querySelector("img");
      img.src = src.src; // full-size original, not the smaller srcset pick
      img.alt = src.alt;
      cap.textContent = el.getAttribute("data-caption") || src.alt;
    }
    function open(i) { lastFocus = document.activeElement; show(i); box.classList.add("is-open"); box.querySelector(".lightbox__close").focus(); }
    function close() { box.classList.remove("is-open"); if (lastFocus) lastFocus.focus(); }

    items.forEach(function (el, i) { el.addEventListener("click", function () { open(i); }); });
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(idx - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- Footer year ------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
