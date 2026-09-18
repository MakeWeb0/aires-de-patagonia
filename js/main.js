/* ═══════════════════════════════════════════════
   AIRES DE PATAGONIA — interacciones (GSAP)
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Observer) gsap.registerPlugin(Observer);
  }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ─────────── 1. Split de palabras ─────────── */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.w-i', el);
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    var inner = [];
    words.forEach(function (w, i) {
      var mask = document.createElement('span');
      mask.className = 'w-mask';
      var span = document.createElement('span');
      span.className = 'w-i';
      span.textContent = w;
      mask.appendChild(span);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      inner.push(span);
    });
    el.dataset.splitDone = '1';
    return inner;
  }

  /* ─────────── 2. Loader + entrada del hero ─────────── */
  var loader = $('#loader');

  function intro() {
    var tl = gsap.timeline();

    tl.to('.loader__bar span', { scaleX: 1, duration: 1.05, ease: 'power2.inOut' })
      .to('.loader__mark', { y: -18, opacity: 0, duration: .5, ease: 'power2.in' }, '-=.2')
      .to('.loader__bar', { opacity: 0, duration: .3 }, '<')
      .to(loader, {
        yPercent: -100, duration: 1, ease: 'expo.inOut',
        onComplete: function () { loader.style.display = 'none'; ScrollTrigger.refresh(); }
      }, '-=.1');

    tl.from('.hero__video', { scale: 1.45, duration: 2.2, ease: 'expo.out' }, '-=.85')
      .from('.hero__eyebrow', { yPercent: 120, opacity: 0, duration: .9, ease: 'expo.out' }, '-=1.55')
      .from('.hero__title .word', { yPercent: 118, duration: 1.15, ease: 'expo.out', stagger: .07 }, '-=.8')
      .from('.hero__sub > span', { yPercent: 120, opacity: 0, duration: .9, ease: 'expo.out' }, '-=.85')
      .from('.hero__actions .btn', { y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .09 }, '-=.6')
      .from('.hero__meta-item', { y: 22, opacity: 0, duration: .8, ease: 'power3.out', stagger: .08 }, '-=.6')
      .from('.hero__scroll', { opacity: 0, duration: .8 }, '-=.5')
      .from('.nav__logo, .nav__right > *', { y: -24, opacity: 0, duration: .85, ease: 'expo.out', stagger: .08 }, '-=1.2');

    return tl;
  }

  /* ─────────── 3. Nav ─────────── */
  function nav() {
    var navEl = $('#nav');
    var last = 0;
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: function (self) {
        var y = self.scroll();
        navEl.classList.toggle('nav--solid', y > 80);
        if (document.body.classList.contains('is-open')) { navEl.classList.remove('nav--hidden'); last = y; return; }
        navEl.classList.toggle('nav--hidden', y > last && y > 400);
        last = y;
      }
    });
  }

  /* ─────────── 4. Menú hamburguesa ─────────── */
  function burgerMenu() {
    var burger  = $('#burger');
    var overlay = $('#menu-overlay');
    var bg      = $('.menu__bg');
    var bars    = $$('.burger__bars i');
    var label   = $('[data-burger-label]');
    var links   = $$('.menu__text > span');
    var nums    = $$('.menu__num');
    var hints   = $$('.menu__hint');
    var cols    = $$('.menu__foot-col');
    var ridge   = $('.menu__ridge');
    var open    = false;
    var tl;

    function build() {
      tl = gsap.timeline({ paused: true,
        onStart:    function () { overlay.classList.add('is-visible'); },
        onReverseComplete: function () { overlay.classList.remove('is-visible'); }
      });

      tl.to(bg, { clipPath: 'circle(150% at calc(100% - 90px) 44px)', duration: 1.05, ease: 'expo.inOut' })
        .to(bars[0], { rotate: 45, y: 3.5, width: 20, duration: .45, ease: 'power3.inOut' }, .05)
        .to(bars[1], { rotate: -45, y: -3.5, width: 20, marginLeft: 0, duration: .45, ease: 'power3.inOut' }, .05)
        .to(ridge,   { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out' }, .15)
        .fromTo(links, { yPercent: 115 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: .075 }, .28)
        .fromTo(nums,  { opacity: 0, x: -14 }, { opacity: .75, x: 0, duration: .7, ease: 'power3.out', stagger: .07 }, .38)
        .fromTo(hints, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', stagger: .06 }, .5)
        .fromTo(cols,  { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .06 }, .55);

      gsap.set(ridge, { yPercent: 40, opacity: 0 });
    }
    build();

    function toggle(force) {
      open = typeof force === 'boolean' ? force : !open;
      document.body.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      gsap.to(label, {
        opacity: 0, y: -8, duration: .18,
        onComplete: function () {
          label.textContent = open ? 'Cerrar' : 'Menú';
          gsap.fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .25 });
        }
      });
      if (open) tl.timeScale(1).play(); else tl.timeScale(1.5).reverse();
    }

    burger.addEventListener('click', function () { toggle(); });

    $$('[data-menu-link]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = $(a.getAttribute('href'));
        toggle(false);
        gsap.delayedCall(.45, function () {
          if (!target) return;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 10, behavior: 'smooth' });
        });
      });
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(false); });
  }

  /* ─────────── 5. Reveals genéricos ─────────── */
  function reveals() {
    // líneas simples
    $$('[data-reveal-line]').forEach(function (el) {
      gsap.from(el.querySelector('span') || el, {
        yPercent: 115, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // titulares palabra a palabra
    $$('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      gsap.from(words, {
        yPercent: 115, duration: 1.05, ease: 'expo.out', stagger: .045,
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    // imágenes con máscara
    $$('.reveal-img').forEach(function (box) {
      var img = box.querySelector('img');
      gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 90%' } })
        .fromTo(box, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.out' })
        .fromTo(img, { scale: 1.28 }, { scale: 1.08, duration: 1.5, ease: 'expo.out' }, 0);
    });

    // parallax suave
    $$('[data-parallax]').forEach(function (el) {
      gsap.to(el, {
        y: parseFloat(el.dataset.parallax),
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    // cabeceras de la carta
    $$('.carta__cat > span').forEach(function (s) {
      gsap.from(s, {
        yPercent: 110, duration: .9, ease: 'expo.out',
        scrollTrigger: { trigger: s, start: 'top 92%' }
      });
    });

    // platos de la carta
    $$('.carta__group').forEach(function (g) {
      gsap.from($$('.carta__item', g), {
        y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .05,
        scrollTrigger: { trigger: g, start: 'top 82%' }
      });
    });

    // reseñas
    gsap.from('[data-resena]', {
      y: 46, opacity: 0, rotate: .4, duration: 1, ease: 'expo.out', stagger: .08,
      scrollTrigger: { trigger: '.resenas__grid', start: 'top 82%' }
    });

    // tarjetas de local
    gsap.from('.local-card', {
      y: 40, opacity: 0, duration: .95, ease: 'expo.out', stagger: .09,
      scrollTrigger: { trigger: '.visita__cards', start: 'top 85%' }
    });

    // CTA instagram
    gsap.from('.proceso__cta', {
      y: 50, opacity: 0, duration: 1.05, ease: 'expo.out',
      scrollTrigger: { trigger: '.proceso__cta', start: 'top 88%' }
    });

    // hero: parallax de salida
    gsap.to('.hero__content, .hero__meta', {
      y: -70, opacity: .25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    gsap.to('.hero__video', {
      scale: 1.3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });

    // progreso de scroll
    gsap.to('.scroll-progress span', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: function () { return document.body.scrollHeight - window.innerHeight; }, scrub: .25 }
    });
  }

  /* ─────────── 6. Contadores ─────────── */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count);
      var pre = el.dataset.prefix || '';
      var suf = el.dataset.suffix || '';
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: end, duration: 1.8, ease: 'power2.out',
            onUpdate: function () { el.textContent = pre + Math.round(obj.v) + suf; }
          });
        }
      });
    });
  }

  /* ─────────── 8. Carta: foto flotante en hover ─────────── */
  function cartaPreview() {
    var preview = $('#cartaPreview');
    var img = preview ? preview.querySelector('img') : null;
    var items = $$('.carta__item[data-img]');
    if (!preview || !items.length) return;
    if (window.matchMedia('(hover: none)').matches) return;

    var xTo = gsap.quickTo(preview, 'x', { duration: .55, ease: 'power3' });
    var yTo = gsap.quickTo(preview, 'y', { duration: .55, ease: 'power3' });
    var rTo = gsap.quickTo(preview, 'rotate', { duration: .7, ease: 'power3' });
    var lastX = 0, current = null;

    function move(e) {
      xTo(e.clientX);
      yTo(e.clientY);
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      rTo(gsap.utils.clamp(-11, 11, dx * .7));
    }

    items.forEach(function (item) {
      item.addEventListener('mouseenter', function (e) {
        current = item.dataset.img;
        img.src = current;
        item.classList.add('is-hot');
        lastX = e.clientX;
        gsap.set(preview, { x: e.clientX, y: e.clientY });
        gsap.fromTo(preview,
          { opacity: 0, scale: .82 },
          { opacity: 1, scale: 1, duration: .55, ease: 'expo.out', overwrite: 'auto' });
        gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1, ease: 'expo.out' });
      });
      item.addEventListener('mousemove', move);
      item.addEventListener('mouseleave', function () {
        item.classList.remove('is-hot');
        gsap.to(preview, { opacity: 0, scale: .86, duration: .35, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    // resaltado sutil también para los platos sin foto
    $$('.carta__item:not([data-img])').forEach(function (item) {
      item.addEventListener('mouseenter', function () { item.classList.add('is-hot'); });
      item.addEventListener('mouseleave', function () { item.classList.remove('is-hot'); });
    });
  }

  /* ─────────── 9. Cómo trabajamos ─────────── */
  function proceso() {
    var pasos = $$('[data-paso]');
    if (!pasos.length) return;

    pasos.forEach(function (paso, i) {
      var media = $('.paso__media', paso);
      var video = $('video', paso);

      gsap.timeline({ scrollTrigger: { trigger: paso, start: 'top 84%' } })
        .fromTo(media,
          { yPercent: 12, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          { yPercent: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.out' })
        .fromTo($('.paso__num', paso),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: .92, duration: .9, ease: 'expo.out' }, '-=.75')
        .fromTo($$('.paso__copy > *', paso),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .08 }, '-=.7');

      // cada tarjeta se mueve un poco distinto al hacer scroll
      gsap.to(paso, {
        y: [-26, 22, -12][i % 3], ease: 'none',
        scrollTrigger: { trigger: '.proceso__mosaico', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
      });

      // el vídeo solo corre cuando se ve
      if (video) {
        ScrollTrigger.create({
          trigger: paso, start: 'top 88%', end: 'bottom 12%',
          onToggle: function (self) {
            if (self.isActive) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
            else video.pause();
          }
        });
      }
    });
  }

  /* ─────────── 10. Carrusel 3D ─────────── */
  function carousel3d() {
    var ring  = $('#carouselRing');
    var stage = $('.carousel__stage');
    if (!ring) return;

    var cards = $$('.carousel__card', ring);
    var N = cards.length;
    var step = 360 / N;
    var state = { angle: 0 };
    var radius = 0;
    var autoTween;

    function layout() {
      var w = cards[0].offsetWidth;
      radius = (w / 2) / Math.tan(Math.PI / N) * 1.18;
      // el orden importa: primero rotar, después alejar del centro
      cards.forEach(function (c, i) {
        c.style.transform =
          'translate(-50%,-50%) rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
      });
      render();
    }

    function render() {
      gsap.set(ring, { rotateY: state.angle });
      var front = Math.round(-state.angle / step);
      front = ((front % N) + N) % N;
      cards.forEach(function (c, i) { c.classList.toggle('is-front', i === front); });
    }

    function goTo(i, dur) {
      gsap.to(state, {
        angle: -i * step,
        duration: dur === undefined ? 1 : dur,
        ease: 'expo.out',
        onUpdate: render,
        overwrite: true
      });
    }

    var index = 0;
    function shift(d) { index += d; goTo(index); restartAuto(); }

    $('#carNext').addEventListener('click', function () { shift(1); });
    $('#carPrev').addEventListener('click', function () { shift(-1); });

    function startAuto() {
      if (reduced) return;
      autoTween = gsap.to(state, {
        angle: '-=' + step, duration: 4.4, ease: 'power2.inOut',
        repeat: -1, repeatDelay: 1.6, onUpdate: render,
        onRepeat: function () { index -= 1; }
      });
    }
    function restartAuto() {
      if (autoTween) autoTween.kill();
      gsap.delayedCall(3.2, startAuto);
    }

    // arrastre
    if (window.Observer) {
      Observer.create({
        target: stage,
        type: 'touch,pointer',
        dragMinimum: 3,
        onPress: function () { if (autoTween) autoTween.pause(); gsap.killTweensOf(state); },
        onDrag: function (self) {
          state.angle += self.deltaX * 0.32;
          render();
        },
        onDragEnd: function (self) {
          index = Math.round(-state.angle / step);
          goTo(index, .9);
          restartAuto();
        },
        tolerance: 8,
        preventDefault: false
      });
    }

    stage.addEventListener('mouseenter', function () { if (autoTween) autoTween.pause(); });
    stage.addEventListener('mouseleave', function () { if (autoTween) autoTween.resume(); });

    // click en una tarjeta = traerla al frente
    cards.forEach(function (c, i) {
      c.addEventListener('click', function () {
        if (c.classList.contains('is-front')) return;
        var cur = ((index % N) + N) % N;
        var diff = i - cur;
        if (diff > N / 2) diff -= N;
        if (diff < -N / 2) diff += N;
        shift(diff);
      });
    });

    layout();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 180); });

    // entrada (sin tocar el transform de las tarjetas: lo gestiona layout())
    gsap.from(stage, {
      opacity: 0, scale: .88, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.carousel', start: 'top 82%' }
    });
    gsap.from(cards, {
      opacity: 0, duration: .9, ease: 'power2.out', stagger: .07,
      scrollTrigger: { trigger: '.carousel', start: 'top 82%' }
    });
    ScrollTrigger.create({
      trigger: '.sabores', start: 'top 80%', once: true,
      onEnter: function () { gsap.delayedCall(1.4, startAuto); }
    });

    // pausa el giro automático cuando la sección no está a la vista
    ScrollTrigger.create({
      trigger: '.sabores', start: 'top bottom', end: 'bottom top',
      onToggle: function (self) {
        if (!autoTween) return;
        self.isActive ? autoTween.resume() : autoTween.pause();
      }
    });
  }

  /* ─────────── 11. Micro-interacciones ─────────── */
  function micro() {
    // botones magnéticos
    if (!window.matchMedia('(hover: none)').matches) {
      $$('.magnetic').forEach(function (el) {
        var xT = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' });
        var yT = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          xT((e.clientX - (r.left + r.width / 2)) * .28);
          yT((e.clientY - (r.top + r.height / 2)) * .38);
        });
        el.addEventListener('mouseleave', function () { xT(0); yT(0); });
      });

      // leve inclinación en las reseñas
      $$('[data-resena]').forEach(function (el) {
        var rx = gsap.quickTo(el, 'rotateX', { duration: .6, ease: 'power3' });
        var ry = gsap.quickTo(el, 'rotateY', { duration: .6, ease: 'power3' });
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          rx(((e.clientY - (r.top + r.height / 2)) / r.height) * -5);
          ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 5);
        });
        el.addEventListener('mouseleave', function () { rx(0); ry(0); });
      });
    }

    // anclas suaves
    $$('a[href^="#"]:not([data-menu-link])').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = $(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 10, behavior: 'smooth' });
      });
    });

    // el vídeo del hero solo corre si se ve
    var hv = $('.hero__video');
    if (hv) {
      ScrollTrigger.create({
        trigger: '.hero', start: 'top bottom', end: 'bottom top',
        onToggle: function (self) {
          if (self.isActive) { var p = hv.play(); if (p && p.catch) p.catch(function () {}); }
          else hv.pause();
        }
      });
    }
  }


  /* ─────────── 12. Capa patagónica ─────────── */

  // curvas de nivel dibujadas por código (mapa de altura del cerro)
  function contours() {
    var g = $('.contour__g');
    if (!g) return;
    var rings = 9, cx = 260, cy = 260, out = '';
    for (var r = 0; r < rings; r++) {
      var rad = 34 + r * 26;
      var pts = [], n = 44;
      for (var i = 0; i <= n; i++) {
        var a = (i / n) * Math.PI * 2;
        var wob = 1
          + 0.14 * Math.sin(a * 3 + r * 0.7)
          + 0.07 * Math.sin(a * 5 - r * 1.3)
          + 0.05 * Math.sin(a * 2 + r);
        var rr = rad * wob;
        pts.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr * 0.82).toFixed(1));
      }
      out += '<path d="M' + pts.join('L') + 'Z"/>';
    }
    g.innerHTML = out;

    var paths = $$('path', g);
    paths.forEach(function (p) {
      var len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to(paths, {
      strokeDashoffset: 0, duration: 2.2, ease: 'power2.out', stagger: .08,
      scrollTrigger: { trigger: '.contour', start: 'top 92%' }
    });
  }

  // la cordillera respira al hacer scroll: cada capa a su velocidad
  function cordilleras() {
    $$('.cordillera').forEach(function (c) {
      var section = c.closest('section');
      $$('.cordillera__layer', c).forEach(function (l) {
        var d = parseFloat(l.dataset.depth || 0);
        if (!d) return;
        gsap.fromTo(l, { y: -d * .6 }, {
          y: d, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      });
    });
  }

  // las plantas se mecen como las del local
  function flora() {
    $$('.flora__item').forEach(function (el, i) {
      var base = parseFloat(el.dataset.rot || 0);
      if (reduced) { gsap.set(el, { rotation: base }); return; }
      var amp = 1.3 + (i % 3) * 0.8;
      gsap.set(el, { rotation: base - amp });
      gsap.to(el, {
        rotation: base + amp,
        duration: 4.2 + (i % 4) * 1.1,
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        delay: i * .35
      });
    });

    // entrada: caen desde arriba al ver la sección
    $$('.flora').forEach(function (f) {
      gsap.from($$('.flora__item', f), {
        yPercent: -22, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: .12,
        scrollTrigger: { trigger: f.parentElement, start: 'top 85%' }
      });
    });
  }

  // el cóndor cruza planeando
  function condores() {
    var hero = $('.condor--hero');
    if (hero && !reduced) {
      gsap.timeline({ repeat: -1, repeatDelay: 7 })
        .fromTo(hero,
          { x: 0, y: 0, opacity: 0, scale: .8 },
          { opacity: 1, duration: 2, ease: 'power1.out' })
        .to(hero, { x: '128vw', duration: 26, ease: 'none' }, 0)
        .to(hero, { y: -40, duration: 13, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
        .to(hero, { scale: 1.15, duration: 26, ease: 'none' }, 0)
        .to(hero, { opacity: 0, duration: 3, ease: 'power1.in' }, 23);
    }

    var about = $('.condor--about');
    if (about) {
      gsap.to(about, {
        x: '116vw', y: 130, rotation: 6, ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    }
  }

  // la ruta Patagonia → Alicante se dibuja sola
  function rutaOrigen() {
    var path = $('.origen__path');
    if (!path) return;
    var len = path.getTotalLength();
    gsap.fromTo(path,
      { strokeDasharray: '1 6', strokeDashoffset: len },
      {
        strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.origen', start: 'top 85%' }
      });
    gsap.from('.origen__side, .origen__line', {
      y: 22, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12,
      scrollTrigger: { trigger: '.origen', start: 'top 85%' }
    });
    gsap.fromTo('.origen__dot--b', { scale: 0, transformOrigin: '50% 50%' },
      { scale: 1, duration: .7, ease: 'back.out(3)',
        scrollTrigger: { trigger: '.origen', start: 'top 70%' } });
  }

  /* ─────────── Arranque ─────────── */
  function boot() {
    if (!hasGSAP) { if (loader) loader.style.display = 'none'; return; }

    if (reduced) {
      loader.style.display = 'none';
      gsap.set('.hero__eyebrow, .hero__title .word, .hero__sub > span, .hero__actions .btn, .hero__meta-item, .hero__scroll', { clearProps: 'all' });
    } else {
      intro();
      // red de seguridad: si el navegador congela el rAF (pestaña en segundo plano,
      // ahorro de batería…) el loader no puede quedarse bloqueando la página
      setTimeout(function () {
        if (loader && loader.style.display !== 'none') {
          loader.style.display = 'none';
          gsap.set('.hero__eyebrow, .hero__title .word, .hero__sub > span, .hero__actions .btn, .hero__meta-item, .hero__scroll, .nav__logo, .nav__right > *', { clearProps: 'all' });
          ScrollTrigger.refresh();
        }
      }, 4500);
    }

    nav();
    burgerMenu();
    reveals();
    counters();
    cartaPreview();
    proceso();
    carousel3d();
    micro();
    contours();
    cordilleras();
    flora();
    condores();
    rutaOrigen();

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
