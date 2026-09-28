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

  var heroAnim = document.querySelector(".hero-graphic-anim");
  var heroQuote = document.querySelector(".hg-quote-overlay");
  if (heroAnim && heroQuote) {
    var ANIM_MS = 5400;
    var revealed = false;
    var revealQuote = function () {
      if (revealed) return;
      revealed = true;
      heroQuote.classList.add("revealed");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealQuote();
    } else {
      // La animación arranca cuando la imagen está cargada; la cita
      // aparece cuando termina el dibujo.
      var startTimer = function () {
        setTimeout(revealQuote, ANIM_MS);
      };
      if (heroAnim.complete && heroAnim.naturalWidth) {
        startTimer();
      } else {
        heroAnim.addEventListener("load", startTimer);
        heroAnim.addEventListener("error", revealQuote);
      }
      setTimeout(revealQuote, ANIM_MS + 4000);
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
