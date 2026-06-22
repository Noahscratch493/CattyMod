// tip.js
(function() {
  let d = null;
  const tips = [
    "Tip: Never Give Up!",
    "Fact: CattyMod was originally called Automate.",
    "Fact: CattyMod is edited by only 1 Developer!",
    "Tip: Go to the bottom of the page to see cool projects!",
    "Fact: CattyMod has exactly 650 blocks!",
    "Tip: Use Extensions to add abilities to your project!",
    "Fact: There are exactly 7 Facts and Tips including this one!"
  ];
  let used = [];

  // Pick a random tip from the remaining ones
  function chooseTip() {
    if (tips.length === 0) {
      tips.push(...used);
      used = [];
    }
    const i = Math.floor(Math.random() * tips.length);
    const tip = tips.splice(i, 1)[0];
    used.push(tip);
    return tip;
  }

  // Format tip: everything after ":" is italic
  function formatTip(text) {
    const parts = text.split(":");
    return parts[0] + ": " + "<i>" + parts.slice(1).join(":").trim() + "</i>";
  }

  // Check for the loader progress bar and add tip below it
  setInterval(() => {
    const bar = document.querySelector('.loader_tw-progress-inner_3hE3h');
    if (bar && !d) {
      d = document.createElement('div');
      d.style.color = 'white';
      d.style.marginTop = '8px'; // slightly lower
      d.style.textAlign = 'center';
      d.style.pointerEvents = 'none';
      d.innerHTML = formatTip(chooseTip());
      bar.parentNode.insertBefore(d, bar.nextSibling);
    } else if (!bar && d) {
      d.remove();
      d = null;
    }
  }, 300);
})();
