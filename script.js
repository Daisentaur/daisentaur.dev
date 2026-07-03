/* ============================================================
   daisentaur.dev — repo loader
   Pulls public repos from the GitHub API and renders them.
   No build step, no dependencies, no API key (public data only).
   ============================================================ */

// EDIT: if you change your GitHub username, change it here.
const GH_USER = "Daisentaur";

// Repos you never want to show (e.g. the site repo itself, forks of others).
// EDIT: add repo names here to hide them.
const HIDE = new Set([
  "Daisentaur",          // the profile README repo
  "daisentaur.github.io" // this site's repo, if named this way
]);

// How many to show before the "see everything" link.
const MAX_SHOWN = 6;

const statusEl = document.getElementById("repo-status");
const gridEl = document.getElementById("repos");

// Set the footer year.
document.getElementById("year").textContent = new Date().getFullYear();

async function loadRepos() {
  try {
    // sort=pushed → most recently active first. per_page caps the response.
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/repos?sort=pushed&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    const repos = await res.json();

    const shown = repos
      .filter((r) => !r.fork && !r.archived && !HIDE.has(r.name))
      .slice(0, MAX_SHOWN);

    if (shown.length === 0) {
      statusEl.textContent = "No public repositories to show yet.";
      return;
    }

    gridEl.innerHTML = shown.map(renderCard).join("");
  } catch (err) {
    // Graceful fallback: a static link instead of a broken section.
    // (GitHub's unauthenticated API allows ~60 requests/hour per IP, so a
    //  visitor refreshing many times could briefly hit this — that's fine.)
    gridEl.innerHTML = `
      <p class="repo-status">
        Couldn't load live data right now —
        <a href="https://github.com/${GH_USER}?tab=repositories"
           rel="noopener" target="_blank">browse the repositories on GitHub&nbsp;↗</a>
      </p>`;
    console.error("Repo load failed:", err);
  }
}

function renderCard(repo) {
  const desc = repo.description
    ? escapeHtml(repo.description)
    : "<span style='color:var(--ink-mute)'>No description yet.</span>";

  const lang = repo.language
    ? `<span class="lang">${escapeHtml(repo.language)}</span>`
    : "";

  const stars =
    repo.stargazers_count > 0
      ? `<span class="stars">★ ${repo.stargazers_count}</span>`
      : "";

  return `
    <article class="repo-card">
      <a class="repo-name" href="${repo.html_url}" rel="noopener" target="_blank">
        ${escapeHtml(repo.name)}
      </a>
      <p class="repo-desc">${desc}</p>
      <div class="repo-meta">${lang}${stars}</div>
    </article>`;
}

// Always escape anything coming from an external API before putting it in the DOM.
// (Defensive habit — fits the security-fundamentals theme of the projects.)
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

loadRepos();

/* ------------------------------------------------------------
   Theme toggle
   The initial theme is set before paint by the inline script in
   index.html. Here we just handle clicks: flip data-theme, persist
   the choice, and — where supported — run the flip inside a View
   Transition so the CSS Killua-mask reveal plays.
   ------------------------------------------------------------ */
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode / storage disabled — the switch still works, just isn't remembered */
      }
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
}
