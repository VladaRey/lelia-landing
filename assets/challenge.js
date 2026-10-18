// Сторінка-запрошення до челенджу (/challenge/?k=…&s=…&b=…&m=…).
//
// Посилання приходить із застосунку Lelia: подруга ділиться челенджем, і
// тут видно, що за челендж і з якого дня, а кнопка «Відкрити в Lelia» веде
// в застосунок посиланням lelia://challenge/new з тими самими параметрами.
// Тексти — у розмітці, по одному на кожен челендж; скрипт лише показує
// потрібний і збирає посилання. Невідомий челендж — сторінка лишається
// загальною розповіддю, без кнопки в застосунок.
(function () {
  'use strict';

  var KINDS = ['ten_ten', 'capsule', 'no_buy', 'budget', 'forgotten', 'second_life'];
  var DATE = /^\d{4}-\d{2}-\d{2}$/;

  var params = new URLSearchParams(window.location.search);
  var kind = params.get('k');
  if (KINDS.indexOf(kind) === -1) return;

  var swap = function (attr) {
    document.querySelectorAll('[' + attr + ']').forEach(function (node) {
      node.hidden = node.getAttribute(attr) !== kind;
    });
  };
  swap('data-kind');
  swap('data-rule');

  var query = ['kind=' + kind];
  var start = params.get('s');
  if (start && DATE.test(start)) {
    query.push('start=' + start);
    var parts = start.split('-').map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    var lang = document.documentElement.lang || 'en';
    var label = document.querySelector('[data-start-date]');
    if (label) label.textContent = date.toLocaleDateString(lang, { day: 'numeric', month: 'long' });
    var line = document.querySelector('[data-start]');
    if (line) line.hidden = false;
  }
  var budget = Number(params.get('b'));
  if (budget > 0) query.push('budget=' + Math.round(budget));
  var months = Number(params.get('m'));
  if (months >= 1 && months <= 3) query.push('months=' + months);

  var open = document.querySelector('[data-open]');
  if (open) {
    open.href = 'lelia://challenge/new?' + query.join('&');
    open.hidden = false;
  }
})();
