/*
 * Рух на лендінгу — лише прикраса. Скрипт вмикає клас `motion` на <html> і
 * позначає розділ `is-in`, коли той доїхав до екрана; усі анімації в style.css
 * прив'язані до цих двох класів. Без скрипта (чи з «менше руху» в системі)
 * сторінка просто стоїть у кінцевому стані — нічого не ховається.
 */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion');
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );
  function start() {
    document.querySelectorAll('[data-section]').forEach(function (section) {
      observer.observe(section);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
