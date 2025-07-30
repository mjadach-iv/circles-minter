import fs from 'fs';
import os from 'os';
import path from 'path';

function addToLaunchAgents() {
    if (process.platform !== 'darwin') return false;

    const appPath = process.execPath; // Path to the actual executable
    const label = 'com.mjadachiv.crcautominter';
    const plist = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${label}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${appPath}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>LAUNCHED_BY_LAUNCHAGENT</key>
        <string>1</string>
    </dict>
</dict>
</plist>
`;

    const launchAgentsDir = path.join(os.homedir(), 'Library/LaunchAgents');
    if (!fs.existsSync(launchAgentsDir)) {
        fs.mkdirSync(launchAgentsDir, { recursive: true });
    }
    const plistPath = path.join(launchAgentsDir, `${label}.plist`);
    fs.writeFileSync(plistPath, plist, { mode: 0o644 });
    console.log('LaunchAgent plist created at:', plistPath);
    return true;
}

function isInLaunchAgents() {
    if (process.platform !== 'darwin') return false;
    const label = 'com.mjadachiv.crcautominter';
    const plistPath = path.join(os.homedir(), 'Library/LaunchAgents', `${label}.plist`);
    return fs.existsSync(plistPath);
}

function removeFromLaunchAgents() {
    if (process.platform !== 'darwin') return;
    const label = 'com.mjadachiv.crcautominter';
    const plistPath = path.join(os.homedir(), 'Library/LaunchAgents', `${label}.plist`);
    if (fs.existsSync(plistPath)) {
        fs.unlinkSync(plistPath);
        console.log('LaunchAgent plist removed:', plistPath);
        return true;
    }
    return false;
}

export { 
    addToLaunchAgents, 
    isInLaunchAgents,
    removeFromLaunchAgents
};


