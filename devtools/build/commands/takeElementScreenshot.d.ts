/// <reference types="node" />
/// <reference types="node" />
import type DevToolsDriver from '../devtoolsdriver';
/**
 * The Take Element Screenshot command takes a screenshot of the visible region
 * encompassed by the bounding rectangle of an element.
 *
 * @alias browser.takeElementScreenshot
 * @see https://w3c.github.io/webdriver/#dfn-take-element-screenshot
 * @param {string} elementId the id of an element returned in a previous call to Find Element(s)
 * @return {string}          The base64-encoded PNG image data comprising the screenshot of the visible region of an element’s bounding rectangle after it has been scrolled into view.
 */
export default function takeElementScreenshot(this: DevToolsDriver, { elementId }: {
    elementId: string;
}): Promise<string | Buffer>;
//# sourceMappingURL=takeElementScreenshot.d.ts.map