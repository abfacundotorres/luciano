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

  var heroVideo = document.querySelector(".hero-graphic-video");
  var heroQuote = document.querySelector(".hg-quote-overlay");
  if (heroVideo && heroQuote) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealQuote = function () {
      heroQuote.classList.add("revealed");
    };

    if (reduceMotion) {
      heroVideo.removeAttribute("autoplay");
      revealQuote();
    } else {
      heroVideo.addEventListener("ended", revealQuote);
      heroVideo.addEventListener("error", revealQuote);
      // Si el navegador bloqueó el autoplay, el video se queda en el
      // poster (que ya es el estado final del dibujo) y mostramos la
      // cita igual, sin esperar a un "ended" que nunca va a llegar.
      setTimeout(function () {
        if (heroVideo.paused) revealQuote();
      }, 600);
      // Red de seguridad por si algo impide que "ended" se dispare.
      setTimeout(revealQuote, 8000);
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
