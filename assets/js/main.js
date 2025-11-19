// Theme toggle with persistence
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);
  if (btn) btn.textContent = initial === 'dark' ? '☾' : '☼';
  if (btn) btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☾' : '☼';
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
