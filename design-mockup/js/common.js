/* clgosu-web common.js
   - Topbar 뒤로가기
   - 하단 탭바: 활성 탭 재탭 시 최상단으로 스크롤
   - Pull-to-Refresh
*/
(function () {

    /* ─── Back Button ───────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {
        var btnBack = document.getElementById('btnBack');
        if (btnBack) {
            btnBack.addEventListener('click', function () {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/main';
                }
            });
        }

        /* ─── Tab Bar : 활성 탭 재탭 → 최상단 스크롤 ─── */
        var tabs = document.querySelectorAll('.tabbar__item');
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function (e) {
                try {
                    var tabPath = new URL(tab.href).pathname;
                    if (tabPath === window.location.pathname) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                } catch (err) {}
            });
        });
    });

    /* ─── Pull-to-Refresh ───────────────────────────── */
    var ptr = null;
    var ptrText = null;
    var startY = 0;
    var currentY = 0;
    var isPulling = false;
    var isRefreshing = false;
    var THRESHOLD = 70;

    document.addEventListener('DOMContentLoaded', function () {
        ptr = document.getElementById('ptr');
        if (ptr) ptrText = ptr.querySelector('.ptr__text');
    });

    document.addEventListener('touchstart', function (e) {
        if (!ptr || isRefreshing) return;
        if (window.scrollY > 0) return;
        if (document.body.style.overflow === 'hidden') return; // 모달 열려있을 때 차단
        startY = e.touches[0].clientY;
        currentY = startY;
        isPulling = true;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (!ptr || !isPulling || isRefreshing) return;
        currentY = e.touches[0].clientY;
        var diff = currentY - startY;
        if (diff > 10) {
            ptr.classList.add('ptr--visible');
            ptrText.textContent = diff > THRESHOLD ? '놓으면 새로고침' : '당겨서 새로고침';
        } else {
            ptr.classList.remove('ptr--visible');
        }
    }, { passive: true });

    document.addEventListener('touchend', function () {
        if (!ptr || !isPulling || isRefreshing) return;
        var diff = currentY - startY;
        isPulling = false;

        if (diff > THRESHOLD) {
            isRefreshing = true;
            ptr.classList.add('ptr--refreshing');
            ptrText.textContent = '새로고침 중...';
            setTimeout(function () { window.location.reload(); }, 300);
        } else {
            ptr.classList.remove('ptr--visible');
        }
    });
})();
