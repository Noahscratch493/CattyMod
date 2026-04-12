(function () {
    if (window.__cattyShareHookLoaded) return;
    window.__cattyShareHookLoaded = true;

    let lastUrl = window.location.href;

    function makePopup({ title, text, subtitle, icon, singleButton }) {
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
                background: #4C97FF;
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
                if (overlay.parentNode) overlay.remove();
                resolve(value);
            }

            // ❌ X = ABORT (IMPORTANT FIX)
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

            const yesBtn = btn("Yes", "#4C97FF");
            const noBtn = btn("No", "#FF6680");

            yesBtn.onclick = () => close(true);
            noBtn.onclick = () => close(false);

            footer.appendChild(noBtn);
            footer.appendChild(yesBtn);

            dialog.appendChild(x);
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
        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!button) return;

        const span = button.querySelector(".button_content_3jdgj span");
        if (!span) return;

        if (window.location.href.includes("editor")) {
            if (span.textContent !== "Share") span.textContent = "Share";

            button.href = "#";
            button.target = "";

            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener("click", async (e) => {
                e.preventDefault();

                const publish = await makePopup({
                    title: "Publish project",
                    text: "Are you sure you want to publish your project?",
                    icon: "https://cattymod.app/assets/dango/publish.svg"
                });

                if (publish === "close") return; // STOP EVERYTHING
                if (!publish) return;

                const shouldDownload = await makePopup({
                    title: "Download project",
                    text: "Do you want to download your project file?",
                    subtitle:
                        "We ask you incase you've already downloaded it ready for uploading",
                    icon: "https://cattymod.app/assets/box.png"
                });

                if (shouldDownload === "close") return; // STOP EVERYTHING

                if (shouldDownload) {
                    const data = await vm.saveProjectSb3();

                    const blob = new Blob([data], { type: "application/zip" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "project.sb3";
                    a.click();

                    URL.revokeObjectURL(url);
                }

                window.open(
                    "https://cattymod.app/explore/upload",
                    "_blank"
                );

                setTimeout(() => {
                    makePopup({
                        title: "Finished!",
                        text: "We opened the upload page in a new tab!",
                        subtitle: "We can't wait to see your project!",
                        icon: "https://cattymod.app/assets/dango/blocks.svg",
                        singleButton: true
                    });
                }, 300);
            });

        } else {
            if (span.textContent !== "Explore") span.textContent = "Explore";

            button.href = "https://cattymod.app/explore";

            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        }
    }

    const observer = new MutationObserver(updateButton);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            updateButton();
        }
    }, 1000);
})();
