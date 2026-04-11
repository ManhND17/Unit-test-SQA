import type { Options } from '@wdio/types' with { 'resolution-mode': 'import' }

// Thiết lập biến môi trường cho Android SDK
process.env.ANDROID_HOME = 'C:\\Users\\ADMIN\\AppData\\Local\\Android\\Sdk';
process.env.ANDROID_SDK_ROOT = 'C:\\Users\\ADMIN\\AppData\\Local\\Android\\Sdk';
process.env.PATH = `${process.env.PATH};${process.env.ANDROID_HOME}\\platform-tools;${process.env.ANDROID_HOME}\\emulator`;

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.ts'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator', 
        'appium:automationName': 'UiAutomator2',
        'browserName': 'Chrome',
        'appium:newCommandTimeout': 240,
        'appium:allowAutomatedChromedriverDownload': true,
        'appium:nativeWebScreenshot': true,
    } as any],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://10.0.2.2:3000',
    waitforTimeout: 30000,
    connectionRetryTimeout: 150000,
    connectionRetryCount: 3,
    services: [
        ['appium', {
            args: {
                allowInsecure: 'uiautomator2:chromedriver_autodownload'
            }
        }]
    ],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
