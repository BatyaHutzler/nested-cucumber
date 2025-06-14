/// <reference types="node" />
/// <reference types="node" />
import type DevToolsDriver from '../devtoolsdriver';
/**
 * The Take Screenshot command takes a screenshot of the top-level browsing context's viewport.
 *
 * @alias browser.takeScreenshot
 * @see https://w3c.github.io/webdriver/#dfn-take-screenshot
 * @return {string} The base64-encoded PNG image data comprising the screenshot of the initial viewport.
 */
export default function takeScreenshot(this: DevToolsDriver): Promise<string | Buffer>;
//# sourceMappingURL=takeScreenshot.d.ts.map