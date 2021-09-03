const { app, Menu } = require('electron');
const path = require("path");
const fs = require('fs');

class Core {
    constructor() {
        return (async () => {
            this.app = app;
            global.app = app;
            this.appReady = false;
            this.ppapi_flash_path;

            this.ppapi();

            Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: "File", submenu: [{ role: "reload" }, { role: "close" }] }]));

            await this.app.whenReady();
            this.appReady = true;

            return this;
        })()
    }

    ppapi() {
        if (process.platform == 'win32') {
            this.ppapi_flash_path = path.join(app.getAppPath(), '../flash/pepflashplayer.dll');
            if (!fs.existsSync(this.ppapi_flash_path)) {
                this.ppapi_flash_path = path.join(app.getAppPath(), './flash/pepflashplayer.dll');
            }
        } else if (process.platform == 'linux') {
            this.ppapi_flash_path = path.join(process.resourcesPath.split("/")[1] === "tmp" ? process.resourcesPath : app.getAppPath(), './flash/libpepflashplayer.so');
            this.app.commandLine.appendSwitch("--no-sandbox");
        } else if (process.platform == 'darwin') {
            this.ppapi_flash_path = path.join(app.getAppPath(), `../flash/PepperFlashPlayer.plugin`);
            if (!fs.existsSync(this.ppapi_flash_path)) {
                this.ppapi_flash_path = path.join(app.getAppPath(), './flash/PepperFlashPlayer.plugin');
            }
        }

        let test = this.app.getPath('appData');

        this.app.commandLine.appendSwitch('ppapi-flash-path', this.ppapi_flash_path);
    }
}

module.exports = Core;