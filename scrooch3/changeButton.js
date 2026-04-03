(function () {
    let lastUrl = "";

    function updateButton() {
        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!button) return;

        const span = button.querySelector(".button_content_3jdgj span");
        if (!span) return;

        if (window.location.href.includes("editor")) {
            // Editor → Share to Community
            if (span.textContent !== "Share") span.textContent = "Share";

            button.href = "#";
            button.target = "";

            // Remove existing click handlers
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener("click", async (e) => {
                e.preventDefault();

                // Save project as SB3
                const data = await vm.saveProjectSb3();
                const blob = new Blob([data], { type: "application/zip" });

                // Convert to base64 for postMessage
                const arrayBuffer = await blob.arrayBuffer();
                const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

                // Send to explore site via postMessage
                // Assumes cattymod-explore.lovable.app is embedded in an iframe
                const exploreIframe = document.querySelector(
                    'iframe[src*="cattymod-explore.lovable.app"]'
                );

                if (exploreIframe?.contentWindow) {
                    exploreIframe.contentWindow.postMessage(
                        { action: "receiveSB3", data: base64, name: "project.sb3" },
                        "https://cattymod-explore.lovable.app"
                    );
                } else {
                    // Fallback: open Explore in new tab with alert
                    window.open("https://cattymod-explore.lovable.app/explore/upload", "_blank");
                    alert("Explore site not detected. Opened in new tab.");
                }
            });
        } else {
            // Not editor → Homepage
            if (span.textContent !== "Explore") span.textContent = "Explore";

            button.href = "https://cattymod.app/explore";
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        }
    }

    // Observe DOM changes (Scratch constantly re-renders)
    const observer = new MutationObserver(updateButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Check URL changes every second
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            updateButton();
        }
    }, 1000);
})();
