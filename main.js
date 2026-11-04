(function () {
    // ---------------------------------------------------------------
    // Номер телефону. Закодований: charCode кожного символу + KEY.
    // Щоб змінити номер: у консолі браузера виконайте
    // JSON.stringify([..."+380XXXXXXXXX"].map(c => c.charCodeAt(0) + 7))
    // ---------------------------------------------------------------
    var KEY = 7;
    var CODES = [50,58,63,55,61,58,60,55,61,57,58,62,56];

    var PHONE = CODES.map(function (c) {
        return String.fromCharCode(c - KEY);
    }).join('');

    var PRETTY = PHONE.slice(0, 3) + ' (' + PHONE.slice(3, 6) + ') ' +
                 PHONE.slice(6, 9) + '-' + PHONE.slice(9, 11) + '-' +
                 PHONE.slice(11);

    function $all(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    // Посилання для дзвінка. Текст підставляється в .js-phone-text
    // (якщо є), щоб не стерти іконку поруч.
    $all('.js-phone').forEach(function (a) {
        a.href = 'tel:' + PHONE;
        var label = a.getAttribute('data-label');
        if (label) {
            var target = a.querySelector('.js-phone-text') || a;
            target.textContent = label.replace('{pretty}', PRETTY);
        }
    });

    // ---------------------------------------------------------------
    // Viber + підказка, якщо застосунок не відкрився
    // ---------------------------------------------------------------
    var box = document.getElementById('viber-fallback');
    var copyBtn = document.getElementById('copy-phone');

    $all('.js-viber').forEach(function (link) {
        link.href = 'viber://chat?number=' + encodeURIComponent(PHONE);

        if (!box) return;

        // Якщо Viber відкрився, сторінка втрачає фокус або стає прихованою.
        // Якщо ні — через 1,5 с показуємо підказку під кнопками.
        link.addEventListener('click', function () {
            var left = false;
            function markLeft() { left = true; }

            window.addEventListener('blur', markLeft, { once: true });
            document.addEventListener('visibilitychange', markLeft, { once: true });

            setTimeout(function () {
                window.removeEventListener('blur', markLeft);
                document.removeEventListener('visibilitychange', markLeft);
                if (!left) {
                    link.parentNode.insertAdjacentElement('afterend', box);
                    box.hidden = false;
                }
            }, 1500);
        });
    });

    if (copyBtn) {
        var copyLabel = copyBtn.textContent;
        var resetTimer;

        copyBtn.addEventListener('click', function () {
            function done() {
                copyBtn.textContent = 'Номер скопійовано ✓';
                clearTimeout(resetTimer);
                resetTimer = setTimeout(function () {
                    copyBtn.textContent = copyLabel;
                }, 2000);
            }
            function manual() { window.prompt('Скопіюйте номер:', PHONE); }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(PHONE).then(done, manual);
            } else {
                manual();
            }
        });
    }

    // ---------------------------------------------------------------
    // Нижня панель на телефоні: з'являється, коли кнопки першого екрана
    // та контактів не видно.
    // ---------------------------------------------------------------
    var bar = document.getElementById('mobile-bar');
    var watched = $all('[data-hide-mobile-bar]');

    function updateBar() {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var anyOnScreen = watched.some(function (el) {
            var r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < vh;
        });
        bar.classList.toggle('is-visible', !anyOnScreen);
    }

    if (bar && watched.length) {
        window.addEventListener('scroll', updateBar, { passive: true });
        window.addEventListener('resize', updateBar);
        updateBar();
    }
})();
