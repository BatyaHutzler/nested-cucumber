"use strict";
/*
 *  Copyright 2021 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limit = exports.parseTags = exports.getCodeRef = exports.getStartLaunchObj = exports.getSystemAttributes = exports.getAgentInfo = exports.getClientConfig = exports.promiseErrorHandler = void 0;
const json_stringify_safe_1 = __importDefault(require("json-stringify-safe"));
const path_1 = __importDefault(require("path"));
// @ts-ignore
const package_json_1 = require("../package.json");
const constants_1 = require("./constants");
const promiseErrorHandler = (promise) => {
    promise.catch((err) => {
        console.error(err);
    });
};
exports.promiseErrorHandler = promiseErrorHandler;
const getClientConfig = (options) => {
    const { endpoint, launch, project, rerun, rerunOf, skippedIssue, description, attributes, mode, debug, headers, restClientConfig, isLaunchMergeRequired, launchUuidPrint, launchUuidPrintOutput, } = options;
    let apiKey = options.apiKey;
    if (!apiKey) {
        apiKey = options.token;
        if (apiKey) {
            console.warn('ReportPortal warning. Option "token" is deprecated. Use "apiKey" instead.');
        }
    }
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ apiKey,
        endpoint,
        launch,
        project }, (rerun && { rerun })), (rerunOf && { rerunOf })), (skippedIssue && { skippedIssue })), (description && { description })), (attributes && { attributes })), (mode && { mode })), (debug && { debug })), (headers && { headers })), (restClientConfig && { restClientConfig })), { launchUuidPrint,
        launchUuidPrintOutput,
        isLaunchMergeRequired });
};
exports.getClientConfig = getClientConfig;
const getAgentInfo = () => ({
    name: package_json_1.name,
    version: package_json_1.version,
});
exports.getAgentInfo = getAgentInfo;
const getSystemAttributes = (config) => {
    const { skippedIssue } = config;
    const systemAttributes = [
        {
            key: 'agent',
            value: `${package_json_1.name}|${package_json_1.version}`,
            system: true,
        },
    ];
    if (skippedIssue === false) {
        const skippedIssueAttribute = {
            key: 'skippedIssue',
            value: 'false',
            system: true,
        };
        systemAttributes.push(skippedIssueAttribute);
    }
    return systemAttributes;
};
exports.getSystemAttributes = getSystemAttributes;
const getStartLaunchObj = (config, launchObj = {}) => {
    const systemAttributes = (0, exports.getSystemAttributes)(config);
    const { description, attributes, rerun, rerunOf, mode, launchId } = config;
    return Object.assign({ description, attributes: [...(attributes || []), ...systemAttributes], rerun,
        rerunOf, mode: mode || constants_1.LAUNCH_MODES.DEFAULT, id: process.env.RP_LAUNCH_ID || launchId }, launchObj);
};
exports.getStartLaunchObj = getStartLaunchObj;
const getCodeRef = (filePath, title, ancestors) => {
    const relativePath = path_1.default.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const ancestorsTitles = ancestors.map((item) => item.name);
    return [relativePath, ...ancestorsTitles, title].join('/');
};
exports.getCodeRef = getCodeRef;
const parseTags = (tags) => {
    return tags
        .map((item) => {
        if (typeof item === 'string')
            return null;
        const tag = item.name.slice(1);
        if (tag.includes(':')) {
            const [key, value] = tag.split(':');
            return { key, value };
        }
        else {
            return { value: tag };
        }
    })
        .filter(Boolean);
};
exports.parseTags = parseTags;
const limit = (val) => {
    if (!val) {
        return val;
    }
    const OBJ_LENGTH = 10;
    const ARR_LENGTH = 10;
    const STRING_LIMIT = 1000;
    const STRING_TRUNCATE = 200;
    let value = JSON.parse((0, json_stringify_safe_1.default)(val));
    switch (Object.prototype.toString.call(value)) {
        case '[object String]':
            if (value.length > STRING_LIMIT) {
                return `${value.substr(0, STRING_TRUNCATE)} ... (${value.length - STRING_TRUNCATE} more bytes)`;
            }
            return value;
        case '[object Array]': {
            const { length } = value;
            if (length > ARR_LENGTH) {
                value = value.slice(0, ARR_LENGTH);
                value.push(`(${length - ARR_LENGTH} more items)`);
            }
            return value.map(exports.limit);
        }
        case '[object Object]': {
            const keys = Object.keys(value);
            const removed = [];
            for (let i = 0, l = keys.length; i < l; i += 1) {
                if (i < OBJ_LENGTH) {
                    value[keys[i]] = (0, exports.limit)(value[keys[i]]);
                }
                else {
                    delete value[keys[i]];
                    removed.push(keys[i]);
                }
            }
            if (removed.length) {
                value._ = `${keys.length - OBJ_LENGTH} more keys: ${JSON.stringify(removed)}`;
            }
            return value;
        }
        default: {
            return value;
        }
    }
};
exports.limit = limit;
//# sourceMappingURL=utils.js.map