// Persistent white home icon for Cattymod menu
function addHomeIcon() {
  const menu = document.querySelector('.menu-bar_main-menu_3wjWH');
  if (!menu || menu.querySelector('.home-favicon')) return;

  const link = document.createElement('a');
  link.href = 'https://cattymod.app';
  link.target = '_self';
  link.style.display = 'flex';
  link.style.alignItems = 'center';
  link.style.justifyContent = 'center';
  link.style.height = '100%';
  link.style.padding = '0 6px';
  link.style.borderRadius = '0';
  link.style.transition = 'background 0.15s ease';

  const icon = document.createElement('img');
  icon.src = 'https://cattymod.app/assets/home.png';
  icon.className = 'home-favicon';
  icon.style.filter = 'brightness(0) invert(1)';
  icon.style.maxHeight = '100%';
  icon.style.maxWidth = '24px';
  icon.style.objectFit = 'contain';

  link.appendChild(icon);

  link.onmouseover = () => link.style.background = 'rgba(255, 255, 255, 0.15)';
  link.onmouseout = () => link.style.background = 'transparent';

  menu.prepend(link);
}


// Add "Open Scratch 2" safely inside opened menus
function addScratch2Option() {
  document.querySelectorAll('ul').forEach(menu => {
    if (menu.dataset.s2patched) return;

    const items = [...menu.querySelectorAll('li')];

    for (const li of items) {
      const span = li.querySelector('span');
      if (span && span.textContent.includes('Change Username')) {

        const clone = li.cloneNode(true);
        clone.querySelector('span').textContent = 'Open Scratch 2';

        clone.style.cursor = 'pointer';
        clone.addEventListener('click', e => {
          e.stopPropagation();
          window.open('https://scratch2.cattymod.app', '_blank');
        });

        li.parentNode.insertBefore(clone, li.nextSibling);

        menu.dataset.s2patched = "1";
        break;
      }
    }
  });
}


// Keep both features alive safely
const observer = new MutationObserver(() => {
  addHomeIcon();
  addScratch2Option();
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
addHomeIcon();
addScratch2Option();
