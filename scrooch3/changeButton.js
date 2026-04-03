(function () {
    let lastUrl = "";

    function updateButton() {
        const button = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!button) return;

        const span = button.querySelector(".button_content_3jdgj span");
        if (!span) return;

        // Remove old click handlers
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        if (window.location.href.includes("editor")) {
            // Editor mode → Upload
            span.textContent = "Upload";
            newButton.href = "#";
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
            // Not editor → Home
            span.textContent = "Home";
            newButton.href = "https://www.cattymod.app";
            newButton.target = "_blank"; // open in new tab
        }
    }

    // Observe DOM changes in case Scratch re-renders
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
