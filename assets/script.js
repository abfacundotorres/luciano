(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var STORAGE_KEY = "ltmc-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var isDark;
      if (current) {
        isDark = current === "dark";
      } else if (document.body.classList.contains("is-portada")) {
        // La portada arranca siempre en claro, ignore la preferencia del sistema.
        isDark = false;
      } else {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {}
    });
  }

  var svg = document.querySelector(".hero-graphic-svg");
  if (svg) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var drawEls = [].slice.call(svg.querySelectorAll(".hg-line, .hg-circle--solid"));
    var canMeasure = true;

    try {
      if (reduceMotion) {
        throw 0; // salta al bloque que solo marca hg-ready, sin medir nada
      }
      drawEls.forEach(function (el) {
        var length = el.getTotalLength();
        el.style.strokeDasharray = length;
        el.style.strokeDashoffset = length;
      });
    } catch (e) {
      canMeasure = false;
    }

    if (!canMeasure || reduceMotion) {
      svg.classList.add("hg-ready");
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          drawEls.forEach(function (el) {
            el.style.strokeDashoffset = "0";
          });
          svg.classList.add("hg-ready");
        });
      });
    }
  }

  var menuBtn = document.querySelector(".menu-btn");
  var mobileNav = document.getElementById("mobile-nav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
