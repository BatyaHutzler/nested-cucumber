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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const reporter_1 = __importDefault(require("@wdio/reporter"));
const client_javascript_1 = __importDefault(require("@reportportal/client-javascript"));
const events_1 = require("@reportportal/client-javascript/lib/constants/events");
const storage_1 = require("./storage");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
class Reporter extends reporter_1.default {
    constructor(options) {
        super(options);
        this.options = Object.assign({ seleniumCommandsLogLevel: 'info', launchId: process.env.RP_LAUNCH_ID || options.launchId }, options);
        const agentInfo = (0, utils_1.getAgentInfo)();
        const clientConfig = (0, utils_1.getClientConfig)(this.options);
        this.syncReporting = false;
        this.client = new client_javascript_1.default(clientConfig, agentInfo);
        this.storage = new storage_1.Storage();
        this.registerRPListeners();
    }
    registerRPListeners() {
        process.on(events_1.EVENTS.ADD_ATTRIBUTES, this.addAttributes.bind(this));
        process.on(events_1.EVENTS.SET_DESCRIPTION, this.setDescription.bind(this));
        process.on(events_1.EVENTS.SET_LAUNCH_STATUS, this.setLaunchStatus.bind(this));
        process.on(events_1.EVENTS.SET_STATUS, this.setStatus.bind(this));
        process.on(events_1.EVENTS.ADD_LOG, this.sendTestItemLog.bind(this));
        process.on(events_1.EVENTS.ADD_LAUNCH_LOG, this.sendLaunchLog.bind(this));
        process.on(events_1.EVENTS.SET_TEST_CASE_ID, this.setTestCaseId.bind(this));
    }
    unregisterRPListeners() {
        process.off(events_1.EVENTS.ADD_ATTRIBUTES, this.addAttributes.bind(this));
        process.off(events_1.EVENTS.SET_DESCRIPTION, this.setDescription.bind(this));
        process.off(events_1.EVENTS.SET_LAUNCH_STATUS, this.setLaunchStatus.bind(this));
        process.off(events_1.EVENTS.SET_STATUS, this.setStatus.bind(this));
        process.off(events_1.EVENTS.ADD_LOG, this.sendTestItemLog.bind(this));
        process.off(events_1.EVENTS.ADD_LAUNCH_LOG, this.sendLaunchLog.bind(this));
        process.off(events_1.EVENTS.SET_TEST_CASE_ID, this.setTestCaseId.bind(this));
    }
    get isSynchronised() {
        return this.syncReporting;
    }
    set isSynchronised(val) {
        this.syncReporting = val;
    }
    onRunnerStart(runnerStats) {
        const launchDataRQ = (0, utils_1.getStartLaunchObj)(this.options);
        const { tempId, promise } = this.client.startLaunch(launchDataRQ);
        this.isMultiremote = runnerStats.isMultiremote;
        this.sanitizedCapabilities = runnerStats.sanitizedCapabilities;
        (0, utils_1.promiseErrorHandler)(promise);
        this.tempLaunchId = tempId;
    }
    onSuiteStart(suiteStats) {
        var _a;
        const suiteItem = this.storage.getCurrentSuite();
        const parentId = suiteItem ? suiteItem.id : null;
        const { title: name } = suiteStats;
        this.testFilePath = suiteStats.file;
        const ancestors = this.storage.getAllSuites();
        const codeRef = (0, utils_1.getCodeRef)(this.testFilePath, name, ancestors);
        const suiteDataRQ = {
            name,
            type: parentId ? constants_1.TYPES.TEST : constants_1.TYPES.SUITE,
            codeRef,
        };
        const isCucumberFeature = suiteStats.type === constants_1.CUCUMBER_TYPE.FEATURE;
        if (isCucumberFeature && suiteStats.tags.length > 0) {
            suiteDataRQ.attributes = (0, utils_1.parseTags)(suiteStats.tags);
        }
        if (isCucumberFeature && suiteStats.description) {
            suiteDataRQ.description = suiteStats.description;
        }
        if (this.options.cucumberNestedSteps) {
            suiteDataRQ.type = isCucumberFeature ? constants_1.TYPES.TEST : constants_1.TYPES.STEP;
        }
        const { tempId, promise } = this.client.startTestItem(suiteDataRQ, this.tempLaunchId, parentId);
        (0, utils_1.promiseErrorHandler)(promise);
        const additionalData = this.storage.getAdditionalSuiteData(name);
        if (((_a = additionalData.logs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            additionalData.logs.forEach((log) => this.sendLog(tempId, log));
        }
        this.storage.addSuite({ id: tempId, name });
    }
    onTestStart(testStats) {
        const { id: parentId } = this.storage.getCurrentSuite();
        const { title: name } = testStats;
        const ancestors = this.storage.getAllSuites();
        const codeRef = (0, utils_1.getCodeRef)(this.testFilePath, name, ancestors);
        const testItemDataRQ = Object.assign(Object.assign({ name, type: constants_1.TYPES.STEP, codeRef }, (this.options.cucumberNestedSteps && { hasStats: false })), (this.sanitizedCapabilities && {
            parameters: [{ key: constants_1.BROWSER_PARAM, value: this.sanitizedCapabilities }],
        }));
        const { tempId, promise } = this.client.startTestItem(testItemDataRQ, this.tempLaunchId, parentId);
        (0, utils_1.promiseErrorHandler)(promise);
        this.storage.addTest({ name, id: tempId });
    }
    onTestPass(testStats) {
        this.finishTest(testStats);
    }
    onTestSkip(testStats) {
        if (!this.storage.hasTest(testStats)) {
            this.onTestStart(testStats);
        }
        this.finishTest(testStats);
    }
    onTestFail(testStats) {
        const testItem = this.storage.getCurrentTest();
        testStats.errors.forEach((error, idx) => {
            const logRQ = {
                level: constants_1.LOG_LEVELS.ERROR,
                message: error.stack,
            };
            this.client.sendLog(testItem.id, logRQ);
            if (idx === testStats.errors.length - 1) {
                const lastError = `\`\`\`error\n${error.stack}\n\`\`\``;
                this.storage.updateCurrentTest({
                    description: testItem.description ? `${testItem.description}\n${lastError}` : lastError,
                });
            }
        });
        this.finishTest(testStats);
    }
    finishTest(testStats) {
        const { id, attributes, description, status: customStatus, testCaseId, } = this.storage.getCurrentTest();
        const { state: status } = testStats;
        const withoutIssue = status === constants_1.RP_STATUSES.SKIPPED && this.options.skippedIssue === false;
        const finishTestItemRQ = Object.assign(Object.assign(Object.assign(Object.assign({ status: customStatus || status }, (attributes && { attributes })), (description && { description })), (testCaseId && { testCaseId })), (withoutIssue && { issue: { issueType: 'NOT_ISSUE' } }));
        const { promise } = this.client.finishTestItem(id, finishTestItemRQ);
        (0, utils_1.promiseErrorHandler)(promise);
        this.storage.removeTest(id);
    }
    onSuiteEnd(suiteStats) {
        const { id, name } = this.storage.getCurrentSuite();
        const { status: customStatus, attributes, description, testCaseId, } = this.storage.getAdditionalSuiteData(name);
        let status = customStatus;
        if (this.options.cucumberNestedSteps && suiteStats.type === constants_1.CUCUMBER_TYPE.SCENARIO) {
            const isAllStepsPassed = suiteStats.tests.every((test) => test.state === constants_1.RP_STATUSES.PASSED);
            status = customStatus || (isAllStepsPassed ? constants_1.RP_STATUSES.PASSED : constants_1.RP_STATUSES.FAILED);
        }
        const finishTestItemData = Object.assign(Object.assign(Object.assign(Object.assign({}, (status && { status })), (attributes && { attributes })), (description && { description })), (testCaseId && { testCaseId }));
        const { promise } = this.client.finishTestItem(id, finishTestItemData);
        (0, utils_1.promiseErrorHandler)(promise);
        this.storage.removeSuite(id);
    }
    onRunnerEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.getPromiseFinishAllItems(this.tempLaunchId);
                if (!this.options.launchId) {
                    const { promise } = yield this.client.finishLaunch(this.tempLaunchId, Object.assign({}, (this.customLaunchStatus && { status: this.customLaunchStatus })));
                    (0, utils_1.promiseErrorHandler)(promise);
                    yield promise;
                }
                this.tempLaunchId = null;
                this.customLaunchStatus = null;
            }
            catch (e) {
                console.error(e);
            }
            finally {
                this.unregisterRPListeners();
                this.isSynchronised = true;
            }
        });
    }
    onBeforeCommand(command) {
        if (!this.options.reportSeleniumCommands || this.isMultiremote) {
            return;
        }
        const method = `${command.method} ${command.endpoint}`;
        if (command.body && Object.keys(command.body).length !== 0) {
            const data = JSON.stringify((0, utils_1.limit)(command.body));
            this.sendTestItemLog({
                log: { level: this.options.seleniumCommandsLogLevel, message: `${method} ${data}` },
            });
        }
        else {
            this.sendTestItemLog({
                log: { level: this.options.seleniumCommandsLogLevel, message: `${method}` },
            });
        }
    }
    onAfterCommand(command) {
        const hasScreenshot = /screenshot$/.test(command.endpoint) && !!command.result.value;
        const testItem = this.storage.getCurrentTest();
        const { seleniumCommandsLogLevel, reportSeleniumCommands } = this.options;
        if (reportSeleniumCommands) {
            const method = `${command.method} ${command.endpoint}`;
            const data = JSON.stringify((0, utils_1.limit)(command.result));
            this.sendTestItemLog({
                log: { message: `${method} ${data}`, level: seleniumCommandsLogLevel },
            });
        }
        if (hasScreenshot && this.options.attachPicturesToLogs && testItem) {
            const logRQ = {
                level: constants_1.LOG_LEVELS.INFO,
                file: {
                    name: 'screenshot',
                    type: constants_1.FILE_TYPES.PNG,
                    content: command.result.value,
                },
            };
            this.sendLog(testItem.id, logRQ);
        }
    }
    addAttributes({ attributes, suite }) {
        if (!attributes || !(attributes instanceof Array)) {
            console.error('Attributes should be instance of Array');
            return;
        }
        if (attributes && suite) {
            const data = this.storage.getAdditionalSuiteData(suite);
            const newData = { attributes: (data.attributes || []).concat(attributes) };
            this.storage.addAdditionalSuiteData(suite, newData);
        }
        else {
            this.storage.updateCurrentTest({ attributes });
        }
    }
    setDescription({ text, suite }) {
        if (text && suite) {
            this.storage.addAdditionalSuiteData(suite, { description: text });
        }
        else {
            this.storage.updateCurrentTest({ description: text });
        }
    }
    setLaunchStatus(status) {
        this.customLaunchStatus = status;
    }
    setStatus({ status, suite }) {
        if (status && suite) {
            this.storage.addAdditionalSuiteData(suite, { status });
        }
        else {
            this.storage.updateCurrentTest({ status });
        }
    }
    setTestCaseId({ testCaseId, suite }) {
        if (testCaseId && suite) {
            this.storage.addAdditionalSuiteData(suite, { testCaseId });
        }
        else {
            this.storage.updateCurrentTest({ testCaseId });
        }
    }
    sendTestItemLog({ log, suite }) {
        if (log && suite) {
            const data = this.storage.getAdditionalSuiteData(suite);
            const newData = { logs: (data.logs || []).concat(log) };
            this.storage.addAdditionalSuiteData(suite, newData);
        }
        else {
            const testItem = this.storage.getCurrentTest();
            if (testItem) {
                this.sendLog(testItem.id, log);
            }
        }
    }
    sendLaunchLog(log) {
        if (this.tempLaunchId) {
            this.sendLog(this.tempLaunchId, log);
        }
    }
    sendLog(tempId, { level, message = '', file }) {
        this.client.sendLog(tempId, {
            message,
            level,
        }, file);
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=reporter.js.map