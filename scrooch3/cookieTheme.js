(function () {
  // helper to read cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const navColor = getCookie('NavColour');
  if (!navColor || !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(navColor)) return;

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

    // set extension button color (background + border + outline)
    document.querySelectorAll('.gui_extension-button-container_b4rCs.box_box_2jjDp button.gui_extension-button_2T7PA')
      .forEach(b => {
        b.style.setProperty('background-color', navColor, 'important');
        b.style.setProperty('border', '2px solid ' + navColor, 'important');
        b.style.setProperty('outline', '2px solid ' + navColor, 'important');
        b.style.setProperty('box-shadow', 'none', 'important');
      });
  }

  // run immediately
  applyColors();

  // observe dynamic DOM changes (like editor reload)
  const observer = new MutationObserver(applyColors);
  observer.observe(document.body, { childList: true, subtree: true });
})();
