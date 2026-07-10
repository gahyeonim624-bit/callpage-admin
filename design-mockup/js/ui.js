/* clgosu-web ui.js
   공통 안내 UI 모듈 — 모든 페이지에서 window.UI 로 호출
   ──────────────────────────────────────────────────────
   UI.toast(message, opts)         → 떴다 사라지는 토스트
   UI.alert(message, opts)         → 확인 버튼만 있는 모달   (returns Promise<true>)
   UI.confirm(message, opts)       → 확인/취소 모달          (returns Promise<boolean>)

   opts:
     - type      : 'info' | 'success' | 'warning' | 'error'   (default 'info')
     - title     : 모달 제목                                  (alert 'default '안내', confirm default '확인')
     - okText    : 확인 버튼 텍스트                           (default '확인')
     - cancelText: 취소 버튼 텍스트 (confirm only)            (default '취소')
     - duration  : 토스트 노출 시간(ms)                        (default 2000)
*/
(function () {

    var ICONS = {
        info:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
        success: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12.5l3 3 5-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v5M12 18h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
        error:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
        headset: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 00-9 9v3a3 3 0 003 3h1v-6H6v-1a6 6 0 0112 0v1h-1v6h1a3 3 0 003-3v-3a9 9 0 00-9-9z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 18c0 1.657 1.343 3 3 3s3-1.343 3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
        phone:   '<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
    };

    /* ─── Modal ─────────────────────────────────────── */
    var $modal, $modalIcon, $modalTitle, $modalMsg, $modalActions;
    var modalResolve = null;

    function initModal() {
        $modal        = document.getElementById('appModal');
        $modalIcon    = document.getElementById('appModalIcon');
        $modalTitle   = document.getElementById('appModalTitle');
        $modalMsg     = document.getElementById('appModalMsg');
        $modalActions = document.getElementById('appModalActions');
        if (!$modal) return;

        var bd = $modal.querySelector('[data-modal-close]');
        if (bd) bd.addEventListener('click', function () { closeModal(false); });
    }

    function showModal(opts) {
        if (!$modal) initModal();
        if (!$modal) return Promise.resolve(false);

        opts = opts || {};
        var type       = opts.type    || 'info';
        var title      = opts.title   || (opts.showCancel ? '확인' : '안내');
        var msg        = opts.message || '';
        var okText     = opts.okText  || '확인';
        var cancelText = opts.cancelText || '취소';
        var showCancel = !!opts.showCancel;

        $modalIcon.className = 'modal__icon modal__icon--' + type;
        $modalIcon.innerHTML = ICONS[type] || ICONS.info;

        $modalTitle.textContent = title;
        $modalMsg.textContent   = msg;

        $modalActions.innerHTML = '';
        if (showCancel) {
            var btnC = document.createElement('button');
            btnC.type = 'button';
            btnC.className = 'btn btn--outline';
            btnC.textContent = cancelText;
            btnC.addEventListener('click', function () { closeModal(false); });
            $modalActions.appendChild(btnC);
        }
        var btnOk = document.createElement('button');
        btnOk.type = 'button';
        btnOk.className = 'btn';
        btnOk.textContent = okText;
        btnOk.addEventListener('click', function () { closeModal(true); });
        $modalActions.appendChild(btnOk);

        $modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        return new Promise(function (resolve) { modalResolve = resolve; });
    }

    function closeModal(result) {
        if (!$modal) return;
        $modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (modalResolve) {
            modalResolve(result);
            modalResolve = null;
        }
    }

    /* ─── Toast ─────────────────────────────────────── */
    var $toast, $toastIcon, $toastMsg;
    var toastTimer = null;

    function initToast() {
        $toast     = document.getElementById('appToast');
        $toastIcon = document.getElementById('appToastIcon');
        $toastMsg  = document.getElementById('appToastMsg');
    }

    function showToast(message, opts) {
        if (!$toast) initToast();
        if (!$toast) return;

        opts = opts || {};
        var type     = opts.type     || 'info';
        var duration = opts.duration || 2000;

        $toast.className     = 'toast toast--' + type;
        $toastIcon.innerHTML = ICONS[type] || ICONS.info;
        $toastMsg.textContent = message || '';

        $toast.setAttribute('aria-hidden', 'false');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            $toast.setAttribute('aria-hidden', 'true');
        }, duration);
    }

    /* ─── Selector (Bottom Sheet) ─────────────────────
       UI.selector({
         title, items: [{value, label}], value, searchPlaceholder
       })  →  Promise<value | null>
    */
    var $sel, $selTitle, $selSearch, $selList;
    var selectorResolve = null;
    var selectorItems = [];
    var selectorCurrent = null;

    function initSelector() {
        $sel       = document.getElementById('appSelector');
        $selTitle  = document.getElementById('appSelectorTitle');
        $selSearch = document.getElementById('appSelectorSearch');
        $selList   = document.getElementById('appSelectorList');
        if (!$sel) return;

        $selSearch.addEventListener('input', function (e) {
            renderSelectorList(e.target.value);
        });

        $sel.querySelectorAll('[data-selector-close]').forEach(function (el) {
            el.addEventListener('click', function () { closeSelector(null); });
        });
    }

    function renderSelectorList(filterText) {
        var f = (filterText || '').trim().toLowerCase();
        var visible = selectorItems.filter(function (it) {
            if (!f) return true;
            return String(it.label).toLowerCase().indexOf(f) !== -1;
        });

        $selList.innerHTML = '';

        if (visible.length === 0) {
            var empty = document.createElement('li');
            empty.className = 'selector__empty';
            empty.textContent = '검색 결과가 없어요';
            $selList.appendChild(empty);
            return;
        }

        visible.forEach(function (it) {
            var li = document.createElement('li');
            li.className = 'selector__item';
            if (String(it.value) === String(selectorCurrent)) {
                li.classList.add('selector__item--active');
            }
            var span = document.createElement('span');
            span.className = 'selector__item-text';
            span.textContent = it.label;
            var check = document.createElement('span');
            check.className = 'selector__item-check';
            check.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            li.appendChild(span);
            li.appendChild(check);
            li.addEventListener('click', function () { closeSelector(it.value); });
            $selList.appendChild(li);
        });
    }

    function showSelector(opts) {
        if (!$sel) initSelector();
        if (!$sel) return Promise.resolve(null);

        opts = opts || {};
        selectorItems = opts.items || [];
        selectorCurrent = opts.value != null ? String(opts.value) : null;

        $selTitle.textContent = opts.title || '선택';
        $selSearch.placeholder = opts.searchPlaceholder || '검색';
        $selSearch.value = '';
        renderSelectorList('');

        $sel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        return new Promise(function (resolve) { selectorResolve = resolve; });
    }

    function closeSelector(value) {
        if (!$sel) return;
        $sel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (selectorResolve) {
            selectorResolve(value);
            selectorResolve = null;
        }
    }

    /* ─── Public API ────────────────────────────────── */
    window.UI = {
        toast: function (message, opts) {
            showToast(message, opts);
        },
        alert: function (message, opts) {
            opts = opts || {};
            opts.message = message;
            opts.showCancel = false;
            return showModal(opts);
        },
        confirm: function (message, opts) {
            opts = opts || {};
            opts.message = message;
            opts.showCancel = true;
            return showModal(opts);
        },
        selector: function (opts) {
            return showSelector(opts);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        initModal();
        initToast();
        initSelector();
    });
})();
