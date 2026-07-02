(async () => {
    const DEFAULT_SB3_URL = "https://cattymod.app/assets/default.sb3";
    const ERROR_SB3_URL = "https://cattymod.app/assets/invalid-projecturl.sb3";

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

    // Load project from URL
    async function loadProjectFromURL(url) {
        await waitForVM();

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch SB3 file: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        await window.vm.loadProject(arrayBuffer);

        console.log(`✅ Project loaded from ${url}`);
    }

    // Intercepts and checks if a custom user template should overwrite the asset load
    async function loadDefaultProject() {
        const customEnabled = localStorage.getItem('customProjectEnabled') === 'true';
        const savedProjectData = localStorage.getItem('cattyModCustomProject');

        if (customEnabled && savedProjectData) {
            try {
                await waitForVM();
                console.log("📦 Loading custom default template from storage...");
                
                // Convert the stored Base64 Data URL string back into a structural ArrayBuffer
                const response = await fetch(savedProjectData);
                const arrayBuffer = await response.arrayBuffer();
                
                await window.vm.loadProject(arrayBuffer);
                console.log("✅ Custom default project loaded successfully!");
                return;
            } catch (err) {
                console.error("❌ Failed to parse custom stored project file:", err);
                // Graceful fallback to factory setting if your storage item gets corrupted
                return loadProjectFromURL(DEFAULT_SB3_URL);
            }
        }

        // Run it like before if option is turned off
        return loadProjectFromURL(DEFAULT_SB3_URL);
    }

    async function loadErrorProject(reason) {
        console.warn("⚠️ Loading error project:", reason);
        return loadProjectFromURL(ERROR_SB3_URL);
    }

    // Hook "New" button
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

    // Page load logic
    window.addEventListener("load", async () => {
        const params = new URLSearchParams(window.location.search);
        const projectSB3 = params.get("projectsb3");
        const projectURL = params.get("project_url");

        const hash = window.location.hash;
        const hasNumericHash = /^#\d+$/.test(hash);

        // ⏭ Skip if numeric hash
        if (hasNumericHash) {
            console.log("⏭ Skipping load (numeric hash detected)");
            return;
        }

        // ⏭ Skip if built-in project_url is used
        if (projectURL) {
            console.log("⏭ Skipping default (project_url detected)");
            return;
        }

        // 🔗 Handle projectsb3
        if (projectSB3) {
            let url;

            try {
                url = new URL(projectSB3, window.location.origin);
            } catch {
                await loadErrorProject("Invalid URL format");
                return;
            }

            if (!["http:", "https:"].includes(url.protocol)) {
                await loadErrorProject("Invalid protocol");
                return;
            }

            try {
                console.log("🔗 Loading project from projectsb3 param...");
                await loadProjectFromURL(url.href);
            } catch {
                await loadErrorProject("Fetch failed");
            }

            return;
        }

        // 📦 Default fallback (Will dynamically check template configurations automatically)
        await loadDefaultProject();
    });

})();
