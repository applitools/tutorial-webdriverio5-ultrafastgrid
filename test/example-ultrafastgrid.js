'use strict';

const {remote} = require('webdriverio');
const {
    VisualGridRunner,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo,
    BrowserType,
    DeviceName,
    ScreenOrientation
} = require('@applitools/eyes-webdriverio');


let browser;
let eyes;

describe('wdio5', function () {


    beforeEach(async () => {
        // Use chrome browser
        const chrome = {
            capabilities: {
                browserName: 'chrome'
            },
            logLevel: 'silent',
        };
        // Use Chrome browser
        browser = await remote(chrome);

        // Initialize the Runner for your test.
        const runner = new VisualGridRunner();

        // Initialize the eyes SDK
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        const configuration = new Configuration();

        // You can get your api key from the Applitools dashboard
        configuration.setApiKey('X88oeVgnovhhWwGWqUslkA1048l7Dt7FFgrsEw9NdHlkQ110')

        // Set new batch
        configuration.setBatch(new BatchInfo('Ultrafast Batch'))

        // Add browsers with different viewports
        configuration.addBrowser(800, 600, BrowserType.CHROME);
        configuration.addBrowser(700, 500, BrowserType.FIREFOX);
        configuration.addBrowser(1600, 1200, BrowserType.IE_11);
        configuration.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
        configuration.addBrowser(800, 600, BrowserType.SAFARI);

        // Add mobile emulation devices in Portrait mode
        configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
        configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);

        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });


    it('Classic Runner Test', async () => {

        // Start the test by setting AUT's name, test name and viewport size (width X height)
        await eyes.open(browser, 'Demo App', 'Ultrafast grid demo', new RectangleSize(800, 600));

        // Navigate the browser to the "ACME" demo app.
        await browser.url('https://demo.applitools.com');

        // To see visual bugs after the first run, use the commented line below instead.
        // await driver.url("https://demo.applitools.com/index_v2.html");

        // Visual checkpoint #1.
        await eyes.check('Login Window', Target.window().fully());

        // Click the "Log in" button.
        const loginButton = await browser.$('#log-in');
        await loginButton.click();

        // Visual checkpoint #2.
        await eyes.check('App Window', Target.window().fully());

        // End the test
        await eyes.closeAsync();
    });

    afterEach(async () => {
        // Close the browser
        await browser.deleteSession();

        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abortIfNotClosed();

        // Wait and collect all test results
        const results = await eyes.getRunner().getAllTestResults(false);
        console.log(results);
        console.log(results.getAllResults());
    });

});