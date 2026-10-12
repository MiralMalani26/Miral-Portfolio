(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.documentElement;

  /* ---------- hand-drawn mandala (generated, slightly wobbly) ---------- */
  function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mandala(seed) {
    const R = rng(seed), f = n => n.toFixed(1), TAU = Math.PI * 2;
    const pt = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
    const P = d => `<path pathLength="1" d="${d}"/>`;
    const ring = (r, amt) => { const N = 96, ph = R() * TAU; let d = ''; for (let i = 0; i <= N; i++) { const a = i / N * TAU, rr = r + amt * (Math.sin(a * 3 + ph) * .6 + Math.sin(a * 7 + ph * 2) * .4) + (R() - .5) * amt * .2; const [x, y] = pt(rr, a); d += (i ? 'L' : 'M') + f(x) + ' ' + f(y); } return P(d + 'Z'); };
    const petals = (n, r1, r2, w, off = 0) => { let s = ''; for (let i = 0; i < n; i++) { const a = i / n * TAU + off, ww = Math.PI / n * w, j = (R() - .5) * 4, m = (r1 + r2) / 2; const L = pt(r1, a - ww), Rr = pt(r1, a + ww), T = pt(r2 + j, a), cl = pt(m, a - ww * 1.9), cr = pt(m, a + ww * 1.9), v1 = pt(r1 + 4, a), v2 = pt(r2 - 10 + j, a); s += P(`M${f(L[0])} ${f(L[1])}Q${f(cl[0])} ${f(cl[1])} ${f(T[0])} ${f(T[1])}Q${f(cr[0])} ${f(cr[1])} ${f(Rr[0])} ${f(Rr[1])}`) + P(`M${f(v1[0])} ${f(v1[1])}L${f(v2[0])} ${f(v2[1])}`); } return s; };
    const ticks = (n, r, min, max) => { let s = ''; for (let i = 0; i < n; i++) { const a = i / n * TAU, l = min + R() * (max - min), A = pt(r, a), B = pt(r + l, a); s += P(`M${f(A[0])} ${f(A[1])}L${f(B[0])} ${f(B[1])}`); } return s; };
    const dots = (n, r, rr) => { let s = ''; for (let i = 0; i < n; i++) { const [x, y] = pt(r, i / n * TAU); s += `<circle cx="${f(x)}" cy="${f(y)}" r="${rr}"/>`; } return s; };
    return `<g class="m-outer">${ring(280, 3)}${ring(271, 2.5)}${ticks(96, 284, 4, 12)}${petals(24, 205, 262, .62)}</g>` +
           `<g class="m-mid">${petals(16, 128, 192, .7, .1)}${ring(198, 3)}${dots(32, 210, 1.7)}${ticks(48, 116, 3, 9)}</g>` +
           `<g class="m-in">${petals(12, 58, 116, .78)}${ring(62, 2)}${ring(30, 1.5)}${ticks(12, 10, 6, 14)}</g>`;
  }
  const mk = (cls, seed, extra = '') => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-300 -300 600 600'); s.setAttribute('aria-hidden', 'true'); if (extra) s.setAttribute('class', extra); s.innerHTML = mandala(seed); return s; };
  const hm = $('.mandala'); if (hm) hm.append(mk('', 7, 'draw'));
  const ab = $('.arch-back .bm'); if (ab) ab.replaceWith(Object.assign(mk('', 3), {}));
  const fm = $('.foot .fm'); if (fm) fm.append(mk('', 11));
  const pm = $('.props-card .pm'); if (pm) pm.append(mk('', 9));
  $$('.deco').forEach((d, i) => d.append(mk('', 40 + i)));
  const nav = $('#nav'); if (nav) { const m = document.createElement('div'); m.className = 'menu-m'; m.append(mk('', 5)); nav.append(m); }
  $$('.arch-back > svg').forEach(s => s.removeAttribute('class'));

  /* ---------- header + mobile menu ---------- */
  const header = $('.site'), burger = $('.burger');
  const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 8);
  const spUpd = () => { const h = document.documentElement.scrollHeight - innerHeight; root.style.setProperty('--sp', h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0); };
  addEventListener('scroll', () => { onScroll(); spUpd(); }, { passive: true }); addEventListener('resize', spUpd); onScroll(); spUpd();
  const setMenu = o => { root.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o); };
  if (burger) { burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open'))); $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false))); addEventListener('keydown', e => e.key === 'Escape' && setMenu(false)); }

  /* ---------- arch: tap/enter toggles (hover handled in CSS) ---------- */
  const arch = $('.arch-wrap');
  if (arch) {
    arch.addEventListener('click', () => arch.classList.toggle('is-open'));
    arch.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); arch.classList.toggle('is-open'); } });
    const img = $('.arch-photo img');
    if (img) { const names = ['photo.jpeg', 'photo.png', 'photo.webp', 'photo.JPG', 'photo.JPEG', 'photo.PNG']; let k = 0; const bad = () => { if (k < names.length) { img.src = names[k++]; } else { $('.arch-photo').classList.add('nophoto'); } }; img.addEventListener('error', bad); if (img.complete && !img.naturalWidth) bad(); }
  }

  /* ---------- layers -> sketch canvas ---------- */
  const lb = $$('.layers button'), sks = $$('.sk');
  const tagEl = $('.canvas .tag');
  function pick(k) { const bt = lb.find(b => b.dataset.sk === k); if (tagEl && bt) tagEl.textContent = bt.textContent; lb.forEach(b => b.classList.toggle('is-on', b.dataset.sk === k)); sks.forEach(s => { const on = s.dataset.sk === k; if (on && !s.classList.contains('is-on')) { s.classList.add('is-on'); } else if (!on) s.classList.remove('is-on'); }); }
  lb.forEach(b => { ['mouseenter', 'focus', 'click'].forEach(ev => b.addEventListener(ev, () => pick(b.dataset.sk))); });
  const canvas = $('.canvas'); if (canvas) canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); canvas.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%'); canvas.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%'); });

  /* ---------- how I work: path draws on scroll ---------- */
  const path = $('.path'), steps = $$('.steps li');
  function pathScroll() {
    if (!path) return; const r = path.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .25)));
    path.style.setProperty('--p', p.toFixed(3));
    steps.forEach((li, i) => li.classList.toggle('on', p >= (.08 + i * .2) * .92));
  }
  addEventListener('scroll', pathScroll, { passive: true }); addEventListener('resize', pathScroll); pathScroll();

  /* ---------- pointer effects (fine pointers only) ---------- */
  if (fine) {
    root.classList.add('has-cursor');
    const dot = Object.assign(document.createElement('div'), { className: 'cur-dot' }), ringEl = Object.assign(document.createElement('div'), { className: 'cur-ring' });
    dot.setAttribute('aria-hidden', 'true'); ringEl.setAttribute('aria-hidden', 'true'); document.body.append(dot, ringEl);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, nx = 0, ny = 0;
    addEventListener('pointermove', e => {
      root.classList.add('cur-on'); mx = e.clientX; my = e.clientY; nx = (mx / innerWidth - .5) * 2; ny = (my / innerHeight - .5) * 2;
      dot.style.transform = `translate(${mx}px,${my}px)`; root.style.setProperty('--cx', mx + 'px'); root.style.setProperty('--cy', my + 'px');
      const t = e.target.closest ? e.target.closest('[data-cursor],a,button,input,textarea') : null;
      const label = t && t.dataset ? t.dataset.cursor : null;
      ringEl.classList.toggle('is-link', !!t && !label); ringEl.classList.toggle('has-label', !!label); ringEl.textContent = label || '';
    }, { passive: true });
    const par = $$('[data-depth]');
    const tick = () => {
      rx += (mx - rx) * (reduce ? 1 : .18); ry += (my - ry) * (reduce ? 1 : .18);
      ringEl.style.transform = `translate(${rx}px,${ry}px)`;
      if (!reduce) par.forEach(el => { const d = +el.dataset.depth; el.style.translate = `${(nx * d).toFixed(1)}px ${(ny * d).toFixed(1)}px`; });
      requestAnimationFrame(tick);
    };
    tick();
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.translate = `${((e.clientX - r.left - r.width / 2) * .25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * .35).toFixed(1)}px`; });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }
  /* click burst (all pointers) */
  if (!reduce) addEventListener('pointerdown', e => {
    if (e.button || (e.target.closest && e.target.closest('input,textarea'))) return;
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', 'burst'); s.setAttribute('viewBox', '0 0 120 120'); s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
    let h = '<circle cx="60" cy="60" r="56"/>'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r1 = 16 + (i % 2) * 6, r2 = 38 + (i % 3) * 8; h += `<line x1="${(60 + r1 * Math.cos(a)).toFixed(1)}" y1="${(60 + r1 * Math.sin(a)).toFixed(1)}" x2="${(60 + r2 * Math.cos(a)).toFixed(1)}" y2="${(60 + r2 * Math.sin(a)).toFixed(1)}"/>`; }
    s.innerHTML = h; document.body.append(s); setTimeout(() => s.remove(), 800);
  });
})();

/* ===== inner-page features: filters, rails, lightbox, copy, page fade ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* images that may be missing: try a few extensions, then remove */
  const exts = ['png', 'jpg', 'jpeg', 'webp'];
  function tryImg(img, base) { let k = 0; img.src = base + '.' + exts[0]; img.addEventListener('error', () => { k++; if (k < exts.length) img.src = base + '.' + exts[k]; else img.dispatchEvent(new Event('gone')); }); }

  /* rails built from a name pattern, e.g. fixora-customer-01 ... 12 */
  $$('.rail[data-prefix]').forEach(rail => {
    const n = +rail.dataset.count, pre = rail.dataset.prefix, grp = rail.dataset.group, alt = rail.dataset.alt;
    for (let i = 1; i <= n; i++) {
      const num = String(i).padStart(2, '0');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'shot'; b.dataset.lb = grp; b.dataset.cursor = 'Zoom'; b.setAttribute('aria-label', `${alt} ${i} of ${n}, open larger`); b.dataset.cap = `${alt} ${i} of ${n}`;
      const im = document.createElement('img'); im.alt = `${alt} ${i}`; im.loading = 'lazy'; im.draggable = false;
      im.addEventListener('gone', () => { b.remove(); sync(); }); tryImg(im, pre + num);
      b.append(im); rail.append(b);
    }
    const sec = rail.closest('.fsec');
    const bar = $('.rail-bar i', sec), prev = $('[data-dir="-1"]', sec), next = $('[data-dir="1"]', sec);
    function sync() {
      const shots = $$('.shot', rail); if (!shots.length) { sec.hidden = true; return; }
      const max = rail.scrollWidth - rail.clientWidth, vis = rail.clientWidth / rail.scrollWidth;
      const w = Math.max(.12, Math.min(1, vis)); bar.style.setProperty('--w', (w * 100) + '%');
      const p = max > 0 ? rail.scrollLeft / max : 0; bar.style.setProperty('--x', (p * (1 / w - 1) * 100) + '%');
      const cnt = $('.count', sec); if (cnt) cnt.textContent = shots.length + ' screens';
    }
    rail.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); setTimeout(sync, 400); setTimeout(sync, 1500);
    [prev, next].forEach(btn => btn && btn.addEventListener('click', () => rail.scrollBy({ left: +btn.dataset.dir * rail.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' })));
    /* drag to scroll (mouse) */
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('drag'); } rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { down = false; setTimeout(() => rail.classList.remove('drag'), 0); });
    rail.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  });
  /* single images that may be missing (flows) */
  $$('img[data-base]').forEach(im => { const fig = im.closest('figure'); im.addEventListener('gone', () => { fig.remove(); const sec = $('.flows-sec'); if (sec && !$$('.flows-sec figure').length) sec.hidden = true; }); tryImg(im, im.dataset.base); });
  /* fan images on the Work page */
  $$('.fan img').forEach(im => { im.addEventListener('gone', () => im.remove()); tryImg(im, im.dataset.base); });

  /* ---------- filter pills (Work) ---------- */
  const seg = $('.seg');
  if (seg) {
    const btns = $$('button', seg), ind = $('.ind', seg), secs = $$('.wsec');
    const place = b => { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`; };
    function setF(f, push) {
      if (!btns.some(b => b.dataset.f === f)) f = 'all';
      btns.forEach(b => { const on = b.dataset.f === f; b.setAttribute('aria-pressed', on); if (on) place(b); });
      secs.forEach(s => { const show = f === 'all' || s.dataset.p === f; if (show && s.hidden) { s.hidden = false; s.classList.remove('show'); void s.offsetWidth; s.classList.add('show'); } else if (!show) s.hidden = true; });
      if (push) history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
    }
    btns.forEach(b => b.addEventListener('click', () => setF(b.dataset.f, true)));
    addEventListener('resize', () => { const b = btns.find(x => x.getAttribute('aria-pressed') === 'true'); if (b) place(b); });
    addEventListener('hashchange', () => setF(location.hash.slice(1)));
    setF(location.hash.slice(1)); document.fonts && document.fonts.ready.then(() => { const b = btns.find(x => x.getAttribute('aria-pressed') === 'true'); if (b) place(b); });
  }

  /* ---------- lightbox ---------- */
  const lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<div class="lb-stage"><div class="lb-count" aria-live="polite"></div><button class="lb-x" type="button" aria-label="Close">&times;</button><button class="lb-prev" type="button" aria-label="Previous image">&larr;</button><figure class="lb-fig"><img alt=""><figcaption></figcaption></figure><button class="lb-next" type="button" aria-label="Next image">&rarr;</button></div><div class="lb-thumbs"></div>';
  document.body.append(lb);
  const L = { img: $('img', lb), cap: $('figcaption', lb), count: $('.lb-count', lb), thumbs: $('.lb-thumbs', lb), list: [], i: 0, last: null };
  const srcOf = el => $('img', el).currentSrc || $('img', el).src;
  function show(i, dir) {
    L.i = (i + L.list.length) % L.list.length; const el = L.list[L.i];
    L.img.src = srcOf(el); L.img.alt = el.dataset.cap || $('img', el).alt || ''; L.cap.textContent = el.dataset.cap || '';
    L.count.textContent = L.list.length > 1 ? `${L.i + 1} / ${L.list.length}` : '';
    $$('button', L.thumbs).forEach((b, k) => { b.classList.toggle('on', k === L.i); if (k === L.i) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); });
    if (dir && !reduce && L.img.animate) L.img.animate([{ transform: `translateX(${dir * 70}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
    [1, -1].forEach(d => { const n = L.list[(L.i + d + L.list.length) % L.list.length]; if (n) { const p = new Image(); p.src = srcOf(n); } });
  }
  function open(group, el) {
    L.list = $$(`[data-lb="${group}"]`).filter(x => x.isConnected && $('img', x)); L.last = document.activeElement;
    L.thumbs.innerHTML = ''; L.thumbs.hidden = L.list.length < 2;
    L.list.forEach((x, k) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Go to image ${k + 1}`); const t = document.createElement('img'); t.src = srcOf(x); t.alt = ''; b.append(t); b.addEventListener('click', () => { const d = k > L.i ? 1 : -1; show(k, d); }); L.thumbs.append(b); });
    $('.lb-prev', lb).style.display = $('.lb-next', lb).style.display = L.list.length < 2 ? 'none' : '';
    lb.hidden = false; root.classList.add('lb-open'); show(L.list.indexOf(el), 0); requestAnimationFrame(() => lb.classList.add('on')); $('.lb-x', lb).focus({ preventScroll: true });
  }
  function close() { lb.classList.remove('on'); root.classList.remove('lb-open'); setTimeout(() => { lb.hidden = true; L.img.removeAttribute('src'); }, reduce ? 0 : 320); if (L.last && L.last.focus) L.last.focus({ preventScroll: true }); }
  document.addEventListener('click', e => { const el = e.target.closest && e.target.closest('[data-lb]'); if (el && !lb.contains(el)) { e.preventDefault(); open(el.dataset.lb, el); } });
  $('.lb-x', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => show(L.i - 1, -1)); $('.lb-next', lb).addEventListener('click', () => show(L.i + 1, 1));
  lb.addEventListener('click', e => { if (!e.target.closest('img,button,figcaption,.lb-thumbs')) close(); });
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(L.i - 1, -1); else if (e.key === 'ArrowRight') show(L.i + 1, 1); else if (e.key === 'Tab') { const f = $$('button', lb).filter(b => b.offsetParent); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } });
  /* swipe */
  let tx = 0, ty = 0, tid = null;
  L.img.addEventListener('pointerdown', e => { tx = e.clientX; ty = e.clientY; tid = e.pointerId; });
  addEventListener('pointerup', e => { if (tid === null || e.pointerId !== tid) return; tid = null; if (lb.hidden) return; const dx = e.clientX - tx, dy = e.clientY - ty; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(L.i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); else if (dy > 110 && Math.abs(dy) > Math.abs(dx)) close(); });

  /* ---------- copy buttons ---------- */
  const toast = Object.assign(document.createElement('div'), { className: 'toast', role: 'status' }); document.body.append(toast);
  let tt; const say = m => { toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 1800); };
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => { const v = b.dataset.copy; try { await navigator.clipboard.writeText(v); } catch (e) { const t = document.createElement('textarea'); t.value = v; document.body.append(t); t.select(); try { document.execCommand('copy'); } catch (_) {} t.remove(); } say((b.dataset.what || 'Copied') + ' copied'); }));

  /* ---------- soft page fade between pages ---------- */
  if (!reduce) {
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return; const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !/\.html?$/.test(u.pathname) && u.pathname !== location.pathname.replace(/[^/]*$/, '')) return; if (u.pathname === location.pathname && u.hash) return;
      e.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => { location.href = a.href; }, 260);
    });
    addEventListener('pageshow', () => document.body.classList.remove('leaving'));
  }
})();

/* ===== light / dark theme + tolerant image names ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement, tb = $('.theme-btn'), meta = $('meta[name="theme-color"]');
  const colours = { light: '#ECE9F0', dark: '#15121B' };
  function apply(t, save) {
    root.dataset.theme = t;
    if (meta) meta.content = colours[t];
    if (tb) { tb.setAttribute('aria-pressed', String(t === 'dark')); tb.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  apply(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  if (tb) tb.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!reduce) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 520); }
    apply(next, true);
  });
  addEventListener('storage', e => { if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) apply(e.newValue, false); });

  /* design images: if a file is saved as name.jpg.jpeg / name.jpg / name_jpg.jpeg, find it; hide the card if none exists */
  const variants = src => {
    const m = src.match(/^(.*?)(?:_jpg\.jpeg|\.jpg\.jpeg|\.jpg|\.jpeg|\.png|\.webp)$/i); if (!m) return [];
    const b = m[1]; return [b + '_jpg.jpeg', b + '.jpg.jpeg', b + '.jpg', b + '.jpeg', b + '.png', b + '.webp', b + '.JPG'].filter(x => x !== src);
  };
  $$('.art img[src]').forEach(img => {
    const first = img.getAttribute('src'); const list = variants(first); let k = 0;
    const fail = () => { if (k < list.length) img.src = list[k++]; else { const f = img.closest('figure'); if (f) f.remove(); } };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
  });
})();
