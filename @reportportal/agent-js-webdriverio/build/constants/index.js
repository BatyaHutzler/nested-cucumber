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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_PARAM = exports.LAUNCH_MODES = exports.FILE_TYPES = exports.LOG_LEVELS = exports.RP_STATUSES = exports.TYPES = exports.CUCUMBER_TYPE = void 0;
var testItemTypes_1 = require("./testItemTypes");
Object.defineProperty(exports, "CUCUMBER_TYPE", { enumerable: true, get: function () { return testItemTypes_1.CUCUMBER_TYPE; } });
Object.defineProperty(exports, "TYPES", { enumerable: true, get: function () { return testItemTypes_1.TYPES; } });
var statuses_1 = require("./statuses");
Object.defineProperty(exports, "RP_STATUSES", { enumerable: true, get: function () { return statuses_1.RP_STATUSES; } });
var logLevels_1 = require("./logLevels");
Object.defineProperty(exports, "LOG_LEVELS", { enumerable: true, get: function () { return logLevels_1.LOG_LEVELS; } });
var fileTypes_1 = require("./fileTypes");
Object.defineProperty(exports, "FILE_TYPES", { enumerable: true, get: function () { return fileTypes_1.FILE_TYPES; } });
var launchModes_1 = require("./launchModes");
Object.defineProperty(exports, "LAUNCH_MODES", { enumerable: true, get: function () { return launchModes_1.LAUNCH_MODES; } });
var parameters_1 = require("./parameters");
Object.defineProperty(exports, "BROWSER_PARAM", { enumerable: true, get: function () { return parameters_1.BROWSER_PARAM; } });
//# sourceMappingURL=index.js.map