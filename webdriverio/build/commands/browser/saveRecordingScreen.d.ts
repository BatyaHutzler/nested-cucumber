/// <reference types="node" />
/// <reference types="node" />
/**
 *
 * Save a video started by [`startRecordingScreen`](/docs/api/appium#startrecordingscreen) command to file.
 *
 * :::info
 *
 * This command is only supported for mobile sessions running on [Appium](http://appium.io/docs/en/commands/device/recording-screen/start-recording-screen/).
 *
 * :::
 *
 * <example>
    :saveRecordingScreen.js
    it('should save a video', async () => {
        await browser.startRecordingScreen();
        await $('~BUTTON').click();
        await browser.saveRecordingScreen('./some/path/video.mp4');
    });
 * </example>
 *
 * @alias browser.saveRecordingScreen
 * @param   {String}  filepath  full or relative to the execution directory path to the generated video
 * @return  {Buffer}            video buffer
 * @type utility
 *
 */
export default function saveRecordingScreen(this: WebdriverIO.Browser, filepath: string): Promise<Buffer>;
//# sourceMappingURL=saveRecordingScreen.d.ts.map