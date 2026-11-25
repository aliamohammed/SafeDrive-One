{
  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Show real image files when they exist; otherwise keep the drawn illustration
  for (const img of document.querySelectorAll('.frame > img')) {
    const ok = () => img.classList.add('ok');
    if (img.complete && img.naturalWidth > 0) ok();
    else img.addEventListener('load', ok);
  }

  // Video: show the real video once it loads, else keep the storyboard
  const vbox = document.querySelector('.video');
  const vid = vbox ? vbox.querySelector('video') : null;
  if (vid) {
    vid.addEventListener('loadedmetadata', () => vbox.classList.add('has-video'));
    if (vid.readyState >= 1) vbox.classList.add('has-video');
  }

  // Site search
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const input = document.getElementById('q');
  const box = document.getElementById('results');
  const data = window.SD_INDEX || [];
  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.classList.remove('open'); box.innerHTML = ''; return; }
    const terms = q.split(/\s+/);
    const hits = data.filter(d => {
      const t = (d.page + ' ' + d.title + ' ' + d.text).toLowerCase();
      return terms.every(w => t.includes(w));
    }).slice(0, 7);
    if (!hits.length) {
      box.innerHTML = '<div class="none">No results for “' + esc(input.value) + '”. Try “brake”, “coach” or “sandstorm”.</div>';
    } else {
      const re = new RegExp('(' + terms.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
      box.innerHTML = hits.map(d => {
        const low = d.text.toLowerCase();
        const at = Math.max(0, low.indexOf(terms[0]) - 50);
        const snip = (at > 0 ? '…' : '') + d.text.slice(at, at + 130) + '…';
        return '<a href="' + esc(d.url) + '"><b>' + esc(d.title) + ' · ' + esc(d.page) + '</b><span>' +
          esc(snip).replace(re, '<mark>$1</mark>') + '</span></a>';
      }).join('');
    }
    box.classList.add('open');
  };
  if (input && box) {
    input.addEventListener('input', run);
    input.addEventListener('focus', run);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const a = box.querySelector('a'); if (a) { e.preventDefault(); location.href = a.getAttribute('href'); } }
      if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
      if (e.key === 'ArrowDown') { const a = box.querySelector('a'); if (a) { e.preventDefault(); a.focus(); } }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.search')) box.classList.remove('open'); });
  }

  // Contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let good = true;
      const check = (id, test, msg) => {
        const el = document.getElementById(id);
        const err = document.getElementById(id + '-err');
        const fail = !test(el.value.trim());
        err.textContent = fail ? msg : '';
        el.setAttribute('aria-invalid', fail ? 'true' : 'false');
        if (fail) good = false;
      };
      check('name', v => v.length > 1, 'Please enter your name.');
      check('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
      check('message', v => v.length > 9, 'Please write a message of at least 10 characters.');
      if (good) {
        const t = document.getElementById('thanks');
        t.querySelector('strong').textContent = 'Thank you, ' + document.getElementById('name').value.trim() + '!';
        t.classList.add('show');
        form.reset();
        t.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    });
  }
}
