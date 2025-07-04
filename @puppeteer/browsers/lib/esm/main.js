/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
export { launch, computeExecutablePath, computeSystemExecutablePath, TimeoutError, CDP_WEBSOCKET_ENDPOINT_REGEX, WEBDRIVER_BIDI_WEBSOCKET_ENDPOINT_REGEX, Process, } from './launch.js';
export { install, makeProgressCallback, getInstalledBrowsers, canDownload, uninstall, getDownloadUrl, } from './install.js';
export { detectBrowserPlatform } from './detectPlatform.js';
export { resolveBuildId, Browser, BrowserPlatform, ChromeReleaseChannel, createProfile, getVersionComparator, } from './browser-data/browser-data.js';
export { CLI } from './CLI.js';
export { Cache, InstalledBrowser } from './Cache.js';
export { BrowserTag } from './browser-data/types.js';
//# sourceMappingURL=main.js.map