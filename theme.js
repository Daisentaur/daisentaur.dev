/* ============================================================
   daisentaur.dev — theme
   Loaded as a BLOCKING script in <head> on every page, so the
   no-flash setter below runs before first paint. The toggle
   handler waits for the DOM. One copy, shared by every page.
   ============================================================ */

// No flash: set the theme before anything renders. Falls back to the
// visitor's OS preference on first visit, then remembers their choice.
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark") {
      t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();

// Toggle button (present in every header). Flip, persist, and — where
// supported — run it inside a View Transition so the CSS mask reveal plays.
addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var root = document.documentElement;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    var apply = function () {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    };
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
});
