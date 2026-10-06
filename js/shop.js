import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const anim = !matchMedia('(prefers-reduced-motion: reduce)').matches, root = document.documentElement;
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
// theme (same day / night idea as the home page)
const tb = $('#themeBtn'), label = () => (tb.textContent = root.dataset.theme === 'dark' ? 'Day mode' : 'Night mode');
label();
tb.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('bronx-theme', root.dataset.theme); label();
  if (anim) gsap.fromTo(tb, { rotationX: -90 }, { rotationX: 0, duration: 0.45, ease: 'back.out(2)' });
});
const mb = $('#menuBtn'), nv = $('#nav');
mb.addEventListener('click', () => mb.setAttribute('aria-expanded', nv.classList.toggle('open')));
// filters
const f = $('.filters');
if (f) {
  const grid = $('[data-grid]'), cards = [...grid.children], cnt = $('#count'), q = new URLSearchParams(location.search);
  let cat = q.get('cat') || 'all';
  ['origin', 'brand'].forEach((k) => { if (q.get(k)) $('#' + k).value = q.get(k); });
  const run = (first) => {
    const v = [], g = (id) => $('#' + id).value, s = g('sort');
    cards.sort((a, b) => (s === 'lo' ? a.dataset.price - b.dataset.price : s === 'hi' ? b.dataset.price - a.dataset.price : a.dataset.i - b.dataset.i)).forEach((c) => grid.appendChild(c));
    cards.forEach((c) => {
      const d = c.dataset, ok = (cat === 'all' || d.cat === cat) && (g('origin') === 'all' || d.origin === g('origin')) && (g('brand') === 'all' || d.brand === g('brand')) && (g('col') === 'all' || d.col === g('col'));
      c.hidden = !ok; if (ok) v.push(c);
    });
    cnt.textContent = `Showing ${v.length} of ${cards.length} products`;
    if (anim && !first) gsap.fromTo(v, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: { each: 0.012, amount: 0.35 }, overwrite: true, clearProps: 'all' });
  };
  $$('.chips button').forEach((b) => { b.setAttribute('aria-pressed', b.dataset.cat === cat); b.onclick = () => { cat = b.dataset.cat; $$('.chips button').forEach((x) => x.setAttribute('aria-pressed', x === b)); run(); }; });
  f.addEventListener('change', () => run()); run(true);
}
if (anim) {
  $$('[data-split]').forEach((h) => { h.innerHTML = h.textContent.split(' ').map((w) => `<span class="w"><span>${w}</span></span>`).join(' '); });
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if ($('[data-split]')) tl.from('[data-split] .w > span', { yPercent: 110, duration: 0.8, stagger: 0.07 });
  if ($('.hero')) tl.from('.hero p, .hero .cta, .hero .acc', { opacity: 0, y: 18, duration: 0.5, stagger: 0.1 }, '-=0.4').from('.hud > div', { opacity: 0, x: 40, duration: 0.6, stagger: 0.12 }, '-=0.6');
  $$('[data-count]').forEach((e) => { const o = { n: 0 }; gsap.to(o, { n: +e.dataset.count, duration: 1.4, delay: 0.5, ease: 'power2.out', onUpdate: () => (e.textContent = Math.round(o.n)) }); });
  if (!f) {
    const els = '.card, .tile'; gsap.set(els, { opacity: 0, y: 36 });
    ScrollTrigger.batch(els, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', clearProps: 'transform' }) });
  }
  const st = $('.stage');
  if (st) {
    const im = st.firstElementChild; gsap.set(im, { transformPerspective: 900 });
    gsap.from(st, { clipPath: 'inset(0 100% 0 0)', duration: 1, ease: 'power3.inOut' });
    const ry = gsap.quickTo(im, 'rotationY', { duration: 0.6 }), rx = gsap.quickTo(im, 'rotationX', { duration: 0.6 });
    st.addEventListener('pointermove', (e) => { const r = st.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 16); rx(-((e.clientY - r.top) / r.height - 0.5) * 12); });
    st.addEventListener('pointerleave', () => { ry(0); rx(0); });
  }
}
