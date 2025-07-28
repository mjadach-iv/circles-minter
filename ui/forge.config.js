const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.resolve(__dirname, 'assets/icon'),
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl: `file://${path.resolve(__dirname, 'assets/icon.ico')}`,
        setupIcon: path.resolve(__dirname, 'assets/icon.ico'),
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: path.resolve(__dirname, 'assets/icon.png')
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: path.resolve(__dirname, 'assets/icon.icns')
      }
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        icon: path.resolve(__dirname, 'assets/icon.ico')
      }
    }
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};