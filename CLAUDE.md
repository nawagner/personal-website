# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio website for Nick Wagner. No build step required - plain HTML/CSS/JS with JSON data files for content.

## Development

**Local preview:** Open `index.html` in a browser, or run a local server to avoid CORS issues with JSON loading:
```bash
python3 -m http.server
```

**Run with Cloudflare Workers (local dev server):**
```bash
npx wrangler dev
```

**Run tests:**
```bash
node scripts/mobile-menu.test.js
```

## Architecture

### Pages
- `index.html` - Homepage with hero, featured projects, and featured presentations
- `projects.html` - All projects with tag filtering and search
- `presentations.html` - All presentations with tag filtering and search

### JavaScript Structure
- `assets/js/main.js` - Core functionality: theme toggle (dark/light mode with localStorage persistence), mobile menu, shared `loadProjects()` and `cardHTML()` functions used by homepage
- `assets/js/projects.js` - `initProjectsPage()` for projects page filtering/search
- `assets/js/presentations.js` - `initPresentationsPage()` for presentations page filtering/search

### Data
Content is stored in JSON files:
- `assets/data/projects.json` - Project entries with `title`, `description`, `tech`, `tags`, `repoUrl`, `liveUrl`, `image`, `highlighted` (boolean for spotlight)
- `assets/data/presentations.json` - Same structure but uses `topics` instead of `tech`, and `slidesUrl` instead of `repoUrl`

### CSS
Single stylesheet at `assets/css/styles.css`:
- CSS custom properties for theming (`:root` for dark, `[data-theme="light"]` for light)
- Mobile breakpoint at 680px - hides desktop nav, shows mobile drawer
- Responsive breakpoints: 900px (tablet), 680px (mobile), 380px (small phones)

### Key Patterns
- Theme persists via `localStorage.getItem('theme')`
- Mobile nav uses `aria-hidden`, `aria-expanded` for accessibility
- Cards render via `cardHTML()` function with XSS protection (`escapeHTML`, `escapeAttr`)
- Tag filters derive unique tags from data using `Set`
