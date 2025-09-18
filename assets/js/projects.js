async function initProjectsPage() {
  const grid = document.getElementById('projectsGrid');
  const search = document.getElementById('search');
  const tagFilters = document.getElementById('tagFilters');
  let all = [];
  let activeTag = null;

  try {
    const res = await fetch('assets/data/projects.json');
    const data = await res.json();
    all = Array.isArray(data) ? data : data.projects || [];
  } catch (e) {
    console.warn('Failed to load projects:', e);
  }

  const tags = Array.from(new Set(all.flatMap(p => p.tags || []))).sort();
  tagFilters.innerHTML = ['All', ...tags].map(t => `<button class="tag" data-tag="${t}">${t}</button>`).join('');
  tagFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-tag]');
    if (!btn) return;
    activeTag = btn.dataset.tag === 'All' ? null : btn.dataset.tag;
    for (const b of tagFilters.querySelectorAll('.tag')) b.classList.toggle('active', b === btn);
    render();
  });
  const first = tagFilters.querySelector('button');
  if (first) first.classList.add('active');

  search.addEventListener('input', render);

  function render() {
    const q = (search.value || '').toLowerCase();
    const filtered = all.filter(p => {
      const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
      const matchesQ = !q || [p.title, p.description, ...(p.tech||[]), ...(p.tags||[])]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q));
      return matchesTag && matchesQ;
    });
    grid.innerHTML = filtered.map(cardHTML).join('');
  }

  render();
}

