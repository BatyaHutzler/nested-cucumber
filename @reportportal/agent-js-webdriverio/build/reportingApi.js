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
exports.ReportingApi = void 0;
const publicReportingAPI_1 = __importDefault(require("@reportportal/client-javascript/lib/publicReportingAPI"));
const statuses_1 = require("@reportportal/client-javascript/lib/constants/statuses");
const constants_1 = require("./constants");
exports.ReportingApi = {
    addAttributes: (attributes, suite) => publicReportingAPI_1.default.addAttributes(attributes, suite),
    setDescription: (text, suite) => publicReportingAPI_1.default.setDescription(text, suite),
    setTestCaseId: (testCaseId, suite) => publicReportingAPI_1.default.setTestCaseId(testCaseId, suite),
    setLaunchStatus: (status) => publicReportingAPI_1.default.setLaunchStatus(status),
    setLaunchStatusPassed: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.PASSED),
    setLaunchStatusFailed: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.FAILED),
    setLaunchStatusSkipped: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.SKIPPED),
    setLaunchStatusStopped: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.STOPPED),
    setLaunchStatusInterrupted: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.INTERRUPTED),
    setLaunchStatusCancelled: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.CANCELLED),
    setLaunchStatusInfo: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.INFO),
    setLaunchStatusWarn: () => publicReportingAPI_1.default.setLaunchStatus(statuses_1.RP_STATUSES.WARN),
    setStatus: (status, suite) => publicReportingAPI_1.default.setStatus(status, suite),
    setStatusPassed: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.PASSED, suite),
    setStatusFailed: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.FAILED, suite),
    setStatusSkipped: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.SKIPPED, suite),
    setStatusStopped: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.STOPPED, suite),
    setStatusInterrupted: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.INTERRUPTED, suite),
    setStatusCancelled: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.CANCELLED, suite),
    setStatusInfo: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.INFO, suite),
    setStatusWarn: (suite) => publicReportingAPI_1.default.setStatus(statuses_1.RP_STATUSES.WARN, suite),
    log: (level, message, file, suite) => publicReportingAPI_1.default.addLog({ level, file, message }, suite),
    trace: (message, file, suite) => exports.ReportingApi.log(constants_1.LOG_LEVELS.TRACE, message, file, suite),
    debug: (message, file, suite) => exports.ReportingApi.log(constants_1.LOG_LEVELS.DEBUG, message, file, suite),
    info: (message, file, suite) => exports.ReportingApi.log(constants_1.LOG_LEVELS.INFO, message, file, suite),
    warn: (message, file, suite) => exports.ReportingApi.log(constants_1.LOG_LEVELS.WARN, message, file, suite),
    error: (message, file, suite) => exports.ReportingApi.log(constants_1.LOG_LEVELS.ERROR, message, file, suite),
    fatal: (message, file, suite) => exports.ReportingApi.log(constants_1.LOG_LEVELS.FATAL, message, file, suite),
    launchLog: (level, message, file) => publicReportingAPI_1.default.addLaunchLog({ level, message, file }),
    launchTrace: (message, file) => exports.ReportingApi.launchLog(constants_1.LOG_LEVELS.TRACE, message, file),
    launchDebug: (message, file) => exports.ReportingApi.launchLog(constants_1.LOG_LEVELS.DEBUG, message, file),
    launchInfo: (message, file) => exports.ReportingApi.launchLog(constants_1.LOG_LEVELS.INFO, message, file),
    launchWarn: (message, file) => exports.ReportingApi.launchLog(constants_1.LOG_LEVELS.WARN, message, file),
    launchError: (message, file) => exports.ReportingApi.launchLog(constants_1.LOG_LEVELS.ERROR, message, file),
    launchFatal: (message, file) => exports.ReportingApi.launchLog(constants_1.LOG_LEVELS.FATAL, message, file),
};
//# sourceMappingURL=reportingApi.js.map