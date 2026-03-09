// electron/main.js

const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "DEV";

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        show: false,
        frame: false,             // ✅ remove ugly system title bar
        titleBarStyle: "hidden",  // ✅ modern vibes
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    // ✅ DEV MODE (localhost)
    if (isDev) {
        win.loadURL("http://localhost:3000/auth"); // OR your initial page
    }

    // ✅ PRODUCTION (Next.js build running on Next server)
    else {
        win.loadURL("http://localhost:3000"); // Default root page
    }

    win.once("ready-to-show", () => {
        win.show();
    });
}

app.whenReady().then(createWindow);

// ✅ MacOS compatibility (optional)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
