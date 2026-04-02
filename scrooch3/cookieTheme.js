(function () {
  // ------------------------------
  // 1️⃣ Helper functions
  // ------------------------------
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
  }

  // ------------------------------
  // 2️⃣ Apply theme colors
  // ------------------------------
  function applyThemeColor() {
    const navColor = getCookie('NavColour');
    if (!navColor) return;

    // navbar background
    document.querySelectorAll('div.menu-bar_menu-bar_JcuHF.box_box_2jjDp')
      .forEach(el => el.style.backgroundColor = navColor);

    // feedback button text
    document.querySelectorAll('a.menu-bar_feedback-link_1BnAR')
      .forEach(link => {
        const span = link.querySelector('.button_content_3jdgj span');
        if (span) span.style.color = navColor;
      });

    // settings icon color
    const icon = document.querySelector('.scrooch-settings-icon');
    if (icon) icon.style.color = navColor;
  }

  applyThemeColor();
  new MutationObserver(applyThemeColor)
    .observe(document.body, { childList: true, subtree: true });

  // ------------------------------
  // 3️⃣ Add Settings Icon at Right
  // ------------------------------
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
    document.head.appendChild(faLink);
  }

  function addSettingsIcon() {
    const navbar = document.querySelector('div.menu-bar_menu-bar_JcuHF.box_box_2jjDp');
    if (!navbar || navbar.querySelector('.scrooch-settings-icon')) return;

    // make navbar flex if not already
    navbar.style.display = 'flex';
    navbar.style.alignItems = 'center';
    navbar.style.justifyContent = 'space-between';

    // create container for menu + settings
    let menuWrapper = document.createElement('div');
    while (navbar.firstChild) {
      menuWrapper.appendChild(navbar.firstChild);
    }
    navbar.appendChild(menuWrapper);

    // create icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-cog scrooch-settings-icon';
    icon.title = 'Theme Settings';
    icon.style.cursor = 'pointer';
    icon.style.fontSize = '16px';
    icon.style.marginLeft = 'auto';
    icon.style.transition = 'color 0.2s';
    icon.style.color = getCookie('NavColour') || '#fff';
    navbar.appendChild(icon);

    // ------------------------------
    // 4️⃣ Popup
    // ------------------------------
    const popup = document.createElement('div');
    popup.className = 'scrooch-theme-popup';
    popup.style.position = 'absolute';
    popup.style.top = '100%';
    popup.style.right = '0';
    popup.style.backgroundColor = '#1e1e1e';
    popup.style.color = '#eee';
    popup.style.border = '1px solid #444';
    popup.style.borderRadius = '8px';
    popup.style.padding = '1rem';
    popup.style.minWidth = '220px';
    popup.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
    popup.style.display = 'none';
    popup.style.zIndex = 9999;

    popup.innerHTML = `
      <label for="scroochNavColor">Navbar & Feedback Color:</label>
      <input type="color" id="scroochNavColor" style="width:100%; height:40px; border:none; border-radius:6px;">
      <div style="display:flex; justify-content:space-between; margin-top:1rem;">
        <button id="scroochSave" style="flex:1; margin-right:0.5rem; background:#4CAF50; color:#fff; border:none; border-radius:6px; padding:0.5rem; cursor:pointer;">Save</button>
        <button id="scroochReset" style="flex:1; margin-left:0.5rem; background:#f44336; color:#fff; border:none; border-radius:6px; padding:0.5rem; cursor:pointer;">Reset</button>
      </div>
    `;
    icon.style.position = 'relative';
    icon.appendChild(popup);

    // toggle popup
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });

    // hide on click outside
    document.addEventListener('click', () => popup.style.display = 'none');
    popup.addEventListener('click', (e) => e.stopPropagation());

    const input = popup.querySelector('#scroochNavColor');
    const savedColor = getCookie('NavColour');
    if (savedColor) input.value = savedColor;

    popup.querySelector('#scroochSave').addEventListener('click', () => {
      setCookie('NavColour', input.value, 365);
      applyThemeColor();
    });

    popup.querySelector('#scroochReset').addEventListener('click', () => {
      deleteCookie('NavColour');
      input.value = '#ffffff';
      applyThemeColor();
    });
  }

  addSettingsIcon();
  new MutationObserver(addSettingsIcon)
    .observe(document.body, { childList: true, subtree: true });

})();
