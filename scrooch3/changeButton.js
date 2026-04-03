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
            if (span.textContent !== "Share") span.textContent = "Share";

            button.href = "#";
            button.target = "";

            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener("click", async (e) => {
                e.preventDefault();

                // Set button to "Wait..."
                span.textContent = "Wait…";

                try {
                    // Get project SB3
                    const data = await vm.saveProjectSb3();
                    const blob = new Blob([data], { type: "application/zip" });
                    const formData = new FormData();
                    formData.append("file", blob, "project.sb3");

                    // Send to CattyMod Explore
                    const response = await fetch(
                        "https://cattymod-explore.lovable.app/upload",
                        { method: "POST", body: formData }
                    );

                    if (!response.ok) throw new Error("Upload failed");

                    // Open the explore page after upload
                    window.open("https://cattymod-explore.lovable.app", "_blank");
                } catch (err) {
                    console.error(err);
                    alert("Failed to upload project.");
                } finally {
                    // Reset button text
                    span.textContent = "Share";
                }
            });
        } else {
            if (span.textContent !== "Explore") span.textContent = "Explore";

            button.href = "https://cattymod.app/explore";
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        }
    }

    const observer = new MutationObserver(updateButton);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            updateButton();
        }
    }, 1000);
})();
