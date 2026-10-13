/* =====================================================================
   PRELOADER · the curtain is pure CSS (always clears). JS only holds the
   hero entrance until the curtain lifts, then removes the node.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, root = document.documentElement, el = RM.$('.preload');
  var skip = root.classList.contains('no-preload') || !el;
  var queue = [], done = skip;
  var HOLD = 1200, LIFT = 1100;                 /* --d-preload, --d-wipe */

  RM.afterPreload = function (cb) { if (done) requestAnimationFrame(cb); else queue.push(cb); };

  function release() {
    if (done) return; done = true;
    queue.splice(0).forEach(function (cb) { cb(); });
  }
  if (skip) return;
  /* start the hero as the curtain passes the middle of the screen */
  setTimeout(release, HOLD + LIFT * 0.45);
  setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, HOLD + LIFT + 100);
})();
