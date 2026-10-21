/* Report the intrinsic figure height to an optional embedding page. */
(function () {
  const root = document.querySelector('.visual-primer');
  if (!root || window.parent === window) return;
  let lastHeight = 0;
  let target = window.location.origin;
  try { if (document.referrer) target = new URL(document.referrer).origin; } catch (_) {}
  function report() {
    const height = Math.ceil(root.getBoundingClientRect().height + 32);
    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({type: 'visual-primer:resize', height}, target === 'null' ? '*' : target);
  }
  if ('ResizeObserver' in window) new ResizeObserver(report).observe(root);
  window.addEventListener('load', report);
  document.fonts.ready.then(report);
  report();
})();
