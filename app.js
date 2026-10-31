'use strict';

// Basic interactions work independently of the animation libraries.
const menu = document.querySelector('.menu');
const links = document.querySelector('.links');
function closeMenu() {
  links.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  links.classList.toggle('open', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && links.classList.contains('open')) {
    closeMenu(); menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('nav')) closeMenu();
});
window.matchMedia('(min-width:621px)').addEventListener('change', closeMenu);

const paths = {
  week: 'M0 100 Q35 110 65 65 T135 75 T210 45 T285 80 T360 60 T440 82',
  month: 'M0 85 Q35 60 65 80 T135 40 T210 70 T285 48 T360 76 T440 55'
};
document.querySelectorAll('[data-period]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-period]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    const period = button.dataset.period;
    document.getElementById('curve').setAttribute('d', paths[period]);
    document.getElementById('area').setAttribute('d', paths[period] + ' L440 150H0Z');
    document.getElementById('chart-caption').textContent = period === 'week'
      ? 'Contoh pola konsumsi · 7 hari' : 'Contoh pola konsumsi · 4 minggu';
    document.getElementById('chart-title').textContent = period === 'week'
      ? 'Grafik ilustratif pola konsumsi selama tujuh hari; bukan data aktual.'
      : 'Grafik ilustratif pola konsumsi selama empat minggu; bukan data aktual.';
    const labels = period === 'week' ? ['Sen','Sel','Rab','Kam','Jum','Sab','Min']
      : ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'];
    document.getElementById('chart-labels').replaceChildren(...labels.map(label => {
      const span = document.createElement('span'); span.textContent = label; return span;
    }));
  });
});

const modal = document.getElementById('contact-dialog');
document.getElementById('consult').addEventListener('click', () => {
  modal.showModal(); document.body.classList.add('modal-open');
});
['close-dialog','dialog-done'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => modal.close());
});
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  document.getElementById('consult').focus();
});
modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const b = modal.getBoundingClientRect();
  if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) modal.close();
});

// Local copies: no CDN or network request needed at runtime.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero-enter', {y:26, opacity:0, duration:.9, stagger:.1, ease:'power3.out'});
    gsap.from('.scene', {opacity:0, scale:.94, duration:1.2, delay:.2, ease:'power2.out'});
    gsap.to('.float.top', {y:-9, duration:3, repeat:-1, yoyo:true, ease:'sine.inOut'});
    gsap.to('.float.bottom', {y:8, duration:3.5, repeat:-1, yoyo:true, ease:'sine.inOut'});
    gsap.from('.mini-bars i', {scaleY:.15, duration:.8, stagger:.08, delay:.6, ease:'power2.out'});
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {y:24, opacity:0, duration:.75, ease:'power2.out',
        scrollTrigger:{trigger:el, start:'top 94%', once:true}});
    });
  });
  media.add('(min-width:851px) and (prefers-reduced-motion: no-preference)', () => {
    // Scroll-driven parallax on separate wrappers avoids fighting pointer motion.
    gsap.to('.scene-parallax', {y:65, ease:'none',
      scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1}});
    gsap.fromTo('.hero-glow', {y:0}, {y:150, ease:'none',
      scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1.5}});
    gsap.fromTo('.dashboard-shell', {y:32}, {y:-22, ease:'none',
      scrollTrigger:{trigger:'.monitor', start:'top bottom', end:'bottom top', scrub:1}});
    gsap.fromTo('.property-tag', {y:28, rotation:8}, {y:-22, rotation:2, ease:'none',
      scrollTrigger:{trigger:'.fit', start:'top bottom', end:'bottom top', scrub:1}});
  });
  media.add('(pointer:fine) and (prefers-reduced-motion: no-preference)', () => {
    const scene = document.querySelector('.scene');
    const tilt = document.querySelector('.scene-tilt');
    const moveX = gsap.quickTo(tilt, 'rotationY', {duration:.65, ease:'power2.out'});
    const moveY = gsap.quickTo(tilt, 'rotationX', {duration:.65, ease:'power2.out'});
    const onMove = event => {
      const r = scene.getBoundingClientRect();
      moveX(((event.clientX-r.left)/r.width-.5)*7);
      moveY(-((event.clientY-r.top)/r.height-.5)*5);
    };
    const reset = () => {moveX(0);moveY(0);};
    scene.addEventListener('pointermove', onMove);
    scene.addEventListener('pointerleave', reset);
    return () => {
      scene.removeEventListener('pointermove', onMove);
      scene.removeEventListener('pointerleave', reset);
    };
  });
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
  document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', () => ScrollTrigger.refresh()));
}
