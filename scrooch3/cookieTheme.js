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
    // navbar background
    document.querySelectorAll('div.menu-bar_menu-bar_JcuHF.box_box_2jjDp')
      .forEach(el => el.style.backgroundColor = navColor);

    // feedback button text
    const feedbackLinks = document.querySelectorAll('a.menu-bar_feedback-link_1BnAR');
    feedbackLinks.forEach(link => {
      const span = link.querySelector('.button_content_3jdgj span');
      if (span) span.style.color = navColor;
    });

    // extension buttons
    document.querySelectorAll('.gui_extension-button-container_b4rCs.box_box_2jjDp button.gui_extension-button_2T7PA')
      .forEach(b => {
        b.style.setProperty('background-color', navColor, 'important');
        b.style.setProperty('border', '2px solid ' + navColor, 'important');
        b.style.setProperty('outline', '2px solid ' + navColor, 'important');
        b.style.setProperty('box-shadow', 'none', 'important');
      });

    // main sprite buttons
    document.querySelectorAll('.action-menu_main-button_3ccfy')
      .forEach(e => {
        e.style.background = navColor;
        e.style.outline = '4px solid ' + navColor;
      });

    // small sprite buttons
    document.querySelectorAll('.action-menu_more-button_1fMGZ')
      .forEach(e => e.style.background = navColor);

    // container / blue box behind small buttons
    document.querySelectorAll('.action-menu_more-buttons_3Bjkq,.action-menu_more-buttons-outer_3J9yZ')
      .forEach(e => {
        e.style.background = navColor;
        e.style.boxShadow = 'none';
        e.style.border = 'none';
      });

    // tooltips (background + text + arrow)
    document.querySelectorAll('.action-menu_tooltip_3Bkh5')
      .forEach(t => {
        t.style.backgroundColor = navColor;
        t.style.color = 'white';
        t.style.boxShadow = 'none';
      });
  }

  // inject CSS to force tooltip arrow color to match fill
  if (!document.getElementById('tooltip-navcolor-style')) {
    const s = document.createElement('style');
    s.id = 'tooltip-navcolor-style';
    s.innerHTML = `.action-menu_tooltip_3Bkh5::after { background-color: ${navColor} !important }`;
    document.head.appendChild(s);
  }

  // run immediately
  applyColors();

  // observe dynamic DOM changes
  const observer = new MutationObserver(applyColors);
  observer.observe(document.body, { childList: true, subtree: true });
})();
