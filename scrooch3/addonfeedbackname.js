(function () {
    function renameAddon() {
        // Find all addon cards
        const addons = document.querySelectorAll("[data-addon-id]");

        addons.forEach(addon => {
            if (addon.getAttribute("data-addon-id") === "tw-remove-feedback") {

                // Look through all elements inside this addon
                addon.querySelectorAll("*").forEach(el => {
                    const text = el.textContent?.trim().toLowerCase();

                    if (text === "remove feedback button" || text === "remove feedback") {
                        el.textContent = "Remove Home and Upload buttons";
                    }
                });
            }
        });
    }

    // Run once
    renameAddon();

    // Watch for UI re-renders
    const observer = new MutationObserver(renameAddon);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
