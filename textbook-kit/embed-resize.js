/* Heart Conduction Lab: fit each embed iframe to its content.
   Include once per page (after the iframes, or with `defer`). Each embed posts
   { type: 'hcl:resize', id, height } to its parent; this sets that iframe's height.
   Only iframes marked with the data-hcl attribute are resized. ES5 on purpose. */
(function () {
  if (window.__hclResize) return;
  window.__hclResize = true;
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'hcl:resize' || typeof d.height !== 'number') return;
    var frames = document.querySelectorAll('iframe[data-hcl]');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) {
        frames[i].style.height = Math.max(120, Math.min(Math.ceil(d.height), 4000)) + 'px';
        return;
      }
    }
  });
})();
