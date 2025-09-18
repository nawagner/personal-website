Personal Website
================

This is a lightweight, responsive personal website to showcase your experience, projects, and contact details. It uses plain HTML/CSS/JS (no build step) and a JSON file for projects.

Quick Start
-----------

- Open `index.html` in a browser to preview locally.
- Update content placeholders in the HTML files and `assets/data/projects.json`.
- Replace `assets/img/profile.jpg` and `assets/resume.pdf` with your own files.

Customize Content
-----------------

- Site-wide
  - Title, meta, and OpenGraph: `index.html:6`, `about.html:6`, `projects.html:6`, `contact.html:6`.
  - Theme colors: `assets/css/styles.css:7`.
  - Social links and email: header/footer in each HTML and `about.html` contact section.

- Projects
  - Edit `assets/data/projects.json` to add/update projects.
  - Fields: `title`, `description`, `tech` (array of strings), `tags` (array), `repoUrl`, `liveUrl`, `image`.

- Resume
  - Replace `assets/resume.pdf` with your resume PDF. Links point to it from nav and buttons.

- Contact Form (optional)
  - By default, contact uses your mailto link.
  - To enable a hosted form (Formspree/Netlify), update the form action in `contact.html:60` and follow provider docs.

Deploy
------

- GitHub Pages
  - Push this folder to a repo.
  - In repo settings, enable Pages for the `main` branch root.

- Netlify/Vercel
  - Drag-and-drop the folder to Netlify, or import repo. No build needed.

Files
-----

- `index.html` – Home + featured projects.
- `projects.html` – All projects with filter/search.
- `about.html` – Bio, skills, headshot.
- `contact.html` – Contact info and optional form.
- `assets/css/styles.css` – Styles and dark mode.
- `assets/js/main.js` – Theme toggle and shared logic.
- `assets/js/projects.js` – Render/filter projects.
- `assets/data/projects.json` – Project data.
- `assets/img/profile.jpg` – Placeholder headshot.
- `assets/resume.pdf` – Placeholder resume.
- `assets/favicon.svg` – Favicon.
- `robots.txt` – Allow all.

Notes
-----

- All pages are standalone so they work on any static host.
- Dark mode persists via `localStorage`.
- If loading JSON locally is blocked by your browser, run a simple local server (e.g., `python3 -m http.server`).

