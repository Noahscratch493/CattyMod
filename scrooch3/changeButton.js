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
                    line-height: 1.3;
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

            function makeButton(label, color) {
                const btn = document.createElement("button");
                btn.textContent = label;
                btn.style = `
                    padding: 6px 14px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: bold;
                    color: white;
                    background: ${color};
                    box-shadow: 0 2px 0 rgba(0,0,0,0.2);
                `;
                return btn;
            }

            function close(value) {
                if (overlay.parentNode) overlay.remove();
                resolve(value);
            }

            // ALWAYS SAFE CLOSE (IMPORTANT FIX)
            const closeBtn = document.createElement("div");
            closeBtn.textContent = "✕";
            closeBtn.style = `
                position: absolute;
                top: 6px;
                right: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                color: white;
                user-select: none;
            `;
            closeBtn.onclick = () => close(false);

            footer.appendChild(closeBtn);

            if (singleButton) {
                const closeOnly = makeButton("Close", "#4C97FF");
                closeOnly.onclick = () => close(true);
                footer.appendChild(closeOnly);
            } else {
                const yesBtn = makeButton("Yes", "#4C97FF");
                const noBtn = makeButton("No", "#FF6680");

                yesBtn.onclick = () => close(true);
                noBtn.onclick = () => close(false);

                footer.appendChild(noBtn);
                footer.appendChild(yesBtn);
            }

            dialog.appendChild(closeBtn);
            dialog.appendChild(header);
            dialog.appendChild(body);
            dialog.appendChild(footer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // click outside ALWAYS closes safely
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) close(false);
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

                if (!publish) return;

                const shouldDownload = await makePopup({
                    title: "Download project",
                    text: "Do you want to download your project file?",
                    subtitle:
                        "We ask you incase you've already downloaded it ready for uploading",
                    icon: "https://cattymod.app/assets/box.png"
                });

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
