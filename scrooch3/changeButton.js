(function () {
    if (window.__cattyShareHookLoaded) return;
    window.__cattyShareHookLoaded = true;

    let lastUrl = location.href;

    /* ---------------- SAFE COOKIE ---------------- */

    function getCookie(name) {
        try {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        } catch (e) {}
        return null;
    }

    /* ---------------- SAFE FEEDBACK COLOR ---------------- */

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

    /* ---------------- SAFE MENU PATCH ---------------- */

    function patchMenu() {
        try {
            const items = document.querySelectorAll(
                ".menu-bar_menu-bar-item_oLDa-.menu-bar_hoverable_c6WFB"
            );

            items.forEach(el => {
                const span = el.querySelector("span");
                if (!span) return;

                if (span.textContent.trim() !== "Addons") return;

                span.textContent = "Settings";

                const clone = el.cloneNode(true);
                el.parentNode.replaceChild(clone, el);

                clone.style.cursor = "pointer";

                clone.onclick = (e) => {
                    try {
                        e.preventDefault();
                        e.stopPropagation();

                        window.open(
                            "https://studio.cattymod.app/settings.html",
                            "_blank",
                            "noopener,noreferrer"
                        );
                    } catch (err) {}
                };
            });
        } catch (e) {}
    }

    /* ---------------- SAFE SHARE PATCH ---------------- */

    function updateButton() {
        try {
            const button = document.querySelector(
                'a.menu-bar_feedback-link_1BnAR'
            );
            if (!button) return;

            const span = button.querySelector("span");
            if (!span) return;

            if (location.href.includes("editor")) {
                span.textContent = "Share";
            } else {
                span.textContent = "Explore";
            }
        } catch (e) {}
    }

    /* ---------------- SAFE RUNNER ---------------- */

    function run() {
        patchMenu();
        updateButton();
        applyNavColourToFeedback();
    }

    /* ---------------- WAIT FOR SCRATCH UI ---------------- */

    function waitForUI() {
        const check = setInterval(() => {
            const menu = document.querySelector(
                ".menu-bar_menu-bar-item_oLDa-"
            );

            if (menu) {
                clearInterval(check);
                run();
                startObserver();
            }
        }, 300);
    }

    /* ---------------- OBSERVER (SAFE) ---------------- */

    function startObserver() {
        try {
            const observer = new MutationObserver(() => {
                run();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setInterval(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    run();
                }
            }, 1000);
        } catch (e) {}
    }

    /* ---------------- START ONLY WHEN READY ---------------- */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", waitForUI);
    } else {
        waitForUI();
    }

})();
