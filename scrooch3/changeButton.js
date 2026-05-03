(function () {
    if (window.__cattyShareHookLoaded) return;
    window.__cattyShareHookLoaded = true;

    let lastUrl = window.location.href;

    /* ---------------- SAFE WAIT ---------------- */

    function onReady(fn) {
        const check = setInterval(() => {
            const menu = document.querySelector(".menu-bar_menu-bar-item_oLDa-");
            const body = document.body;

            if (menu && body) {
                clearInterval(check);
                fn();
            }
        }, 300);
    }

    /* ---------------- COOKIE ---------------- */

    function getCookie(name) {
        try {
            const v = `; ${document.cookie}`;
            const parts = v.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        } catch (e) {}
        return null;
    }

    /* ---------------- POPUP (UNCHANGED) ---------------- */

    function makePopup({ title, text, subtitle, icon, type = "confirm" }) {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.style = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
            `;

            const dialog = document.createElement("div");
            dialog.style = `
                width: 320px;
                background: #ffffff;
                border-radius: 12px;
                border: 2px solid #d9d9d9;
                box-shadow: 0 6px 0 rgba(0,0,0,0.15);
                font-family: Helvetica, Arial, sans-serif;
                overflow: hidden;
                position: relative;
            `;

            const header = document.createElement("div");
            header.style = `
                background: #009CCC;
                color: white;
                padding: 10px 12px;
                font-size: 14px;
                font-weight: bold;
            `;
            header.textContent = title;

            const body = document.createElement("div");
            body.style = `
                padding: 16px;
                font-size: 14px;
                color: #333;
                text-align: center;
            `;

            const iconEl = document.createElement("img");
            iconEl.src = icon;
            iconEl.style = "width:96px;height:96px;margin-bottom:12px;";

            body.appendChild(iconEl);
            body.appendChild(document.createTextNode(text));

            const footer = document.createElement("div");
            footer.style = `
                display:flex;
                justify-content:flex-end;
                gap:10px;
                padding:12px;
                background:#f2f2f2;
            `;

            function btn(label, color) {
                const b = document.createElement("button");
                b.textContent = label;
                b.style = `
                    padding:6px 14px;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                    font-size:13px;
                    font-weight:bold;
                    color:white;
                    background:${color};
                `;
                return b;
            }

            function close(v) {
                overlay.remove();
                resolve(v);
            }

            const x = document.createElement("div");
            x.textContent = "✕";
            x.style = "position:absolute;top:6px;right:10px;cursor:pointer;color:white;";
            x.onclick = () => close("close");
            dialog.appendChild(x);

            if (type === "info") {
                const c = btn("Close", "#009CCC");
                c.onclick = () => close(true);
                footer.appendChild(c);
            } else {
                const y = btn("Yes", "#009CCC");
                const n = btn("No", "#FF6680");
                y.onclick = () => close(true);
                n.onclick = () => close(false);
                footer.appendChild(n);
                footer.appendChild(y);
            }

            dialog.appendChild(header);
            dialog.appendChild(body);
            dialog.appendChild(footer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
        });
    }

    /* ---------------- MENU FIX (SAFE CLONE) ---------------- */

    function patchMenu() {
        try {
            const items = document.querySelectorAll(
                ".menu-bar_menu-bar-item_oLDa-.menu-bar_hoverable_c6WFB"
            );

            items.forEach(el => {
                const span = el.querySelector("span");
                if (!span) return;

                if (span.textContent.trim() === "Addons") {

                    span.textContent = "Settings";
                    el.removeAttribute("href");

                    const clone = el.cloneNode(true);
                    el.parentNode.replaceChild(clone, el);

                    clone.style.cursor = "pointer";

                    clone.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        window.open(
                            "https://studio.cattymod.app/settings.html",
                            "_blank",
                            "noopener,noreferrer"
                        );
                    };
                }
            });
        } catch (e) {}
    }

    /* ---------------- FEEDBACK COLOR ---------------- */

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

    /* ---------------- SHARE BUTTON ---------------- */

    function updateButton() {
        try {
            const button = document.querySelector('a.menu-bar_feedback-link_1BnAR');
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

    /* ---------------- START ONLY WHEN SAFE ---------------- */

    onReady(() => {

        patchMenu();
        updateButton();
        applyNavColourToFeedback();

        const observer = new MutationObserver(() => {
            patchMenu();
            updateButton();
            applyNavColourToFeedback();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                patchMenu();
                updateButton();
                applyNavColourToFeedback();
            }
        }, 1000);
    });

})();
