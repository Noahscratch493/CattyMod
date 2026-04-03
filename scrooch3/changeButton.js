(function () {
    let lastUrl = "";

    function updateButton() {
        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!button) return;

        const span = button.querySelector(".button_content_3jdgj span");
        if (!span) return;

        // Check URL
        if (window.location.href.includes("editor")) {
            // Editor → Upload
            if (span.textContent !== "Share") span.textContent = "Share";

            button.href = "#";
            button.target = "";

            // Remove existing click handlers to avoid duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener("click", async (e) => {
                e.preventDefault();
                // Download project
                const data = await vm.saveProjectSb3();
                const blob = new Blob([data], { type: "application/zip" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "project.sb3";
                a.click();

                // Open Padlet
                window.open(
                    "https://padlet.com/noahscratch493/cattymod-community-fzzxxm3jc7xg9xf5",
                    "_blank"
                );
            });
        } else {
            // Not editor → Homepage
            if (span.textContent !== "Explore") span.textContent = "Explore";

            button.href = "https://padlet.com/noahscratch493/cattymod-community-fzzxxm3jc7xg9xf5";
            // Remove old click handlers by cloning
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
