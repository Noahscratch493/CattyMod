(async () => {
    const DEFAULT_SB3_URL = "https://cattymod.app/assets/default.sb3";

    // Wait for VM helper
    const waitForVM = () => new Promise(resolve => {
        if (window.vm) return resolve();
        const interval = setInterval(() => {
            if (window.vm) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    // Load project function (reusable)
    async function loadProjectFromURL(url) {
        try {
            await waitForVM();

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch SB3 file: ${response.status}`);

            const arrayBuffer = await response.arrayBuffer();
            await window.vm.loadProject(arrayBuffer);

            console.log(`✅ Project loaded from ${url}`);
        } catch (err) {
            console.error("❌ Error loading project:", err);
        }
    }

    async function loadDefaultProject() {
        return loadProjectFromURL(DEFAULT_SB3_URL);
    }

    // ✅ Hook "New" button and completely override site behavior
    if (!window.__customNewHookInstalled) {
        window.__customNewHookInstalled = true;

        document.addEventListener("click", function (e) {
            const li = e.target.closest('li.menu_menu-item_3EwYA.menu_hoverable_3u9dt.menu_menu-section_2U-v6');
            if (!li) return;

            const span = li.querySelector("span");
            if (!span || span.textContent.trim() !== "New") return;

            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();

            const ok = confirm("Replace contents of the current project?");
            if (!ok) return;

            setTimeout(() => {
                loadDefaultProject();
            }, 400);
        }, true);
    }

    // ✅ Page load logic
    window.addEventListener("load", async () => {
        const params = new URLSearchParams(window.location.search);
        const projectSB3 = params.get("projectsb3");

        const hash = window.location.hash;
        const hasNumericHash = /^#\d+$/.test(hash);

        // If numeric hash → skip everything
        if (hasNumericHash) {
            console.log("⏭ Skipping load (numeric hash detected)");
            return;
        }

        // If projectsb3 param exists → load that
        if (projectSB3) {
            console.log("🔗 Loading project from projectsb3 param...");
            await loadProjectFromURL(projectSB3);
            return;
        }

        // Otherwise → load default
        await loadDefaultProject();
    });

})();
