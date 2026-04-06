// checkStop.js

(async function () {
    // Check if BugSkip cookie exists
    if (document.cookie.split('; ').some(c => c.startsWith('BugSkip='))) {
        return;
    }

    try {
        const res = await fetch("https://raw.githubusercontent.com/cattymod/editor/refs/heads/editor/stop.txt");
        const text = (await res.text()).trim().toLowerCase();

        if (text === "true") {
            window.location.href = "https://studio.cattymod.app/improve.html";
        }
    } catch (err) {
        console.error("Failed to check stop.txt:", err);
        // Fail silently so the site still works
    }
})();
