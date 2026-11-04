// Підключається в <head> до відображення сторінки: позначає, що JS працює,
// щоб анімації появи не ховали контент, якщо скрипти вимкнені.
(function () {
    var html = document.documentElement;
    html.classList.replace('no-js', 'js');

    // Запобіжник: якщо main.js не завантажився, показуємо весь контент.
    window.setTimeout(function () {
        if (!html.classList.contains('main-ready')) html.classList.add('no-reveal');
    }, 2500);
})();
