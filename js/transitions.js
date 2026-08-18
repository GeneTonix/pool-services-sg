/* ============================================
   ORIONT — PAGE TRANSITIONS (JS)
   Drop-in. Load AFTER js/main.js on every page.

   Safe by design:
   - the arrival animation is pure CSS, so a JS failure
     never leaves the page covered
   - a watchdog navigates anyway if the animation stalls
   - back/forward cache is handled, so returning to a
     page never shows a stuck panel
   ============================================ */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var OUT = 420;                       // must match --pt-out
  var PAGES = ['index.html','about.html','services.html','shop.html','contact.html'];

  /* ---------- build the panel ---------- */
  var veil = document.createElement('div');
  veil.className = 'pt-veil';
  veil.setAttribute('aria-hidden','true');
  veil.innerHTML =
    '<svg class="pt-crest" viewBox="0 0 1440 90" preserveAspectRatio="none">' +
      '<path d="M0,58 C180,14 360,14 540,50 C720,86 900,86 1080,50 C1260,14 1350,14 1440,40 L1440,90 L0,90 Z"/>' +
    '</svg>' +
    '<div class="pt-fill"></div>' +
    '<div class="pt-mark">ORIONT</div>';
  document.documentElement.classList.add('pt-enter');

  function mount(){
    if (!document.body.contains(veil)) document.body.appendChild(veil);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  /* ---------- decide whether a click should transition ---------- */
  function internal(a){
    if (!a) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return false;                 // in-page anchor
    if (/^(mailto:|tel:|javascript:|sms:|whatsapp:)/i.test(href)) return false;
    var url;
    try { url = new URL(href, location.href); } catch(e){ return false; }
    if (url.origin !== location.origin) return false;                  // external
    // same page, different hash -> let the browser scroll
    if (url.pathname === location.pathname && url.hash) return false;
    var file = url.pathname.split('/').pop() || 'index.html';
    return PAGES.indexOf(file) !== -1;
  }

  var leaving = false;

  document.addEventListener('click', function (e) {
    if (leaving) return;
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;  // new-tab clicks
    var a = e.target.closest && e.target.closest('a[href]');
    if (!internal(a)) return;

    e.preventDefault();
    leaving = true;
    document.documentElement.classList.add('pt-leaving');

    var dest = a.href;
    mount();
    veil.classList.remove('pt-enter');
    veil.classList.add('pt-cover');
    // force a reflow so the transition runs from translateY(100%)
    void veil.offsetHeight;
    veil.classList.add('pt-go');

    var done = false;
    function go(){ if (done) return; done = true; location.href = dest; }
    veil.addEventListener('transitionend', go, { once: true });
    setTimeout(go, OUT + 120);          // watchdog: never wait on a stalled animation
  }, false);

  /* ---------- returning via back/forward ---------- */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;           // restored from bfcache
    leaving = false;
    document.documentElement.classList.remove('pt-leaving');
    veil.classList.remove('pt-cover','pt-go');
    // replay the reveal so the page isn't left under the panel
    veil.style.animation = 'none';
    void veil.offsetHeight;
    veil.style.animation = '';
  });
})();
