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
  // Тло, що перетікає: запам'ятати власний колір кожного розділу, зробити
  // розділи прозорими й фарбувати <body> кольором того, що на середині екрана.
  var bodyBg = '';
  var painter = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        document.body.style.setProperty('--scroll-bg', entry.target.getAttribute('data-bg') || bodyBg);
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );
  function start() {
    var sections = document.querySelectorAll('[data-section]');
    bodyBg = getComputedStyle(document.body).backgroundColor;
    sections.forEach(function (section) {
      var bg = getComputedStyle(section).backgroundColor;
      section.setAttribute('data-bg', bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' ? bodyBg : bg);
    });
    document.documentElement.classList.add('bgscroll');
    sections.forEach(function (section) {
      observer.observe(section);
      painter.observe(section);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/*
 * Карусель кроків «Як почати» на телефоні: гортається пальцем (scroll-snap),
 * а крапки під нею показують, який крок зараз, і перемикають по дотику.
 * Працює й без руху — це навігація, а не прикраса.
 */
(function () {
  function init() {
    var list = document.querySelector('.start');
    var dots = document.querySelectorAll('.start__dots button');
    if (!list || !dots.length) return;
    var steps = list.querySelectorAll('.start__step');
    list.classList.add('start--js');
    function current() {
      var mid = list.scrollLeft + list.clientWidth / 2, best = 0, dist = Infinity;
      steps.forEach(function (step, i) {
        var d = Math.abs(step.offsetLeft + step.offsetWidth / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    }
    function paint() {
      var i = current();
      steps.forEach(function (step, k) { step.classList.toggle('is-current', k === i); });
      dots.forEach(function (dot, k) { dot.classList.toggle('is-on', k === i); });
    }
    var raf = 0;
    list.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; paint(); });
    }, { passive: true });
    dots.forEach(function (dot, k) {
      dot.addEventListener('click', function () {
        var step = steps[k];
        list.scrollTo({ left: step.offsetLeft - (list.clientWidth - step.offsetWidth) / 2, behavior: 'smooth' });
      });
    });
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
