(function () {
  // helper to read cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const navColor = getCookie('NavColour');
  if (!navColor) return; // do nothing if cookie doesn't exist

  // function to apply colors
  function applyColors() {
    // set navbar background
    document.querySelectorAll('div.menu-bar_menu-bar_JcuHF.box_box_2jjDp')
      .forEach(el => {
        el.style.backgroundColor = navColor;
      });

    // set feedback button color
    const feedbackLinks = document.querySelectorAll('a.menu-bar_feedback-link_1BnAR');
    feedbackLinks.forEach(link => {
      const span = link.querySelector('.button_content_3jdgj span');
      if (span) {
        span.style.color = navColor;
      }
    });
  }

  // run immediately
  applyColors();

  // observe dynamic DOM changes (like editor reload)
  const observer = new MutationObserver(applyColors);
  observer.observe(document.body, { childList: true, subtree: true });
})();
