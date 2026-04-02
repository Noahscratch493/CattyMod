(function () {
  // helper to read cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // get color from cookie
  const navColor = getCookie('NavColour');
  if (!navColor) return; // exit if cookie doesn't exist

  // change navbar background
  document.querySelectorAll('div.menu-bar_menu-bar_JcuHF.box_box_2jjDp')
    .forEach(el => {
      el.style.backgroundColor = navColor;
    });

  // also change feedback button text color
  function updateButtonColors() {
    const feedbackLinks = document.querySelectorAll('a.menu-bar_feedback-link_1BnAR');
    feedbackLinks.forEach(link => {
      const span = link.querySelector('.button_content_3jdgj span');
      if (span) {
        span.style.color = navColor; // matches navbar color
      }
    });
  }

  // run once immediately
  updateButtonColors();

  // observe dynamic changes to the DOM
  const observer = new MutationObserver(updateButtonColors);
  observer.observe(document.body, { childList: true, subtree: true });
})();
