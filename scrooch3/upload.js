(function () {
    let lastUrl = "";

    function createUploadButton() {
        // Only run if URL contains "editor"
        if (!window.location.href.includes("editor")) return;

        // Find the original custom button
        const originalLink = document.querySelector(
            'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
        );
        if (!originalLink) return;

        // Avoid duplicating multiple times
        if (document.querySelector("#uploadButtonClone")) return;

        // Duplicate the button
        const uploadLink = originalLink.cloneNode(true);
        uploadLink.id = "uploadButtonClone"; // mark it so we don't duplicate

        // Change text
        const span = uploadLink.querySelector(".button_content_3jdgj span");
        if (span) span.textContent = "Upload";

        // Set click behavior
        uploadLink.href = "#";
        uploadLink.addEventListener("click", async (e) => {
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

        // Insert after original
        originalLink.parentNode.insertBefore(uploadLink, originalLink.nextSibling);
    }

    // Watch URL changes and DOM changes
    const observer = new MutationObserver(createUploadButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check URL every second
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            createUploadButton();
        }
    }, 1000);
})();
