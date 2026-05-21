# daisentaur.dev

The source for my personal site — a portfolio / home base that links out to my
work and grows as I do. Built as a deliberately-scoped first step in a larger
plan to eventually **self-host it from my own homelab**.

**Live at:** [daisentaur.dev](https://daisentaur.dev)

---

## What it is

A single static page — no framework, no build step, no dependencies. Plain
HTML, CSS, and a small vanilla-JS file that pulls my public repositories from
the GitHub API at load time so the project list stays current on its own.

```
.
├── index.html      # structure + content
├── style.css       # refined-minimal styling, theme vars in :root
├── script.js       # fetches & renders repos from the GitHub API
├── CNAME           # tells GitHub Pages the custom domain
└── .nojekyll       # serve files as-is, skip Jekyll processing
```

## Phase 1 — what's live now (this repo)

Static site, hosted on **GitHub Pages**, served over **HTTPS** on the custom
domain `daisentaur.dev`. The `.dev` TLD is on the browser HSTS preload list, so
HTTPS isn't optional — every visitor is forced onto a secure connection, and
the TLS certificate (issued automatically by Let's Encrypt via GitHub) has to
be in place before the site will load at all.

## Phase 2 — where it's going

Migrating the hosting to a self-hosted server on my homelab, as a deliberate
learning exercise. The point isn't that Pages is inadequate (it's great) — it's
that doing it the hard way teaches the stack:

- exposing a home service safely (**tunnelling** vs **port forwarding**)
- issuing & auto-renewing TLS certs myself (**ACME / Let's Encrypt**)
- **dynamic DNS** to track a changing residential IP
- firewall rules and general home-network hardening

## What I learned building Phase 1

- **The domain → DNS → host → certificate chain** are four separable concerns,
  often run by four different parties. Seeing where the seams are is most of
  the understanding.
- **DNS record types** in practice — `A`/`AAAA` (name → IP), `CNAME`
  (name → name), and why the apex domain can't be a `CNAME`, which is exactly
  why Pages uses `A` records for the root and a `CNAME` only for `www`.
- **What a TLS certificate actually proves** — it's public-key cryptography
  used for *identity*: a Certificate Authority signs a binding between my
  domain and my public key, and the private key never leaves the server.
- **Why `.dev` forces HTTPS** (HSTS preload) and what that implies for setup.
- **Defensive front-end habits** — escaping everything that comes back from an
  external API before it touches the DOM, even on a static site.

---

## Running locally

It's static, so anything that serves files works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## License

MIT — see [LICENSE](LICENSE).
