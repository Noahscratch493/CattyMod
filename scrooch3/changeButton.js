(function () {
    if (window.__cattyShareHookLoaded) return;
    window.__cattyShareHookLoaded = true;

    let lastUrl = location.href;

    /* ---------------- COOKIE ---------------- */

    function getCookie(name) {
        try {
            const v = `; ${document.cookie}`;
            const parts = v.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        } catch (e) {}
        return null;
    }

    /* ---------------- SAFE WAIT ---------------- */

    function onReady(fn) {
        const t = setInterval(() => {
            const menu = document.querySelector(".menu-bar_menu-bar-item_oLDa-");
            if (menu && document.body) {
                clearInterval(t);
                fn();
            }
        }, 300);
    }

    /* ---------------- FEEDBACK COLOR (SAFE ONLY STYLE) ---------------- */

    function applyNavColourToFeedback() {
        try {
            const color = getCookie("NavColour");
            if (!color) return;

            const btn = document.querySelector('a.menu-bar_feedback-link_1BnAR');
            if (!btn) return;

            const span = btn.querySelector("span");
            if (!span) return;

            span.style.color = color;
        } catch (e) {}
    }

    /* ---------------- MENU TEXT PATCH (NO REPLACEMENT) ---------------- */

    function patchMenuText() {
        try {
            const items = document.querySelectorAll(
                ".menu-bar_menu-bar-item_oLDa-.menu-bar_hoverable_c6WFB span"
            );

            items.forEach(span => {
                if (span.textContent.trim() === "Addons") {
                    span.textContent = "Settings";
                }
            });
        } catch (e) {}
    }

    /* ---------------- CLICK REDIRECT SAFE (NO DOM REPLACEMENT) ---------------- */

    function attachClickInterceptors() {
        document.body.addEventListener("click", (e) => {
            const el = e.target.closest(".menu-bar_menu-bar-item_oLDa-.menu-bar_hoverable_c6WFB");
            if (!el) return;

            const span = el.querySelector("span");
            if (!span) return;

            if (span.textContent.trim() === "Settings") {
                e.preventDefault();
                e.stopPropagation();

                window.open(
                    "https://studio.cattymod.app/settings.html",
                    "_blank",
                    "noopener,noreferrer"
                );
            }
        }, true);
    }

    /* ---------------- SHARE / EXPLORE FIX (NO CLONING) ---------------- */

    function updateButton() {
        try {
            const button = document.querySelector('a.menu-bar_feedback-link_1BnAR');
            if (!button) return;

            const span = button.querySelector("span");
            if (!span) return;

            const isEditor = location.href.includes("editor");

            if (isEditor) {
                span.textContent = "Share";
            } else {
                span.textContent = "Explore";
            }

            button.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isEditor) {
                    window.open(
                        "https://cattymod.app/explore/upload",
                        "_blank",
                        "noopener,noreferrer"
                    );
                } else {
                    window.open(
                        "https://cattymod.app/explore",
                        "_blank",
                        "noopener,noreferrer"
                    );
                }
            };

        } catch (e) {}
    }

    /* ---------------- MAIN RUNNER ---------------- */

    function run() {
        patchMenuText();
        updateButton();
        applyNavColourToFeedback();
    }

    /* ---------------- INIT ---------------- */

    onReady(() => {
        run();
        attachClickInterceptors();

        const obs = new MutationObserver(() => {
            run();
        });

        obs.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                run();
            }
        }, 1000);
    });

})();
