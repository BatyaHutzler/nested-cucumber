import path from 'node:path';
import fsp, { writeFile } from 'node:fs/promises';
import os from 'node:os';
import cp from 'node:child_process';
import { format } from 'node:util';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import findEdgePath from './finder.js';
import { TAGGED_VERSIONS, EDGE_PRODUCTS_API, EDGEDRIVER_BUCKET, TAGGED_VERSION_URL, LATEST_RELEASE_URL, DOWNLOAD_URL, BINARY_FILE, log } from './constants.js';
import { hasAccess, getNameByArchitecture, sleep } from './utils.js';
const fetchOpts = {};
if (process.env.HTTPS_PROXY) {
    fetchOpts.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
}
else if (process.env.HTTP_PROXY) {
    fetchOpts.agent = new HttpProxyAgent(process.env.HTTP_PROXY);
}
export async function download(edgeVersion = process.env.EDGEDRIVER_VERSION, cacheDir = process.env.EDGEDRIVER_CACHE_DIR || os.tmpdir()) {
    const binaryFilePath = path.resolve(cacheDir, BINARY_FILE);
    if (await hasAccess(binaryFilePath)) {
        return binaryFilePath;
    }
    if (!edgeVersion) {
        const edgePath = findEdgePath();
        if (!edgePath) {
            throw new Error('Could not find Microsoft Edge binary, please make sure the browser is installed on your system.');
        }
        log.info(`Trying to detect Microsoft Edge version from binary found at ${edgePath}`);
        edgeVersion = os.platform() === 'win32' ? await getEdgeVersionWin(edgePath) : await getEdgeVersionUnix(edgePath);
        log.info(`Detected Microsoft Edge v${edgeVersion}`);
    }
    const version = await fetchVersion(edgeVersion);
    const res = await downloadDriver(version);
    await fsp.mkdir(cacheDir, { recursive: true });
    await downloadZip(res, cacheDir);
    await fsp.chmod(binaryFilePath, '755');
    log.info('Finished downloading Edgedriver');
    await sleep(); // wait for file to be accessible, avoid ETXTBSY errors
    return binaryFilePath;
}
async function downloadDriver(version) {
    try {
        const downloadUrl = format(DOWNLOAD_URL, version, getNameByArchitecture());
        log.info(`Downloading Edgedriver from ${downloadUrl}`);
        const res = await fetch(downloadUrl, fetchOpts);
        if (!res.body || !res.ok || res.status !== 200) {
            throw new Error(`Failed to download binary from ${downloadUrl} (statusCode ${res.status})`);
        }
        return res;
    }
    catch (err) {
        log.error(`Failed to download Edgedriver: ${err.message}, trying alternative download URL...`);
    }
    try {
        const majorVersion = version.split('.')[0];
        const platform = process.platform === 'darwin'
            ? 'macos'
            : process.platform === 'win32'
                ? 'windows'
                : 'linux';
        log.info(`Attempt to fetch latest v${majorVersion} for ${platform} from ${EDGEDRIVER_BUCKET}`);
        const versions = await fetch(EDGEDRIVER_BUCKET, {
            ...fetchOpts,
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/json; charset=utf-8',
                pragma: 'no-cache',
            }
        });
        const parser = new XMLParser();
        const { EnumerationResults } = parser.parse(await versions.text());
        const blobName = `LATEST_RELEASE_${majorVersion}_${platform.toUpperCase()}`;
        const alternativeDownloadUrl = EnumerationResults.Blobs.Blob
            .find((blob) => blob.Name === blobName).Url;
        if (!alternativeDownloadUrl) {
            throw new Error(`Couldn't find alternative download URL for ${version}`);
        }
        log.info(`Downloading alternative Edgedriver version from ${alternativeDownloadUrl}`);
        const versionResponse = await fetch(alternativeDownloadUrl, fetchOpts);
        const alternativeVersion = sanitizeVersion(await versionResponse.text());
        const downloadUrl = format(DOWNLOAD_URL, alternativeVersion, getNameByArchitecture());
        log.info(`Downloading Edgedriver from ${downloadUrl}`);
        const res = await fetch(downloadUrl, fetchOpts);
        if (!res.body || !res.ok || res.status !== 200) {
            throw new Error(`Failed to download binary from ${downloadUrl} (statusCode ${res.status})`);
        }
        return res;
    }
    catch (err) {
        throw new Error(`Failed to download Edgedriver: ${err.message}`);
    }
}
async function getEdgeVersionWin(edgePath) {
    const versionPath = path.dirname(edgePath);
    const contents = await fsp.readdir(versionPath);
    const versions = contents.filter((p) => /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/g.test(p));
    // returning oldest in case there is an updated version and Edge still hasn't relaunched
    const oldest = versions.sort((a, b) => a > b ? 1 : -1)[0];
    return oldest;
}
async function getEdgeVersionUnix(edgePath) {
    log.info(`Trying to detect Microsoft Edge version from binary found at ${edgePath}`);
    const versionOutput = await new Promise((resolve, reject) => cp.exec(`"${edgePath}" --version`, (err, stdout, stderr) => {
        if (err) {
            return reject(err);
        }
        if (stderr) {
            return reject(new Error(stderr));
        }
        return resolve(stdout);
    }));
    /**
     * example output: "Microsoft Edge 124.0.2478.105 unknown"
     */
    return versionOutput
        /**
         * trim the output
         */
        .trim()
        /**
         * split by space, e.g. `[Microsoft, Edge, 124.0.2478.105, unknown]
         */
        .split(' ')
        /**
         * filter for entity that matches the version pattern, e.g. `124.0.2478.105`
         */
        .filter((v) => v.match(/\d+\.\d+\.\d+\.\d+/g))
        /**
         * get the first entity
         */
        .pop();
}
export async function fetchVersion(edgeVersion) {
    const p = os.platform();
    const platform = p === 'win32' ? 'win' : p === 'darwin' ? 'mac' : 'linux';
    /**
     * if version has 4 digits it is a valid version, e.g. 109.0.1467.0
     */
    if (edgeVersion.split('.').length === 4) {
        return edgeVersion;
    }
    /**
     * if browser version is a tagged version, e.g. stable, beta, dev, canary
     */
    if (TAGGED_VERSIONS.includes(edgeVersion.toLowerCase())) {
        const apiResponse = await fetch(EDGE_PRODUCTS_API, fetchOpts).catch((err) => {
            log.error(`Couldn't fetch version from ${EDGE_PRODUCTS_API}: ${err.stack}`);
            return { json: async () => [] };
        });
        const products = await apiResponse.json();
        const product = products.find((p) => p.Product.toLowerCase() === edgeVersion.toLowerCase());
        const productVersion = product?.Releases.find((r) => (
        /**
         * On Mac we all product versions are universal to its architecture
         */
        (platform === 'mac' && r.Platform === 'MacOS') ||
            /**
             * On Windows we need to check for the architecture
             */
            (platform === 'win' && r.Platform === 'Windows' && os.arch() === r.Architecture) ||
            /**
             * On Linux we only have one architecture
             */
            (platform === 'linux' && r.Platform === 'Linux')))?.ProductVersion;
        if (productVersion) {
            return productVersion;
        }
        const res = await fetch(format(TAGGED_VERSION_URL, edgeVersion.toUpperCase()), fetchOpts);
        return sanitizeVersion(await res.text());
    }
    /**
     * check for a number in the version and check for that
     */
    const MATCH_VERSION = /\d+/g;
    if (edgeVersion.match(MATCH_VERSION)) {
        const [major] = edgeVersion.match(MATCH_VERSION);
        const url = format(LATEST_RELEASE_URL, major.toString().toUpperCase(), platform.toUpperCase());
        log.info(`Fetching latest version from ${url}`);
        const res = await fetch(url, fetchOpts);
        if (!res.ok || res.status !== 200) {
            throw new Error(`Couldn't detect version for ${edgeVersion}`);
        }
        return sanitizeVersion(await res.text());
    }
    throw new Error(`Couldn't detect version for ${edgeVersion}`);
}
async function downloadZip(res, cacheDir) {
    const zipBlob = await res.blob();
    const zip = new ZipReader(new BlobReader(zipBlob));
    for (const entry of await zip.getEntries()) {
        const unzippedFilePath = path.join(cacheDir, entry.filename);
        if (entry.directory) {
            continue;
        }
        if (!await hasAccess(path.dirname(unzippedFilePath))) {
            await fsp.mkdir(path.dirname(unzippedFilePath), { recursive: true });
        }
        const content = await entry.getData(new BlobWriter());
        await writeFile(unzippedFilePath, content.stream());
    }
}
/**
 * Fetching the latest version from the CDN contains extra characters that need to be removed,
 * e.g. "��127.0.2651.87\n\n"
 */
function sanitizeVersion(version) {
    return version.replace(/\0/g, '').slice(2).trim();
}
/**
 * download on install
 */
if (process.argv[1] && process.argv[1].endsWith('/dist/install.js') && Boolean(process.env.EDGEDRIVER_AUTO_INSTALL)) {
    await download().then(() => log.info('Success!'), (err) => log.error(`Failed to install Edgedriver: ${err.stack}`));
}
//# sourceMappingURL=install.js.map