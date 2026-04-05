(async () => {
    const DEFAULT_SB3_URL = "https://cattymod.app/assets/default.sb3";

    // Wait for the page to fully load
    window.addEventListener("load", async () => {

        // Wait for the Scratch VM to exist
        const waitForVM = () => new Promise(resolve => {
            if (window.vm) return resolve();
            const interval = setInterval(() => {
                if (window.vm) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
        await waitForVM();

        try {
            // Fetch the SB3 file
            const response = await fetch(DEFAULT_SB3_URL);
            if (!response.ok) throw new Error(`Failed to fetch SB3 file: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();

            // Load the project into Scratch VM
            await window.vm.loadProject(arrayBuffer);

            console.log("✅ CattyMod default project loaded!");
        } catch (err) {
            console.error("❌ Error loading CattyMod project:", err);
        }
    });
})();
