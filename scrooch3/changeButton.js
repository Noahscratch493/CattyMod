// changeButton.js
(function () {
  let lastUrl = "";

  function updateButton() {
    const button = document.querySelector(
      'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
    );
    if (!button) return;

    // Skip already processed buttons
    if (button.dataset.processed === "true") return;

    const span = button.querySelector(".button_content_3jdgj span");
    if (!span) return;

    if (window.location.href.includes("editor")) {
      // Editor → Share to CattyMod Explore
      if (span.textContent !== "Share") span.textContent = "Share";

      button.href = "#";
      button.target = "";

      // Clone button to remove previous listeners
      const newButton = button.cloneNode(true);
      newButton.dataset.processed = "true"; // mark as processed
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
          // Save project as SB3
          const data = await vm.saveProjectSb3();
          const blob = new Blob([data], { type: "application/zip" });
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

          // Open CattyMod Explore upload page in new tab
          const exploreWindow = window.open(
            "https://cattymod-explore.lovable.app/explore/upload",
            "_blank"
          );

          // Send SB3 after a short delay
          setTimeout(() => {
            if (!exploreWindow || !exploreWindow.postMessage) return;
            exploreWindow.postMessage(
              { action: "receiveSB3", data: base64, name: "project.sb3" },
              "https://cattymod-explore.lovable.app"
            );
          }, 500);
        } catch (err) {
          console.error("Error sharing SB3:", err);
          alert("Failed to share project. Try saving as SB3 and uploading manually.");
        }
      });
    } else {
      // Not editor → Homepage
      if (span.textContent !== "Explore") span.textContent = "Explore";

      button.href = "https://cattymod.app/explore";
      const newButton = button.cloneNode(true);
      newButton.dataset.processed = "true"; // mark as processed
      button.parentNode.replaceChild(newButton, button);
    }
  }

  // Observe DOM changes (Scratch constantly re-renders buttons)
  const observer = new MutationObserver(updateButton);
  observer.observe(document.body, { childList: true, subtree: true });

  // Also check URL changes periodically
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      updateButton();
    }
  }, 1000);
})();
