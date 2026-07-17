/* EZ Laundry - Vanilla JS interactions */
(function () {
  'use strict';

  // ========== Page loader ==========
  window.addEventListener('load', function () {
    var loader = document.querySelector('.page-loader');
    if (loader) setTimeout(function () { loader.classList.add('gone'); }, 400);
  });

  // ========== Sticky header ==========
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // progress
    var bar = document.querySelector('.scroll-progress');
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = ((window.scrollY / h) * 100) + '%';
    }

    // scroll top
    var top = document.querySelector('.scroll-top');
    if (top) {
      if (window.scrollY > 600) top.classList.add('show');
      else top.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ========== Mobile nav ==========
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.mobile-panel');
  var overlay = document.querySelector('.overlay');
  function closeMenu() {
    if (!toggle) return;
    toggle.classList.remove('open');
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('open');
      panel.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-panel a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!a.getAttribute('href') || a.getAttribute('href').charAt(0) !== '#') return;
      closeMenu();
    });
  });

  // ========== Scroll reveal ==========
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ========== Counter animation ==========
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1600;
        var start = performance.now();
        function step(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // ========== Hero slider ==========
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.slider-nav button');
    var idx = 0;
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    var prev = slider.querySelector('[data-prev]');
    var next = slider.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });
    setInterval(function () { go(idx + 1); }, 6000);
  }

  // ========== Testimonial slider ==========
  var tSlider = document.querySelector('[data-testimonials]');
  if (tSlider) {
    var tSlides = tSlider.querySelectorAll('.t-slide');
    var tDots = tSlider.querySelectorAll('.slider-nav button');
    var tIdx = 0;
    function tGo(n) {
      tIdx = (n + tSlides.length) % tSlides.length;
      tSlides.forEach(function (s, i) { s.style.display = i === tIdx ? '' : 'none'; });
      tDots.forEach(function (d, i) { d.classList.toggle('active', i === tIdx); });
    }
    tDots.forEach(function (d, i) { d.addEventListener('click', function () { tGo(i); }); });
    var tPrev = tSlider.querySelector('[data-prev]');
    var tNext = tSlider.querySelector('[data-next]');
    if (tPrev) tPrev.addEventListener('click', function () { tGo(tIdx - 1); });
    if (tNext) tNext.addEventListener('click', function () { tGo(tIdx + 1); });
    tGo(0);
    setInterval(function () { tGo(tIdx + 1); }, 7000);
  }

  // ========== FAQ accordion ==========
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () { item.classList.toggle('open'); });
  });

  // ========== Gallery filter ==========
  var filterBtns = document.querySelectorAll('.gallery-filter button');
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      filterBtns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      document.querySelectorAll('.gallery-item').forEach(function (g) {
        var cat = g.getAttribute('data-cat') || '';
        g.style.display = (f === 'all' || cat.indexOf(f) !== -1) ? '' : 'none';
      });
    });
  });

  // ========== Lightbox ==========
  var lightbox = document.querySelector('.lightbox');
  document.querySelectorAll('[data-lightbox]').forEach(function (t) {
    t.addEventListener('click', function () {
      if (!lightbox) return;
      var inner = lightbox.querySelector('.lb-inner');
      var art = t.querySelector('.art');
      if (inner && art) inner.innerHTML = '<button class="lb-close" aria-label="Close">✕</button>' + art.outerHTML;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      var closeBtn = lightbox.querySelector('.lb-close');
      if (closeBtn) closeBtn.addEventListener('click', closeLB);
    });
  });
  function closeLB() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLB(); });

  // ========== Scroll to top ==========
  var st = document.querySelector('.scroll-top');
  if (st) st.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ========== Active nav ==========
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-main a, .mobile-panel a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (!href) return;
    var slug = href.split('/').pop();
    if (slug === page || (page === '' && slug === 'index.html')) a.classList.add('active');
  });

  // ========== Button ripple coordinates ==========
  document.querySelectorAll('.btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var r = b.getBoundingClientRect();
      b.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%');
      b.style.setProperty('--y', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // ========== Form validation ==========
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field') || input.parentElement;
        var v = (input.value || '').trim();
        var ok = !!v;
        if (input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if (input.type === 'tel') ok = /^[\d\s\-+()]{7,}$/.test(v);
        if (field) field.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });
      if (valid) {
        var success = form.querySelector('.form-success');
        if (success) success.style.display = 'block';
        form.reset();
        setTimeout(function () { if (success) success.style.display = 'none'; }, 5000);
      }
    });
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('error');
      });
    });
  });

  // ========== Smooth anchor scroll (offset for header) ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ========== Year in footer ==========
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
