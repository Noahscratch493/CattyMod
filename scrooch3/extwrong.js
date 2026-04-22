(function () {
    function removeTarget() {
        const items = document.querySelectorAll(
            "div.library-item_library-item_1DcMO.library-item_featured-item_3V2-t.library-item_library-item-extension_3xus9"
        );

        items.forEach(el => {
            if (el.textContent.includes("Better text blocks")) {
                el.remove();
            }
        });
    }

    // Run once immediately
    removeTarget();

    // Watch for new items being added
    const observer = new MutationObserver(removeTarget);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
