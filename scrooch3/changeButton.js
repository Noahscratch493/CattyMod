(function () {
    let lastUrl = "";

    function updateButton() {
        // Only run if URL contains "editor"
        if (!window.location.href.includes("editor")) return;

        // Find the original custom button
        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!button) return;

        // Change text
        const span = button.querySelector(".button_content_3jdgj span");
        if (span) span.textContent = "Upload";

        // Remove original href to prevent navigation
        button.href = "#";

        // Remove existing click handlers
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add click behavior
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
    }

    // Observe DOM changes in case Scratch re-renders
    const observer = new MutationObserver(updateButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check URL changes every second
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            updateButton();
        }
    }, 1000);
})();
