(function () {
  let lastUrl = "";

  function processButton(button) {
    if (!button || button.dataset.processed === "true") return;

    const span = button.querySelector(".button_content_3jdgj span");
    if (!span) return;

    if (window.location.href.includes("editor")) {
      // Editor → Share
      span.textContent = "Share";
      button.href = "#";
      button.target = "";
      button.dataset.processed = "true";

      button.addEventListener("click", async (e) => {
        e.preventDefault();

        // Wait for vm to exist
        if (typeof vm === "undefined") {
          alert("VM is not ready. Please wait a moment and try again.");
          return;
        }

        try {
          const data = await vm.saveProjectSb3(); // Save project as SB3
          const blob = new Blob([data], { type: "application/zip" });
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

          // Open Explore upload page
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
          alert(
            "Failed to share project. Try saving as SB3 manually and uploading to CattyMod Explore."
          );
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

  // URL check
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      updateButtons();
    }
  }, 1000);
})();
