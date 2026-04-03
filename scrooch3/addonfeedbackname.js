(function () {
    function fixAddon(addon) {
        if (!addon || addon.dataset.fixed) return;

        addon.dataset.fixed = "true"; // prevent reprocessing

        addon.querySelectorAll("*").forEach(el => {
            const text = el.textContent?.toLowerCase() || "";

            if (text.includes("remove feedback")) {
                el.textContent = "Remove Home and Upload buttons";
            }
        });
    }

    function scanExisting() {
        document.querySelectorAll('[data-addon-id="tw-remove-feedback"]')
            .forEach(fixAddon);
    }

    // 🔍 Observe ONLY new elements (more efficient + reliable)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // If the addon itself is added
                if (node.matches?.('[data-addon-id="tw-remove-feedback"]')) {
                    fixAddon(node);
                }

                // Or if it appears inside something
                node.querySelectorAll?.('[data-addon-id="tw-remove-feedback"]')
                    .forEach(fixAddon);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run once for already-loaded content
    scanExisting();
})();
