// Protect images from Wix JS rewriting src to CDN URLs
(function() {
  // Save original src for all images
  var imgs = document.querySelectorAll('[data-was-wow-image] img');
  var originals = new Map();
  imgs.forEach(function(img) {
    if (img.src && img.src.indexOf('_assets/') !== -1) {
      originals.set(img, img.getAttribute('src'));
    }
  });

  // Watch for src changes and revert them
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.type === 'attributes' && m.attributeName === 'src') {
        var orig = originals.get(m.target);
        if (orig && m.target.getAttribute('src') !== orig) {
          m.target.setAttribute('src', orig);
        }
      }
      // Also catch if parent tries to hide/remove
      if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'class')) {
        var el = m.target;
        if (el.tagName === 'IMG' && originals.has(el)) {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      }
    });
  });

  // Observe all image containers
  imgs.forEach(function(img) {
    observer.observe(img, { attributes: true, attributeFilter: ['src', 'srcset', 'style', 'class'] });
  });

  // Also periodically check (fallback for element replacement)
  setInterval(function() {
    originals.forEach(function(origSrc, img) {
      if (img.getAttribute('src') !== origSrc) {
        img.setAttribute('src', origSrc);
      }
      img.style.display = 'block';
      img.style.visibility = 'visible';
      img.style.opacity = '1';
    });
  }, 500);
})();
