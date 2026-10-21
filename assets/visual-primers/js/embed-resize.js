/* Optional companion for iframes carrying data-visual-primer-embed. */
(function () {
  window.addEventListener('message', function (event) {
    if (!event.data || event.data.type !== 'visual-primer:resize') return;
    for (const frame of document.querySelectorAll('iframe[data-visual-primer-embed]')) {
      if (event.source !== frame.contentWindow) continue;
      const expected = new URL(frame.src, document.baseURI).origin;
      if (event.origin !== expected) continue;
      const height = Number(event.data.height);
      if (!Number.isFinite(height) || height < 100 || height > 6000) continue;
      frame.style.height = Math.ceil(height) + 'px';
    }
  });
})();
