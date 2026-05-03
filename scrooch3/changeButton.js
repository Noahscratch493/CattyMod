(function () {
    if (window.__cattyShareHookLoaded) return;
    window.__cattyShareHookLoaded = true;

    let lastUrl = window.location.href;

    /* ---------------- COOKIE ---------------- */

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    /* ---------------- POPUP SYSTEM (UNCHANGED CORE) ---------------- */

    function makePopup({ title, text, subtitle, icon, type = "confirm" }) {
        return new Promise((resolve) => {
            const overlay = document.createElement("div");
            overlay.style = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:999999;
            `;

            const dialog = document.createElement("div");
            dialog.style = `
                width:320px;
                background:#fff;
                border-radius:12px;
                font-family:Arial;
                overflow:hidden;
                position:relative;
            `;

            const header = document.createElement("div");
            header.style = `
                background:#009CCC;
                color:white;
                padding:10px;
                font-weight:bold;
            `;
            header.textContent = title;

            const body = document.createElement("div");
            body.style = `padding:16px;text-align:center;font-size:14px;color:#333;`;

            const iconEl = document.createElement("img");
            iconEl.src = icon;
            iconEl.style = "width:96px;height:96px;margin-bottom:10px;";

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
                    padding:6px 12px;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                    color:white;
                    background:${color};
                    font-weight:bold;
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

    /* ---------------- MENU PATCH (ADDONS → SETTINGS FIX) ---------------- */

    function patchMenu() {
        const items = document.querySelectorAll(
            ".menu-bar_menu-bar-item_oLDa-.menu-bar_hoverable_c6WFB"
        );

        items.forEach(el => {
            const span = el.querySelector("span");
            if (!span) return;

            const text = span.textContent.trim();

            if (text === "Addons") {

                span.textContent = "Settings";
                el.removeAttribute("href");

                const clone = el.cloneNode(true);
                el.parentNode.replaceChild(clone, el);

                clone.style.cursor = "pointer";

                clone.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    window.open(
                        "https://studio.cattymod.app/settings.html",
                        "_blank",
                        "noopener,noreferrer"
                    );
                });
            }
        });
    }

    /* ---------------- FEEDBACK COLOR FIX ---------------- */

    function applyNavColourToFeedback() {
        const color = getCookie("NavColour");
        if (!color) return;

        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR'
        );
        if (!button) return;

        const span = button.querySelector("span");
        if (!span) return;

        span.style.color = color;
    }

    /* ---------------- SHARE BUTTON ---------------- */

    function updateButton() {
        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!button) return;

        const span = button.querySelector("span");
        if (!span) return;

        if (window.location.href.includes("editor")) {
            span.textContent = "Share";

            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);

            clone.addEventListener("click", async (e) => {
                e.preventDefault();

                const result = await makePopup({
                    title: "Publish project",
                    text: "Publish your project?",
                    icon: "https://cattymod.app/assets/dango/publish.svg"
                });

                if (!result) return;

                window.open("https://cattymod.app/explore/upload", "_blank");
            });

        } else {
            span.textContent = "Explore";
            button.href = "https://cattymod.app/explore";
        }
    }

    /* ---------------- OBSERVER ---------------- */

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
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            patchMenu();
            updateButton();
            applyNavColourToFeedback();
        }
    }, 1000);

    /* INIT */
    patchMenu();
    updateButton();
    applyNavColourToFeedback();

})();
