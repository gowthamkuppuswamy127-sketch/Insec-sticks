/* Incense Creators — progressive enhancement only.
   Nothing here is required for the page to be readable or usable. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Year ─────────────────────────────────────────────────────── */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Sticky nav ───────────────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('stuck', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile menu ──────────────────────────────────────────────── */
  var burger = document.querySelector('.burger');
  var panel = document.getElementById('panel');
  if (burger && panel) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      panel.hidden = !open;
    };
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────
     Sections, register rows and figures fade up once. The register's
     scent-weight bars draw themselves from the same trigger, so the
     datum arrives with the row rather than before it. */
  var targets = document.querySelectorAll(
    '.sec__head, .house__copy, .house__fig, .rec li, .reg__r, .rail li,' +
    '.trade__fig, .trade__copy, .enq__copy, .form, .hero__in > *'
  );
  Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
  } else {
    /* The root is extended far above the viewport so that anything at or
       above the fold intersects the moment it is observed. Without it, an
       element already scrolled past never intersects at all and stays
       invisible for good — which is what a deep link such as /#register
       does, and the browser applies that fragment jump asynchronously, so
       there is no single moment afterwards that is safe to measure at.
       Content below the fold still waits for the bottom margin, kept small so a
       row only just in view is never stranded unrevealed. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '100000px 0px -40px 0px', threshold: 0 });

    Array.prototype.forEach.call(targets, function (el, i) {
      el.style.transitionDelay = Math.min((i % 5) * 0.06, 0.24) + 's';
      io.observe(el);
    });
  }

  /* ── Image fallback ───────────────────────────────────────────────
     Remote photography is hotlinked. If a file fails to load, hide the
     <img> and let the container's gradient stand in — the layout keeps
     its shape and nothing renders as a broken image. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-fallback] img'), function (img) {
    var fail = function () { img.style.display = 'none'; };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* Hero video. It is the hero's only picture, so it is hidden in one case
     only: the file itself cannot be fetched or decoded, which leaves the
     opening frame behind it holding the hero as a still. That error fires on
     the <source> rather than the <video>, so listen in the capture phase. */
  var vid = document.querySelector('.hero__video');
  if (vid) {
    var dropVideo = function () { vid.style.display = 'none'; };
    vid.addEventListener('error', dropVideo, true);
    if (vid.networkState === 3 /* NETWORK_NO_SOURCE */) dropVideo();

    if (reduced) {
      /* Less motion, not less picture: hold the opening frame — the same one
         the poster shows, so there is nothing to see happen. The autoplay
         attribute is left in the markup so the video still runs without JS,
         so undo it here — including any playback already begun. */
      vid.removeAttribute('autoplay');
      vid.loop = false;
      vid.addEventListener('play', function () { vid.pause(); });
      vid.pause();
    } else {
      /* Autoplay can be refused — a data saver, battery-saver mode, iOS low
         power. The frame on screen is the video's own, so keep it and start
         playback at the first interaction instead of blanking the hero. */
      var attempt = vid.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          var events = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
          var retry = function () {
            events.forEach(function (e) { document.removeEventListener(e, retry); });
            vid.play();
          };
          events.forEach(function (e) {
            document.addEventListener(e, retry, { once: true, passive: true });
          });
        });
      }
    }
  }

  /* ── Enquiry form ─────────────────────────────────────────────────
     There is no backend on a static page, so the form validates, then
     composes a mail message. The button says "Send enquiry" and the
     result is an enquiry ready to send — the same action, start to end. */
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var done = document.getElementById('formDone');

  function showError(id, show) {
    var field = document.getElementById(id);
    var msg = form.querySelector('[data-for="' + id + '"]');
    if (msg) msg.hidden = !show;
    if (field) {
      if (show) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('f-name');
    var mail = document.getElementById('f-mail');
    var okName = name.value.trim() !== '';
    var okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim());

    showError('f-name', !okName);
    showError('f-mail', !okMail);

    if (!okName) { name.focus(); return; }
    if (!okMail) { mail.focus(); return; }

    var get = function (id) { return (document.getElementById(id).value || '').trim(); };
    var body = [
      'Name: ' + get('f-name'),
      'Company: ' + (get('f-co') || '—'),
      'Email: ' + get('f-mail'),
      'Market / country: ' + (get('f-mkt') || '—'),
      'Interested in: ' + get('f-int'),
      '',
      'Details:',
      get('f-msg') || '—'
    ].join('\n');

    window.location.href =
      'mailto:incensecreators@gmail.com' +
      '?subject=' + encodeURIComponent('Enquiry from ' + get('f-name') +
        (get('f-co') ? ' — ' + get('f-co') : '')) +
      '&body=' + encodeURIComponent(body);

    if (done) {
      done.textContent = 'Your email client should open with the enquiry ready to send. ' +
        'If nothing happened, write to incensecreators@gmail.com directly.';
      done.hidden = false;
    }
  });
})();
