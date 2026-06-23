// IndexedDB helper

function getCustomDefaultProject() {
    return new Promise((resolve) => {

        const enabled =
            document.cookie
                .split("; ")
                .find(row => row.startsWith("DefaultProjectEnabled="))
                ?.split("=")[1] === "true";

        if (!enabled) {
            resolve(null);
            return;
        }

        const request = indexedDB.open("CattyModSettings", 1);

        request.onerror = () => resolve(null);

        request.onsuccess = () => {

            const db = request.result;

            const tx = db.transaction(
                "settings",
                "readonly"
            );

            const store =
                tx.objectStore("settings");

            const getReq =
                store.get("defaultProject");

            getReq.onsuccess = () => {
                resolve(getReq.result || null);
            };

            getReq.onerror = () => {
                resolve(null);
            };
        };
    });
}

async function loadDefaultProject() {

    await waitForVM();

    try {

        const customProject =
            await getCustomDefaultProject();

        if (customProject) {

            console.log(
                "📦 Loading custom default project..."
            );

            const arrayBuffer =
                await customProject.arrayBuffer();

            await window.vm.loadProject(
                arrayBuffer
            );

            console.log(
                "✅ Custom default project loaded"
            );

            return;
        }

    } catch (err) {

        console.warn(
            "Failed to load custom default project:",
            err
        );

    }

    console.log(
        "📦 Loading built-in default project..."
    );

    return loadProjectFromURL(
        DEFAULT_SB3_URL
    );
}
