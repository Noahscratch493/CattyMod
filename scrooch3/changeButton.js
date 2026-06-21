(function () {
  function updateButton() {
    const links = document.querySelectorAll(
      'a.menu-bar_feedback-link_1BnAR[href="https://scratch.mit.edu/discuss/topic/636814/"]'
    );

    links.forEach(link => {
      // Change link
      link.href = "https://scratch.mit.edu/studios/51500179/";

      // Change text inside
      const span = link.querySelector(".button_content_3jdgj span");
      if (span) {
        span.textContent = "Explore";
      }
    });
  }

  // Run once
  updateButton();

  // Keep checking (for dynamic UI updates)
  const observer = new MutationObserver(updateButton);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
