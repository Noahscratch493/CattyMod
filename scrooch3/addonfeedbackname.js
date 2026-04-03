(function() {
    function updateAddonName(card) {
        // Find the title text inside the addon card
        const titleEl = card.querySelector("h3, h2, span, div");

        if (titleEl && /remove/i.test(titleEl.textContent)) {
            titleEl.textContent = "Remove Home and Upload buttons";
        }
    }

    const obs = new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                // If the addon card itself is added
                if (node.matches('[data-addon-id="tw-remove-feedback"]')) {
                    updateAddonName(node);
                }

                // Or if it contains the addon card inside
                node.querySelectorAll?.('[data-addon-id="tw-remove-feedback"]').forEach(updateAddonName);
            });
        });
    });

    obs.observe(document.body, { childList: true, subtree: true });

    // Run once for any already‑loaded cards
    document.querySelectorAll('[data-addon-id="tw-remove-feedback"]').forEach(updateAddonName);
})();
