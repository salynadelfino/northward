/* Northward Care — motion and navigation.
   Everything here degrades to a plain, fully-visible page: content is only
   ever hidden while JS is running, IntersectionObserver exists, and the
   viewer has not asked for reduced motion. A failsafe reveals it regardless. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- land at the top of every page ----------------------------------
     history.scrollRestoration is set in the inline head script so it is in
     force before the browser can restore anything. This then forces the top
     on each of the moments a stale offset can survive: script run, load, and
     a back-navigation out of the bfcache. When the site is embedded (a
     preview iframe), the surrounding page owns the scroll — asking the
     document to scroll itself into view is the one request that reaches an
     ancestor frame, so we do that too. */
  function toTop() {
    if (location.hash) return;
    try { window.scrollTo(0, 0); } catch (err) {}
    if (window.self !== window.top) {
      try { document.documentElement.scrollIntoView({ block: 'start' }); } catch (err) {}
    }
  }
  toTop();
  window.addEventListener('load', toTop);
  window.addEventListener('pageshow', toTop);

  /* ---- scroll reveal --------------------------------------------------- */
  var GRIDS = '.stages,.works,.pathway,.tenets,.faq,.field-grid';
  var items = [];

  document.querySelectorAll('main > section:not(.hero):not(.hero-sub) > .wrap')
    .forEach(function (wrap) {
      [].forEach.call(wrap.children, function (child) {
        // Stagger a grid's cards rather than fading the whole block at once.
        var target = child.matches(GRIDS) ? [].slice.call(child.children) : [child];
        target.forEach(function (el) { items.push(el); });
      });
    });

  items.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.setProperty('--d', (i % 6) * 65 + 'ms');
  });

  function revealAll() {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.04 });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 1400);   // failsafe — nothing stays hidden
  }

  /* ---- page transitions ------------------------------------------------ */
  if (reduce) return;

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var a = e.target.closest('a');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;

    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (/^[a-z]+:/i.test(href)) return;                 // mailto:, tel:, http(s):
    if (!/(^\.\/$|\.html($|[?#]))/.test(href)) return;   // internal pages only

    e.preventDefault();
    root.classList.add('leaving');
    setTimeout(function () { location.href = href; }, 220);
  });

  // Returning through the bfcache must not land on a faded-out page.
  window.addEventListener('pageshow', function () { root.classList.remove('leaving'); });

})();
