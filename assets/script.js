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
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var isDark = current ? current === "dark" : prefersDark;
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {}
    });
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
