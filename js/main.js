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

  // en la página principal, el enlace de la sección que se está viendo queda marcado
  function navSpy() {
    var links = $$('.nav__links a[data-spy]');
    if (!links.length || links[0].getAttribute('href').charAt(0) !== '#') return;
    links.forEach(function (a) {
      var sec = $('#' + a.dataset.spy);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: function (self) {
          if (self.isActive) links.forEach(function (x) { x.classList.toggle('is-active', x === a); });
          else a.classList.remove('is-active');
        }
      });
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

      var preview = $('.menu__preview');
      if (preview) tl.fromTo(preview, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, .4);

      gsap.set(ridge, { yPercent: 40, opacity: 0 });
    }
    build();

    // la foto de la derecha cambia según el apartado señalado
    var slides = $$('.menu__slide');
    function showSlide(name) {
      slides.forEach(function (s) { s.classList.toggle('is-on', s.dataset.for === name); });
    }
    $$('[data-menu-link][data-slide]').forEach(function (a) {
      ['mouseenter', 'focus'].forEach(function (ev) {
        a.addEventListener(ev, function () { showSlide(a.dataset.slide); });
      });
    });

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
        var href = a.getAttribute('href');
        if (href.charAt(0) !== '#') return;   // enlace a otra página: navegación normal
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

  /* ─────────── 8b. Carta: pestañas ─────────── */
  function cartaTabs() {
    var tabs = $$('.carta__tab[data-tab]');
    var panels = $$('.carta__panel');
    if (!tabs.length) return;

    function show(id, animate) {
      tabs.forEach(function (t) {
        var on = t.dataset.tab === id;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.id !== 'panel-' + id; });
      var panel = $('#panel-' + id);
      if (animate && !reduced) {
        gsap.fromTo($$('.carta__group', panel), { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .07, clearProps: 'transform,opacity' });
      }
      ScrollTrigger.refresh();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.dataset.tab, true); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus();
        show(n.dataset.tab, true);
      });
    });

    gsap.from('.carta__tabs > *', {
      y: 20, opacity: 0, duration: .7, ease: 'power3.out', stagger: .05,
      scrollTrigger: { trigger: '.carta__wrap', start: 'top 88%' }
    });
    gsap.from($$('.carta__panel:not([hidden]) .carta__group'), {
      y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .07, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.carta__wrap', start: 'top 80%' }
    });
  }

  /* ─────────── 9. Cómo trabajamos ─────────── */
  function proceso() {
    var pasos = $$('[data-paso]');
    if (!pasos.length) return;

    // índice de pasos (escritorio): se resalta el paso que está en el centro de la pantalla
    var idx = $('#procesoIndex');
    if (idx) {
      var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
      var lis = pasos.map(function (paso, i) {
        paso.id = 'paso-' + (i + 1);
        var li = document.createElement('li');
        li.innerHTML = '<a href="#paso-' + (i + 1) + '"><span>' + pad2(i + 1) + '</span><span>' + $('h3', paso).textContent + '</span></a>';
        idx.appendChild(li);
        return li;
      });
      lis[0].classList.add('is-on');
      ScrollTrigger.create({
        trigger: '.proceso__mosaico', start: 'top 70%', end: 'bottom 30%',
        onUpdate: function () {
          var mid = window.innerHeight * .5, best = 0, bd = 1e9;
          pasos.forEach(function (p, k) {
            var r = p.getBoundingClientRect();
            var d = Math.abs(r.top + r.height * .35 - mid);
            if (d < bd) { bd = d; best = k; }
          });
          lis.forEach(function (li, k) { li.classList.toggle('is-on', k === best); });
        }
      });
    }

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

      // las dos columnas se desplazan un poco distinto al hacer scroll
      gsap.to(paso, {
        y: [-12, 14][i % 2], ease: 'none',
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
      radius = (w / 2) / Math.tan(Math.PI / N) * 1.5;
      // el orden importa: primero rotar, después alejar del centro
      cards.forEach(function (c, i) {
        c.style.transform =
          'translate(-50%,-50%) rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
      });
      render();
    }

    // ficha (contador, título, puntos) de la tarjeta que queda al frente
    var infoCur = $('#carCur'), infoTot = $('#carTot'), infoTitle = $('#carTitle'), infoSub = $('#carSub');
    var dotsBox = $('#carDots');
    var dots = [];
    var shown = -1;
    var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
    if (infoTot) infoTot.textContent = pad2(N);
    if (dotsBox) {
      cards.forEach(function (c, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel__dot';
        d.setAttribute('aria-label', 'Ver ' + $('figcaption span', c).textContent);
        d.addEventListener('click', function () { go(i); });
        dotsBox.appendChild(d);
        dots.push(d);
      });
    }

    function showInfo(i) {
      var cap = $('figcaption', cards[i]);
      if (infoCur) infoCur.textContent = pad2(i + 1);
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
      if (!infoTitle || !cap) return;
      infoTitle.textContent = $('span', cap).textContent;
      infoSub.textContent = $('em', cap).textContent;
      if (!reduced) {
        gsap.fromTo([infoTitle, infoSub], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: .06, overwrite: 'auto' });
      }
    }

    function render() {
      gsap.set(ring, { rotateY: state.angle });
      var front = ((Math.round(-state.angle / step) % N) + N) % N;
      cards.forEach(function (c, i) {
        var rel = ((((i * step + state.angle) % 360) + 540) % 360) - 180;
        c.style.setProperty('--d', (Math.abs(rel) / 180).toFixed(3));
        c.classList.toggle('is-front', i === front);
      });
      if (front !== shown) { shown = front; showInfo(front); }
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

    // ir a una tarjeta concreta por el camino más corto
    function go(i) {
      var cur = ((index % N) + N) % N;
      var diff = i - cur;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      if (diff) shift(diff);
    }

    $('#carousel').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); shift(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); shift(-1); }
    });

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
      var far = window.innerWidth < 700 ? '58vw' : '54vw';
      gsap.set(hero, { opacity: 0 });
      gsap.timeline({ repeat: -1, repeatDelay: 5, delay: 1.5 })
        .fromTo(hero, { x: 0, y: 36, scale: .85, rotation: -5, opacity: 0 },
                      { opacity: 1, duration: 2.2, ease: 'power1.out' })
        .to(hero, { x: far, duration: 24, ease: 'none' }, 0)
        .to(hero, { y: -56, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
        .to(hero, { rotation: 5, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0)
        .to(hero, { scale: 1.1, duration: 24, ease: 'none' }, 0)
        .to(hero, { opacity: 0, duration: 3, ease: 'power1.in' }, 21);
    }

    var about = $('.condor--about');
    if (about) {
      gsap.to(about, {
        x: '116vw', y: 130, rotation: 6, ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    }
  }

  // la ruta Patagonia → Alicante se dibuja sola y un punto la recorre en bucle
  function rutaOrigen() {
    $$('.origen__route').forEach(function (svg) {
      var path = $('.origen__path', svg);
      var mask = $('.origen__mask', svg);
      var dot = $('.origen__traveler', svg);
      var len = 0;
      try { len = path.getTotalLength(); } catch (e) { len = 0; }
      if (!len) return;

      var travel = function () {
        if (reduced) return;
        var o = { p: 0 };
        gsap.set(dot, { opacity: 1 });
        gsap.to(o, {
          p: 1, duration: 5.5, ease: 'sine.inOut', repeat: -1, repeatDelay: .8,
          onUpdate: function () {
            var pt = path.getPointAtLength(o.p * len);
            dot.setAttribute('cx', pt.x);
            dot.setAttribute('cy', pt.y);
          }
        });
      };

      gsap.set(mask, { strokeDasharray: len, strokeDashoffset: reduced ? 0 : len });
      gsap.to(mask, {
        strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.origen', start: 'top 85%', once: true },
        onComplete: travel
      });
    });
    gsap.from('.origen__side, .origen__line', {
      y: 22, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12,
      scrollTrigger: { trigger: '.origen', start: 'top 85%' }
    });
    gsap.fromTo('.origen__dot--b', { scale: 0, transformOrigin: '50% 50%' },
      { scale: 1, duration: .7, ease: 'back.out(3)',
        scrollTrigger: { trigger: '.origen', start: 'top 70%' } });
  }

  // con el ratón, las capas de la cordillera del hero se desplazan a distinta distancia
  function cordilleraRaton() {
    var hero = $('.hero');
    if (!hero || reduced || window.matchMedia('(hover: none)').matches) return;
    var capas = [
      { el: $('.cordillera--hero .cordillera__layer--far'), k: 10 },
      { el: $('.cordillera--hero .cordillera__layer--mid'), k: 22 },
      { el: $('.cordillera--hero .cordillera__layer--near'), k: 34 }
    ].filter(function (c) { return c.el; });
    capas.forEach(function (c) { c.to = gsap.quickTo(c.el, 'x', { duration: 1.4, ease: 'power3' }); });
    hero.addEventListener('mousemove', function (e) {
      var nx = e.clientX / window.innerWidth - .5;
      capas.forEach(function (c) { c.to(-nx * c.k); });
    });
    hero.addEventListener('mouseleave', function () { capas.forEach(function (c) { c.to(0); }); });
  }

  /* ─────────── 13. Aire ─────────── */

  // ráfagas: un trazo recorre cada línea de viento y, al pasar, mece la flora de la sección
  function rafagas() {
    $$('.rafagas').forEach(function (svg, s) {
      var section = svg.closest('section');
      var plantas = section ? $$('.flora__item', section) : [];
      var tls = [];

      $$('path', svg).forEach(function (p, i) {
        var len = p.getTotalLength();
        var seg = len * .36;
        gsap.set(p, { strokeDasharray: seg + ' ' + (len + seg), strokeDashoffset: seg, opacity: 0 });
        if (reduced) return;

        var dur = 3.4 + (i % 3) * .7;
        var tl = gsap.timeline({
          repeat: -1, repeatDelay: 2.5 + ((i + s) % 4) * 1.3, delay: 1 + i * 1.1 + s * .4, paused: true,
          onRepeat: i === 0 ? mecer : null,
          onStart: i === 0 ? mecer : null
        });
        tl.fromTo(p, { strokeDashoffset: seg }, { strokeDashoffset: -len, duration: dur, ease: 'power1.inOut' }, 0)
          .fromTo(p, { opacity: 0 }, { opacity: 1, duration: dur * .25, ease: 'sine.out' }, 0)
          .to(p, { opacity: 0, duration: dur * .3, ease: 'sine.in' }, dur * .7);
        tls.push(tl);
      });

      function mecer() {
        if (!plantas.length) return;
        gsap.to(plantas, {
          skewX: 4.5, duration: 1.3, ease: 'sine.out', stagger: .18,
          yoyo: true, repeat: 1, overwrite: 'auto'
        });
      }

      // solo sopla cuando la sección se ve
      if (section && tls.length) {
        ScrollTrigger.create({
          trigger: section, start: 'top bottom', end: 'bottom top',
          onToggle: function (self) { tls.forEach(function (t) { self.isActive ? t.play() : t.pause(); }); }
        });
      }
    });
  }

  // partículas arrastradas por el viento, con rachas y remolino alrededor del cursor
  function viento(canvas) {
    var section = canvas.closest('section');
    var ctx = canvas.getContext('2d');
    if (!ctx || !section) return;

    var W = 0, H = 0, dpr = 1, parts = [], raf = 0, running = false, last = 0, t = 0;
    var mouse = { x: -9999, y: -9999 };

    function seed(p, anywhere) {
      p.z = .25 + Math.random() * .75;               // profundidad: más cerca, más rápido y más grande
      p.x = anywhere ? Math.random() * W : -40 - Math.random() * 120;
      p.y = Math.random() * H;
      p.ph = Math.random() * Math.PI * 2;
      p.dot = Math.random() < .35;                   // algunas son motas, el resto trazos
      p.len = 10 + Math.random() * 26;
      p.a = .15 + Math.random() * .45;
      p.vx = p.vy = 0;
      return p;
    }

    function resize() {
      var r = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, Math.max(36, W * H / 14000)));
      parts = [];
      for (var i = 0; i < n; i++) parts.push(seed({}, true));
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(48, now - (last || now)); last = now; t += dt;
      // rachas: el viento sube y baja cada pocos segundos
      var racha = .55 + 1.1 * Math.pow(Math.max(0, Math.sin(t * .00042)), 3) + .15 * Math.sin(t * .0017);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var speed = (.35 + p.z * 1.5) * racha;
        var wob = Math.sin(t * .0011 * (1 + p.z) + p.ph) * .35 * p.z;

        // el cursor abre un remolino
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          var d = Math.sqrt(d2) || 1, f = (1 - d / 150) * .9;
          p.vx += (dx / d) * f * .6 - (dy / d) * f * .5;
          p.vy += (dy / d) * f * .6 + (dx / d) * f * .5;
        }
        p.vx *= .94; p.vy *= .94;

        var mx = (speed + p.vx) * dt * .06;
        var my = (wob + p.vy) * dt * .06;
        p.x += mx; p.y += my;

        if (p.x > W + 60 || p.y < -40 || p.y > H + 40) seed(p, false);

        var alpha = p.a * p.z * Math.min(1, racha);
        if (p.dot) {
          ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, .6 + p.z * 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          var k = p.len * (.6 + racha * .5) / Math.max(.001, Math.hypot(mx, my));
          var g = ctx.createLinearGradient(p.x - mx * k, p.y - my * k, p.x, p.y);
          g.addColorStop(0, 'rgba(255,255,255,0)');
          g.addColorStop(1, 'rgba(255,255,255,' + alpha + ')');
          ctx.strokeStyle = g;
          ctx.lineWidth = .5 + p.z * .9;
          ctx.beginPath();
          ctx.moveTo(p.x - mx * k, p.y - my * k);
          ctx.quadraticCurveTo(p.x - mx * k * .5, p.y - my * k * .5 - wob * 6, p.x, p.y);
          ctx.stroke();
        }
      }
    }

    function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 200); });

    section.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    section.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(section);
    } else start();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (section.getBoundingClientRect().bottom > 0) start();
    });
  }

  /* ─────────── 13. Heladería ─────────── */
  function helados() {
    var list = $('#flavors');
    var stage = $('#heladoStage');
    var art = $('#heladoArt');
    var now = $('#heladoNow');
    if (!list || !stage) return;

    var views = { cup: $('#heladoCup'), cone: $('#heladoCone'), gz: $('#heladoGz') };
    var items = $$('.flavor', list);

    // la ilustración cambia con el formato: tarrina, cucurucho o granizado
    function paint(item) {
      var d = item.dataset, n = parseInt(d.scoops, 10), s = stage.style;
      Object.keys(views).forEach(function (k) { views[k].toggleAttribute('hidden', k !== d.kind); });

      if (d.kind === 'cup') {
        var cols = [d.c1, d.c2, d.c3];
        // 1 sabor: una bola central · 2 sabores: dos bolas · 3 sabores: tres
        var map = n === 1 ? [null, null, d.c1] : n === 2 ? [d.c1, d.c2, null] : [d.c1, d.c2, d.c3];
        ['t1', 't2', 't3'].forEach(function (v, i) {
          s.setProperty('--' + v, map[i] || '#fff');
          s.setProperty('--o' + (i + 1), map[i] ? 1 : 0);
        });
        s.setProperty('--stripe', d.stripe || '#E4572E');
        s.setProperty('--spoon', d.stripe || '#E4572E');
      } else if (d.kind === 'cone') {
        s.setProperty('--s1o', n === 2 ? 1 : 0);
        s.setProperty('--sc1', d.c1);
        s.setProperty('--sc2', n === 2 ? d.c2 : d.c1);
      } else {
        s.setProperty('--gz', d.c1);
      }
      // el disco de fondo toma un tono suave del color principal
      s.setProperty('--disc', 'color-mix(in srgb, ' + d.c1 + ' 26%, #ffffff)');
    }
    paint(items[0]);

    function pick(item) {
      if (item.classList.contains('is-on')) return;
      items.forEach(function (i) { i.classList.toggle('is-on', i === item); });
      paint(item);
      now.textContent = item.dataset.name + ' · ' + item.dataset.price;
      if (!reduced) {
        gsap.fromTo(art, { y: -16, rotation: -3 }, { y: 0, rotation: 0, duration: .9, ease: 'elastic.out(1,.5)', overwrite: 'auto' });
        gsap.fromTo(now, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' });
      }
    }

    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () { pick(item); });
      item.addEventListener('focus', function () { pick(item); });
      item.addEventListener('click', function () { pick(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(item); }
      });
    });

    gsap.from(items, {
      y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .06,
      scrollTrigger: { trigger: list, start: 'top 85%' }
    });
    gsap.from('.helados__disc', {
      scale: .86, opacity: 0, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.helados__stage', start: 'top 82%' }
    });
  }

  /* ─────────── 14. Reseñas: «Más» y «Útil» ─────────── */
  function resenasUI() {
    var texts = $$('.resena__text[data-clamp]').map(function (p) {
      var more = document.createElement('button');
      more.type = 'button';
      more.className = 'resena__more';
      more.textContent = 'Más';
      more.hidden = true;
      more.addEventListener('click', function () {
        var open = p.classList.toggle('is-clamped');
        more.textContent = open ? 'Más' : 'Menos';
        ScrollTrigger.refresh();
      });
      p.after(more);
      return { p: p, more: more };
    });

    // solo se ofrece «Más» si el texto no cabe en cuatro líneas (depende del ancho)
    function measure() {
      texts.forEach(function (t) {
        if (t.more.textContent === 'Menos') return;
        t.p.classList.add('is-clamped');
        var over = t.p.scrollHeight > t.p.clientHeight + 1;
        t.p.classList.toggle('is-clamped', over);
        t.more.hidden = !over;
      });
    }
    measure();
    var rt2;
    window.addEventListener('resize', function () { clearTimeout(rt2); rt2 = setTimeout(measure, 200); });

    $$('.resena__like').forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      });
    });
  }

  /* ─────────── 15. Tienda online ─────────── */
  var CART_KEY = 'aires-pedido-v1';

  // número de productos del pedido en la insignia del botón «Tienda»
  function setNavCount(n) {
    $$('.nav__shop-count').forEach(function (b) { b.textContent = n; b.hidden = !n; });
  }
  function shopBadge() {
    var n = 0;
    try {
      var s = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
      Object.keys(s).forEach(function (k) { n += Math.min(+s[k] || 0, 99); });
    } catch (e) { n = 0; }
    setNavCount(n);
  }

  function tienda() {
    var grid = $('#tiendaGrid');
    if (!grid) return;

    var WHATSAPP = '34636060366';
    var KEY = CART_KEY;

    var CATS = [
      ['destacados', 'Destacados'], ['bolleria', 'Bollería'], ['alfajores', 'Alfajores'],
      ['tartas', 'Tartas'], ['salado', 'Salado'], ['pan', 'Pan'], ['helados', 'Helados']
    ];

    // [id, categoría, nombre, descripción, céntimos, dibujo, foto, destacado]
    var P = [
      ['facturas-12', 'bolleria', 'Docena de facturas', 'Surtidas: torta negra, crema, membrillo, batata…', 1150, 'croissant', null, 1],
      ['facturas-6', 'bolleria', 'Media docena de facturas', 'Surtidas', 600, 'croissant'],
      ['med-pistacho', 'bolleria', 'Medialuna de pistacho', '', 150, 'croissant'],
      ['med-choco', 'bolleria', 'Medialuna de chocolate', '', 150, 'croissant', 'assets/img/food-5.webp', 1],
      ['croissant-relleno', 'bolleria', 'Croissant relleno', 'De chocolate o dulce de leche', 220, 'croissant'],
      ['donut-choco', 'bolleria', 'Donut de chocolate y avellana', '', 170, 'donut'],
      ['napolitana-choco', 'bolleria', 'Napolitana de chocolate', '', 150, 'croissant'],

      ['alf-maicena', 'alfajores', 'Alfajor de maicena', 'Con dulce de leche · tamaño pequeño', 100, 'alfajor', 'assets/img/food-2.webp', 1],
      ['alf-negro', 'alfajores', 'Alfajor de chocolate negro', 'Con dulce de leche · tamaño pequeño', 150, 'alfajor'],
      ['alf-blanco', 'alfajores', 'Alfajor de chocolate blanco', 'Con dulce de leche · tamaño pequeño', 150, 'alfajor'],
      ['alf-pistacho', 'alfajores', 'Alfajor de pistacho', 'Con dulce de leche · tamaño grande', 250, 'alfajor'],
      ['alf-lemon', 'alfajores', 'Alfajor de Lemon Pie', 'Tamaño grande', 250, 'alfajor'],
      ['alf-ferrero', 'alfajores', 'Alfajor Ferrero Rocher', 'Tamaño grande', 250, 'alfajor'],
      ['alf-chocotorta', 'alfajores', 'Alfajor de Chocotorta', 'Tamaño grande', 250, 'alfajor'],
      ['conito', 'alfajores', 'Conito relleno de dulce de leche', 'De chocolate, chocolate blanco o pistacho', 250, 'alfajor'],

      ['t-rogel', 'tartas', 'Rogel', 'Porción', 450, 'tarta', 'assets/img/food-4.webp', 1],
      ['t-lemon', 'tartas', 'Lemon pie', 'Porción', 450, 'tarta', 'assets/img/food-1.webp', 1],
      ['t-chaja', 'tartas', 'Tarta Chajá', 'Porción', 450, 'tarta'],
      ['t-redvelvet', 'tartas', 'Red Velvet', 'Porción', 450, 'tarta'],
      ['t-carrot', 'tartas', 'Carrot Cake', 'Porción', 450, 'tarta'],
      ['t-chocotorta', 'tartas', 'Chocotorta', 'Porción', 450, 'tarta', null, 1],
      ['t-ddl-choco', 'tartas', 'Tarta de dulce de leche con chocolate', 'Porción', 450, 'tarta'],
      ['t-selva', 'tartas', 'Selva Negra', 'Porción', 450, 'tarta'],
      ['t-oreo', 'tartas', 'Tarta de Oreo', 'Porción', 450, 'tarta'],
      ['t-cheese-rojos', 'tartas', 'Cheesecake de frutos rojos', 'Porción', 450, 'tarta'],
      ['t-pastafrola-m', 'tartas', 'Pastafrola de membrillo', 'Porción', 450, 'tarta'],

      ['emp-ternera', 'salado', 'Empanada de ternera', '', 300, 'empanada', null, 1],
      ['emp-pollo', 'salado', 'Empanada de pollo', '', 300, 'empanada'],
      ['emp-caprese', 'salado', 'Empanada caprese', '', 300, 'empanada'],
      ['emp-espinacas', 'salado', 'Empanada de espinacas', '', 300, 'empanada'],
      ['emp-jyq', 'salado', 'Empanada de jamón y queso', '', 300, 'empanada'],
      ['pebete', 'salado', 'Pebete', '', 450, 'pan'],
      ['pizza', 'salado', 'Porción de pizza', '', 450, 'pan'],
      ['miga-esp', 'salado', 'Sándwich de miga especial', 'Jamón y pimiento, jamón y tomate, jamón y huevo…', 175, 'pan'],

      ['barra-comun', 'pan', 'Barra común', '', 100, 'pan'],
      ['barra-especial', 'pan', 'Barra especial', '', 130, 'pan'],
      ['pan-cristal', 'pan', 'Pan de cristal', '', 130, 'pan'],
      ['barra-integral', 'pan', 'Barra integral', '', 150, 'pan'],
      ['barra-cereales', 'pan', 'Barra de cereales', '', 180, 'pan'],

      ['tarrina-peq', 'helados', 'Tarrina pequeña', '1 sabor', 295, 'cup:o3|t3=#B7D88B|stripe=#E4572E'],
      ['tarrina-med', 'helados', 'Tarrina mediana', '2 sabores', 395, 'cup:o1o2|t1=#6B3E26|t2=#F8E7B9|stripe=#2F7391', null, 1],
      ['tarrina-gde', 'helados', 'Tarrina grande', '3 sabores', 550, 'cup:o1o2o3|t1=#F4A6B8|t2=#9ADBC4|t3=#C98B4B|stripe=#1E8E3E'],
      ['cucu-1', 'helados', 'Cucurucho de 1 bola', '', 350, 'cone:s1=0|sc2=#C98B4B'],
      ['cucu-2', 'helados', 'Cucurucho de 2 bolas', '', 450, 'cone:s1=1|sc1=#F4A6B8|sc2=#F8E7B9', null, 1],
      ['granizado', 'helados', 'Granizado de ½ litro', 'Limón o mango', 350, 'gz:gz=#D9EA5E']
    ].map(function (r) {
      return { id: r[0], cat: r[1], name: r[2], desc: r[3], price: r[4], glyph: r[5], img: r[6] || null, top: !!r[7] };
    });
    var BY = {};
    P.forEach(function (p) { BY[p.id] = p; });

    var GLYPH = {
      croissant: '<path d="M5 31c3-13 35-13 38 0-6-4-11-6-19-6s-13 2-19 6z"/><path d="M15 24l3 5M24 22v6M33 24l-3 5"/>',
      donut: '<circle cx="24" cy="25" r="15"/><circle cx="24" cy="25" r="5"/><path d="M14 17l3 2M31 16l2 3M35 28l-3 1M16 33l2-2"/>',
      alfajor: '<ellipse cx="24" cy="15" rx="15" ry="6"/><path d="M9 15v13c0 3.3 6.7 6 15 6s15-2.7 15-6V15"/><path d="M9 22c0 3.3 6.7 6 15 6s15-2.7 15-6"/>',
      tarta: '<path d="M5 37V23l38-10v24z"/><path d="M5 30l38-10"/><circle cx="14" cy="19" r="2.4"/>',
      empanada: '<path d="M5 33a19 19 0 0 1 38 0z"/><path d="M9 33a15 15 0 0 1 30 0" stroke-dasharray="2 3"/>',
      pan: '<path d="M7 35c0-9 7-17 17-17s17 8 17 17z"/><path d="M16 25l3 6M24 22l3 9M32 25l-3 6"/>',
      helado: '<circle cx="24" cy="15" r="9"/><path d="M15 20c0 4 4 4 4 4s3 1 5 0 5 0 5 0 4-1 4-4"/><path d="M16 25l8 19 8-19z"/>',
      tarrina: '<path d="M8 21h32l-4 21H12z"/><path d="M10 21c0-8 6-12 14-12s14 4 14 12"/>'
    };

    var eur = function (cents) {
      return (cents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };
    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; });
    };

    // ── estado del pedido (se guarda en el navegador)
    var cart = {};
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      Object.keys(saved).forEach(function (id) { if (BY[id] && saved[id] > 0) cart[id] = Math.min(saved[id], 99); });
    } catch (e) { cart = {}; }
    function persist() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
    function count() { return Object.keys(cart).reduce(function (n, id) { return n + cart[id]; }, 0); }
    function total() { return Object.keys(cart).reduce(function (t, id) { return t + cart[id] * BY[id].price; }, 0); }

    // ── filtros y tarjetas
    var filtersBox = $('#tiendaFilters');
    var current = 'destacados';
    var minus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
    var plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

    function controlHTML(p) {
      var q = cart[p.id] || 0;
      if (!q) return '<button class="prod__add" type="button" data-add="' + p.id + '" aria-label="Añadir ' + esc(p.name) + '">Añadir</button>';
      return stepHTML(p, q);
    }
    function stepHTML(p, q) {
      return '<div class="step" role="group" aria-label="Cantidad de ' + esc(p.name) + '">' +
        '<button type="button" data-dec="' + p.id + '" aria-label="Quitar uno">' + minus + '</button>' +
        '<output>' + q + '</output>' +
        '<button type="button" data-inc="' + p.id + '" aria-label="Añadir uno">' + plus + '</button></div>';
    }
    // ilustraciones a color de los helados: «tipo:variable=valor|variable=valor»
    var ART = { cup: ['ico-cup', '0 0 240 250'], cone: ['ico-cone', '0 0 200 380'], gz: ['ico-granizado', '0 0 240 250'] };
    function artHTML(spec) {
      var type = spec.split(':')[0];
      var parts = spec.split(':')[1].split('|');
      var vars = [];
      var first = parts.shift();
      if (type === 'cup') {   // qué bolas se ven según los sabores
        var on = first.replace(/o/g, ' o').trim().split(' ');
        [1, 2, 3].forEach(function (n) { vars.push('--o' + n + ':' + (on.indexOf('o' + n) > -1 ? 1 : 0)); });
      } else { parts.unshift(first); }
      parts.forEach(function (kv) {
        var k = kv.split('=');
        if (k[0] === 's1') vars.push('--s1o:' + k[1]);
        else if (k[0] === 'stripe') { vars.push('--stripe:' + k[1]); vars.push('--spoon:' + k[1]); }
        else vars.push('--' + k[0] + ':' + k[1]);
      });
      return '<svg class="prod__art" viewBox="' + ART[type][1] + '" style="' + vars.join(';') + '" aria-hidden="true"><use href="#' + ART[type][0] + '"/></svg>';
    }

    function cardHTML(p) {
      var thumb = p.img
        ? '<img src="' + p.img + '" alt="" loading="lazy">'
        : p.glyph.indexOf(':') > -1 ? artHTML(p.glyph)
        : '<svg viewBox="0 0 48 48" aria-hidden="true">' + GLYPH[p.glyph] + '</svg>';
      return '<article class="prod' + (cart[p.id] ? ' is-in' : '') + '" data-id="' + p.id + '" data-cat="' + p.cat + '">' +
        '<div class="prod__thumb">' + thumb + '</div>' +
        '<div class="prod__body"><div><h3 class="prod__name">' + esc(p.name) + '</h3>' +
        (p.desc ? '<p class="prod__desc">' + esc(p.desc) + '</p>' : '') + '</div>' +
        '<div class="prod__buy"><span class="prod__price">' + eur(p.price) + '</span><div class="prod__ctl">' + controlHTML(p) + '</div></div></div></article>';
    }

    function renderGrid(animate) {
      var list = P.filter(function (p) { return current === 'destacados' ? p.top : p.cat === current; });
      grid.innerHTML = list.map(cardHTML).join('');
      if (animate && !reduced) {
        gsap.fromTo($$('.prod', grid), { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: .035, clearProps: 'transform,opacity' });
      }
      ScrollTrigger.refresh();
    }

    filtersBox.innerHTML = CATS.map(function (c) {
      return '<button class="chip' + (c[0] === current ? ' is-on' : '') + '" type="button" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === current) + '">' + c[1] + '</button>';
    }).join('');
    filtersBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b || b.dataset.cat === current) return;
      current = b.dataset.cat;
      $$('.chip', filtersBox).forEach(function (x) {
        var on = x === b;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      renderGrid(true);
    });

    // ── carrito
    var bar = $('#cartBar'), barCount = $('#cartBarCount'), barTotal = $('#cartBarTotal');
    var panel = $('#cart'), form = $('#cartForm'), empty = $('#cartEmpty'), list = $('#cartList');
    var totalEl = $('#cartTotal'), errEl = $('#cartErr');
    var lastFocus = null;

    function setQty(id, q) {
      q = Math.max(0, Math.min(99, q));
      if (q) cart[id] = q; else delete cart[id];
      persist();
      refresh(id);
    }

    function refresh(changedId) {
      var n = count();
      // tarjeta afectada
      if (changedId) {
        var card = $('.prod[data-id="' + changedId + '"]', grid);
        if (card) {
          var p = BY[changedId];
          card.classList.toggle('is-in', !!cart[changedId]);
          $('.prod__ctl', card).innerHTML = controlHTML(p);
        }
      }
      // barra flotante
      var wasHidden = bar.hidden;
      bar.hidden = n === 0;
      barCount.textContent = n;
      barTotal.textContent = eur(total());
      setNavCount(n);
      if (wasHidden && n && !reduced) gsap.fromTo(bar, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out', clearProps: 'transform,opacity' });
      // panel
      empty.hidden = n > 0;
      form.hidden = n === 0;
      list.innerHTML = Object.keys(cart).map(function (id) {
        var p = BY[id], q = cart[id];
        return '<li data-id="' + id + '"><span class="cart__item-name">' + esc(p.name) + '</span>' +
          '<span class="cart__item-sum">' + eur(p.price * q) + '</span>' +
          '<span class="cart__item-sub">' + eur(p.price) + (p.desc ? ' · ' + esc(p.desc) : '') + '</span>' + stepHTML(p, q) + '</li>';
      }).join('');
      totalEl.textContent = eur(total());
    }

    function openCart() {
      lastFocus = document.activeElement;
      panel.hidden = false;
      document.body.classList.add('is-locked');
      requestAnimationFrame(function () {
        panel.classList.add('is-open');
        var f = $('#cartClose'); if (f) f.focus();
      });
    }
    function closeCart() {
      panel.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      setTimeout(function () { panel.hidden = true; }, reduced ? 0 : 420);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    grid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-add],[data-inc],[data-dec]');
      if (!a) return;
      var id = a.dataset.add || a.dataset.inc || a.dataset.dec;
      setQty(id, (cart[id] || 0) + (a.dataset.dec ? -1 : 1));
      var again = $('.prod[data-id="' + id + '"] button', grid);
      if (again) again.focus();
    });
    list.addEventListener('click', function (e) {
      var a = e.target.closest('[data-inc],[data-dec]');
      if (!a) return;
      var id = a.dataset.inc || a.dataset.dec;
      setQty(id, (cart[id] || 0) + (a.dataset.dec ? -1 : 1));
    });
    bar.addEventListener('click', openCart);
    $$('[data-cart-close]').forEach(function (el) { el.addEventListener('click', closeCart); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) closeCart();
    });
    $('#cartClear').addEventListener('click', function () {
      cart = {}; persist(); refresh(); renderGrid(false);
    });

    // ── enviar el pedido por WhatsApp
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#cartName').value.trim();
      if (!count()) return;
      if (!name) {
        errEl.textContent = 'Escribe tu nombre para que sepamos a quién entregárselo.';
        errEl.hidden = false;
        $('#cartName').focus();
        return;
      }
      errEl.hidden = true;
      var local = (form.querySelector('input[name="local"]:checked') || {}).value || '';
      var notes = $('#cartNotes').value.trim();
      var lines = Object.keys(cart).map(function (id) {
        var p = BY[id];
        return '• ' + cart[id] + ' × ' + p.name + (p.desc && p.cat === 'tartas' ? ' (' + p.desc.toLowerCase() + ')' : '') + ' — ' + eur(p.price * cart[id]);
      });
      var msg = 'Hola, soy ' + name + '. Quiero hacer este pedido para recoger en ' + local + ':\n\n' +
        lines.join('\n') + '\n\nTotal: ' + eur(total()) + (notes ? '\n\nComentarios: ' + notes : '');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });

    renderGrid(false);
    refresh();
  }

  /* ─────────── Arranque ─────────── */
  // la página de la tienda no tiene hero, carta ni carrusel: solo carga lo que necesita
  function bootTienda() {
    // sin preloader: la página aparece directamente
    if (!reduced) {
      gsap.from('.nav__logo, .nav__right > *', { y: -24, opacity: 0, duration: .7, ease: 'expo.out', stagger: .07, clearProps: 'transform,opacity' });
    }

    nav();
    burgerMenu();

    $$('[data-reveal-line]').forEach(function (el) {
      gsap.from(el.querySelector('span') || el, {
        yPercent: 115, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });
    $$('[data-split]').forEach(function (el) {
      gsap.from(splitWords(el), {
        yPercent: 115, duration: 1.05, ease: 'expo.out', stagger: .045,
        scrollTrigger: { trigger: el, start: 'top 92%' }
      });
    });
    gsap.to('.scroll-progress span', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: function () { return document.body.scrollHeight - window.innerHeight; }, scrub: .25 }
    });

    micro();
    cordilleras();
    flora();
    tienda();
    shopBadge();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  function boot() {
    if (!hasGSAP) { if (loader) loader.style.display = 'none'; return; }
    if (document.body.dataset.page === 'tienda') { bootTienda(); return; }

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
    navSpy();
    burgerMenu();
    reveals();
    counters();
    cartaPreview();
    cartaTabs();
    proceso();
    carousel3d();
    micro();
    contours();
    cordilleras();
    flora();
    condores();
    rutaOrigen();
    helados();
    shopBadge();
    if (document.readyState === 'complete') resenasUI();
    else window.addEventListener('load', resenasUI);
    cordilleraRaton();
    rafagas();
    if (!reduced) $$('[data-viento]').forEach(viento);

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
