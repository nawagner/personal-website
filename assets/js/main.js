// Theme toggle with persistence
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const mobileBtn = document.getElementById('mobileThemeToggle');
  const mobileIcon = document.getElementById('mobileThemeIcon');
  const mobileLabel = document.getElementById('mobileThemeLabel');
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');

  function updateThemeUI(theme) {
    if (btn) btn.textContent = theme === 'dark' ? '☾' : '☼';
    if (mobileIcon) mobileIcon.textContent = theme === 'dark' ? '☾' : '☼';
    if (mobileLabel) mobileLabel.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
  }

  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeUI(next);
  }

  root.setAttribute('data-theme', initial);
  updateThemeUI(initial);
  if (btn) btn.addEventListener('click', toggleTheme);
  if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);
})();

// Mobile menu
(function () {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');

  if (!toggle || !nav || !overlay) return;
  nav.setAttribute('aria-hidden', 'true');

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 680 && nav.classList.contains('open')) {
      closeMenu();
    }
  });
})();

// Shared project loader for homepage
async function loadProjects({ mountId, limit, source = 'assets/data/projects.json' }) {
  try {
    const res = await fetch(source);
    const data = await res.json();
    const projects = Array.isArray(data) ? data : data.projects || [];
    const list = typeof limit === 'number' ? projects.slice(0, limit) : projects;
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = list.map(cardHTML).join('');
  } catch (e) {
    console.warn('Failed to load projects:', e);
  }
}

function cardHTML(p) {
  const img = p.image || 'assets/img/profile.jpg';
  const techList = p.tech || p.topics || [];
  const tech = techList.slice(0, 5).map(t => `<li>${escapeHTML(t)}</li>`).join('');
  const primaryUrl = p.liveUrl || p.repoUrl || p.slidesUrl;
  const classes = ['card'];
  if (p.highlighted) classes.push('card--highlighted');
  const badge = p.highlighted ? `<span class="card-badge">Spotlight</span>` : '';
  const imageContent = `<img loading="lazy" src="${escapeAttr(img)}" alt="${escapeAttr(p.title || 'Project image')}" />`;
  const wrappedImage = primaryUrl
    ? `<a class="card-media" href="${escapeAttr(primaryUrl)}" target="_blank" rel="noopener">${imageContent}</a>`
    : `<div class="card-media">${imageContent}</div>`;

  return `
  <article class="${classes.join(' ')}">
    ${wrappedImage}
    <div class="card-body">
      ${badge}
      <h3>${escapeHTML(p.title || 'Untitled')}</h3>
      <p class="desc">${escapeHTML(p.description || '')}</p>
      <ul class="pill-list">${tech}</ul>
    </div>
  </article>`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"]+/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
}
function escapeAttr(str) { return escapeHTML(str).replace(/'/g, '&#39;'); }

document.addEventListener('DOMContentLoaded', () => {
  const happyBtn = document.getElementById('happyButton');
  if (happyBtn) {
    happyBtn.addEventListener('click', () => triggerHappyTimes(happyBtn));
  }
});

function triggerHappyTimes(button) {
  const rect = button.getBoundingClientRect();
  const emojis = ['😊', '😄', '😎', '🤩', '😁'];
  const burstCount = 24;

  for (let i = 0; i < burstCount; i++) {
    const emoji = document.createElement('span');
    emoji.className = 'emoji-burst';
    emoji.textContent = emojis[i % emojis.length];

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 90;
    emoji.style.left = `${rect.left + rect.width / 2}px`;
    emoji.style.top = `${rect.top + rect.height / 2}px`;
    emoji.style.fontSize = `${22 + Math.random() * 10}px`;
    emoji.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    emoji.style.setProperty('--dy', `${Math.sin(angle) * distance - 40}px`);
    emoji.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);

    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1200);
  }
}
