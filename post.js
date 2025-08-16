(async function(){
  // Wire drawer in post pages too (in case app.js loads later)
  const drawer = document.querySelector('.drawer');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('openDrawer');
  const closeBtn = document.getElementById('closeDrawer');
  function openDrawer(){ drawer?.classList.add('open'); overlay?.classList.add('active'); }
  function closeDrawer(){ drawer?.classList.remove('open'); overlay?.classList.remove('active'); }
  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeDrawer(); });

  const article = document.querySelector('article[data-slug]');
  if (!article) return;

  const slug = article.dataset.slug;
  const res = await fetch('assets/posts/index.json', { cache: 'no-store' });
  const posts = await res.json();

  const i = posts.findIndex(p => p.slug === slug);
  const prev = posts[i + 1]; // newest-first, so "previous" is next index
  const next = posts[i - 1];

  const prevEl = document.getElementById('prevPost');
  const nextEl = document.getElementById('nextPost');
  if (prev) { prevEl.href = `../${prev.path}`; prevEl.style.visibility = 'visible'; }
  else { prevEl.style.visibility = 'hidden'; }
  if (next) { nextEl.href = `../${next.path}`; nextEl.style.visibility = 'visible'; }
  else { nextEl.style.visibility = 'hidden'; }
})();
