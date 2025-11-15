
// Respect stored theme before paint
(function(){
  const saved = localStorage.getItem('theme');
  if(saved){ document.documentElement.setAttribute('data-theme', saved); }
})();

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

// Theme toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = qs('#theme-toggle');
  if(toggle){
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      toggle.innerText = next === 'dark' ? '☾ Dark' : '☀︎ Light';
    });
  }

  // Hydrate featured projects on index
  if(qs('#featured-projects')){
    renderProjects({ target: '#featured-projects', filter: p => p.featured, limit: 6 });
  }

  // Hydrate all projects on projects page
  if(qs('#projects-grid')){
    renderProjects({ target: '#projects-grid' });
  }

  // Hydrate presentations page
  if(qs('#presentations-grid')){
    renderList({
      json: 'data/presentations.json',
      target: '#presentations-grid',
      empty: 'Presentations coming soon. Add items to data/presentations.json.'
    });
  }
});

async function fetchJSON(path){
  try{
    const res = await fetch(path, { cache: 'no-store' });
    if(!res.ok) throw new Error('Network error');
    return await res.json();
  }catch(e){
    console.warn('Failed to load', path, e);
    return null;
  }
}

async function renderProjects({ target, filter = null, limit = null } = {}){
  const container = qs(target);
  const data = await fetchJSON('data/projects.json');
  if(!container) return;
  if(!data || !Array.isArray(data) || data.length === 0){
    container.innerHTML = `<p class="muted">No projects yet. Edit <code>data/projects.json</code> to add some.</p>`;
    return;
  }
  let items = data;
  if(typeof filter === 'function'){ items = items.filter(filter); }
  if(limit){ items = items.slice(0, limit); }

  const html = items.map(p => {
    const links = (p.links || []).map(l => `<a href="${l.href}" aria-label="${l.label}">${l.label} →</a>`).join(' · ');
    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    return `<article class="card" aria-labelledby="p-${p.slug}">
      <div class="meta">${p.year || ''}${p.role ? ` • ${p.role}` : ''}</div>
      <h3 id="p-${p.slug}">${p.title}</h3>
      <p>${p.description}</p>
      ${links ? `<div class="links">${links}</div>` : ''}
      ${tags ? `<div class="tags">${tags}</div>` : ''}
    </article>`;
  }).join('');
  container.innerHTML = html;
}

async function renderList({ json, target, empty = 'Nothing here (yet).' } = {}){
  const container = qs(target);
  const data = await fetchJSON(json);
  if(!container) return;
  if(!data || data.length === 0){
    container.innerHTML = `<p class="muted">${empty}</p>`;
    return;
  }
  const html = data.map(item => {
    return `<article class="card">
      <div class="meta">${item.date || ''}${item.event ? ` • ${item.event}` : ''}</div>
      <h3>${item.title}</h3>
      <p>${item.description || ''}</p>
      ${(item.links || []).map(l => `<a href="${l.href}">${l.label} →</a>`).join(' · ')}
    </article>`;
  }).join('');
  container.innerHTML = html;
}
