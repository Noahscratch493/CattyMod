(function () {
    if (window.__cattyExploreHookLoaded) return;
    window.__cattyExploreHookLoaded = true;

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
            iconEl.src = icon || "";
            iconEl.style = `
                width: 96px;
                height: 96px;
                margin-bottom: 12px;
            `;

            const textEl = document.createElement("div");
            textEl.textContent = text;

            body.appendChild(iconEl);
            body.appendChild(textEl);

            if (subtitle) {
                const subEl = document.createElement("div");
                subEl.textContent = subtitle;
                subEl.style = `
                    margin-top: 8px;
                    font-size: 12px;
                    color: #888;
                `;
                body.appendChild(subEl);
            }

            const footer = document.createElement("div");
            footer.style = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 12px;
                background: #f2f2f2;
                border-top: 1px solid #ddd;
            `;

            function btn(label, color) {
                const b = document.createElement("button");
                b.textContent = label;
                b.style = `
                    padding: 6px 14px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: bold;
                    color: white;
                    background: ${color};
                `;
                return b;
            }

            function close(value) {
                overlay.remove();
                resolve(value);
            }

            const x = document.createElement("div");
            x.textContent = "✕";
            x.style = `
                position: absolute;
                top: 6px;
                right: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                color: white;
                user-select: none;
            `;
            x.onclick = () => close("close");

            dialog.appendChild(x);

            const yesBtn = btn("Yes", "#009CCC");
            const noBtn = btn("No", "#FF6680");

            yesBtn.onclick = () => close(true);
            noBtn.onclick = () => close(false);

            footer.appendChild(noBtn);
            footer.appendChild(yesBtn);

            dialog.appendChild(header);
            dialog.appendChild(body);
            dialog.appendChild(footer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) close("close");
            });
        });
    }

    function updateButton() {
        const links = document.querySelectorAll(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );

        links.forEach(link => {
            link.href = "https://scratch.mit.edu/explore";

            const span = link.querySelector(".button_content_3jdgj span");
            if (span) span.textContent = "Explore";

            if (link.dataset.cattyBound) return;
            link.dataset.cattyBound = "true";

            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener("click", async (e) => {
                e.preventDefault();

                const res = await makePopup({
                    title: "Leaving CattyMod",
                    text: "You're leaving CattyMod.",
                    subtitle:
                        "Tip: Replace scratch.mit.edu with cattymod.app in project URLs to use CattyMod.",
                    icon: "https://cattymod.app/assets/dango/blocks.svg",
                    type: "confirm"
                });

                if (res === true) {
                    window.location.href = "https://scratch.mit.edu/explore";
                }
            });
        });
    }

    updateButton();

    const observer = new MutationObserver(updateButton);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
