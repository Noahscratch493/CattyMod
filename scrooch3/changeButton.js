// changeButton.js
(function () {
  let lastUrl = "";

  function processButton(button: HTMLAnchorElement) {
    if (!button || button.dataset.processed === "true") return;

    const span = button.querySelector(".button_content_3jdgj span");
    if (!span) return;

    if (window.location.href.includes("editor")) {
      // Editor → Share
      span.textContent = "Share";
      button.href = "#";
      button.target = "";

      // Mark as processed before adding event listener
      button.dataset.processed = "true";

      button.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          const data = await vm.saveProjectSb3();
          const blob = new Blob([data], { type: "application/zip" });
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

          // Open explore upload page
          const exploreWindow = window.open(
            "https://cattymod-explore.lovable.app/explore/upload",
            "_blank"
          );

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
      // Homepage → Explore
      span.textContent = "Explore";
      button.href = "https://cattymod.app/explore";
      button.dataset.processed = "true";
    }
  }

  function updateButtons() {
    const buttons = document.querySelectorAll(
      'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
    );
    buttons.forEach(processButton);
  }

  // MutationObserver for DOM changes
  const observer = new MutationObserver(updateButtons);
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  updateButtons();

  // URL check (optional, only to detect navigation)
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      updateButtons();
    }
  }, 1000);
})();
