"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CucumberEventListener_cwd;
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const cucumber_1 = require("@cucumber/cucumber");
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("./utils");
const node_path_1 = __importDefault(require("node:path"));
const log = (0, logger_1.default)('CucumberEventListener');
class CucumberEventListener extends events_1.EventEmitter {
    constructor(eventBroadcaster, _pickleFilter) {
        super();
        this._pickleFilter = _pickleFilter;
        _CucumberEventListener_cwd.set(this, process.cwd());
        this._gherkinDocEvents = [];
        this._scenarios = [];
        this._testCases = [];
        this._currentPickle = {};
        this._suiteMap = new Map();
        this._pickleMap = new Map();
        this._currentDoc = { comments: [] };
        this._startedFeatures = [];
        let results = [];
        eventBroadcaster.on('envelope', (envelope) => {
            if (envelope.gherkinDocument) {
                this.onGherkinDocument(envelope.gherkinDocument);
            }
            else if (envelope.testRunStarted) {
                this.onTestRunStarted();
            }
            else if (envelope.pickle) {
                this.onPickleAccepted(envelope.pickle);
            }
            else if (envelope.testCase) {
                this.onTestCasePrepared(envelope.testCase);
            }
            else if (envelope.testCaseStarted) {
                results = [];
                this.onTestCaseStarted(envelope.testCaseStarted);
            }
            else if (envelope.testStepStarted) {
                this.onTestStepStarted(envelope.testStepStarted);
            }
            else if (envelope.testStepFinished) {
                results.push(envelope.testStepFinished.testStepResult);
                this.onTestStepFinished(envelope.testStepFinished);
            }
            else if (envelope.testCaseFinished) {
                /**
                 * only store result if step isn't retried
                 */
                if (envelope.testCaseFinished.willBeRetried) {
                    return log.debug(`test case with id ${envelope.testCaseFinished.testCaseStartedId} will be retried, ignoring result`);
                }
                this.onTestCaseFinished(results);
            }
            else if (envelope.testRunFinished) {
                this.onTestRunFinished();
            }
            else if (envelope.source) {
                // do nothing for step definition patterns
            }
            else {
                /* istanbul ignore next */
                log.debug(`Unknown envelope received: ${JSON.stringify(envelope, null, 4)}`);
            }
        });
    }
    usesSpecGrouping() {
        return this._gherkinDocEvents.length > 1;
    }
    featureIsStarted(feature) {
        return this._startedFeatures.includes(feature);
    }
    // {
    //     "gherkinDocument": {
    //         "uri": "/Users/christianbromann/Sites/WebdriverIO/webdriverio/examples/wdio/cucumber/features/my-feature.feature",
    //         "feature": {
    //             "location": {
    //                 "line": 1,
    //                 "column": 1
    //             },
    //             "language": "en",
    //             "keyword": "Feature",
    //             "name": "Example feature",
    //             "description": "  As a user of WebdriverIO\n  I should be able to use different commands\n  to get informations about elements on the page",
    //             "children": [
    //                 {
    //                     "scenario": {
    //                         "location": {
    //                             "line": 6,
    //                             "column": 3
    //                         },
    //                         "keyword": "Scenario",
    //                         "name": "Get size of an element",
    //                         "steps": [
    //                             {
    //                                 "location": {
    //                                     "line": 7,
    //                                     "column": 5
    //                                 },
    //                                 "keyword": "Given ",
    //                                 "text": "I go on the website \"https://github.com/\"",
    //                                 "id": "0"
    //                             },
    //                             {
    //                                 "location": {
    //                                     "line": 8,
    //                                     "column": 5
    //                                 },
    //                                 "keyword": "Then ",
    //                                 "text": "should the element \".header-logged-out a\" be 32px wide and 35px high",
    //                                 "id": "1"
    //                             }
    //                         ],
    //                         "id": "2"
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // }
    onGherkinDocument(gherkinDocEvent) {
        this._currentPickle = { uri: gherkinDocEvent.uri, feature: gherkinDocEvent.feature };
        this._gherkinDocEvents.push(gherkinDocEvent);
    }
    // {
    //     "pickle": {
    //         "id": "5",
    //         "uri": "/Users/christianbromann/Sites/WebdriverIO/webdriverio/examples/wdio/cucumber/features/my-feature.feature",
    //         "name": "Get size of an element",
    //         "language": "en",
    //         "steps": [
    //             {
    //                 "text": "I go on the website \"https://github.com/\"",
    //                 "id": "3",
    //                 "astNodeIds": [
    //                     "0"
    //                 ]
    //             },
    //             {
    //                 "text": "should the element \".header-logged-out a\" be 32px wide and 35px high",
    //                 "id": "4",
    //                 "astNodeIds": [
    //                     "1"
    //                 ]
    //             }
    //         ],
    //         "astNodeIds": [
    //             "2"
    //         ]
    //     }
    // }
    onPickleAccepted(pickleEvent) {
        const id = this._suiteMap.size.toString();
        this._suiteMap.set(pickleEvent.id, id);
        this._pickleMap.set(id, pickleEvent.astNodeIds[0]);
        const scenario = { ...pickleEvent, id };
        this._scenarios.push(scenario);
    }
    // {
    //     "testRunStarted": {
    //         "timestamp": {
    //             "seconds": "1609002214",
    //             "nanos": 447000000
    //         }
    //     }
    // }
    onTestRunStarted() {
        if (this.usesSpecGrouping()) {
            return;
        }
        const doc = this._gherkinDocEvents[this._gherkinDocEvents.length - 1];
        this.emit('before-feature', doc.uri, doc.feature);
    }
    // {
    //     "testCase": {
    //         "id": "15",
    //         "pickleId": "5",
    //         "testSteps": [
    //             {
    //                 "id": "16",
    //                 "hookId": "13"
    //             },
    //             {
    //                 "id": "17",
    //                 "pickleStepId": "3",
    //                 "stepDefinitionIds": [
    //                     "6"
    //                 ],
    //                 "stepMatchArgumentsLists": [
    //                     {
    //                         "stepMatchArguments": [
    //                             {
    //                                 "group": {
    //                                     "start": 21,
    //                                     "value": "https://github.com/"
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": "18",
    //                 "pickleStepId": "4",
    //                 "stepDefinitionIds": [
    //                     "8"
    //                 ],
    //                 "stepMatchArgumentsLists": [
    //                     {
    //                         "stepMatchArguments": [
    //                             {
    //                                 "group": {
    //                                     "start": 20,
    //                                     "value": ".header-logged-out a"
    //                                 }
    //                             },
    //                             {
    //                                 "parameterTypeName": "int",
    //                                 "group": {
    //                                     "start": 45,
    //                                     "value": "32"
    //                                 }
    //                             },
    //                             {
    //                                 "parameterTypeName": "int",
    //                                 "group": {
    //                                     "start": 59,
    //                                     "value": "35"
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 "id": "19",
    //                 "hookId": "11"
    //             }
    //         ]
    //     }
    // }
    onTestCasePrepared(testCase) {
        this._testCases.push(testCase);
    }
    // {
    //     "testCaseStarted": {
    //         "timestamp": {
    //             "seconds": "1609002214",
    //             "nanos": 453000000
    //         },
    //         "attempt": 0,
    //         "testCaseId": "15",
    //         "id": "20"
    //     }
    // }
    onTestCaseStarted(testcase) {
        this._currentTestCase = testcase;
        const tc = this._testCases.find(tc => tc.id === testcase.testCaseId);
        const scenario = this._scenarios.find(sc => sc.id === this._suiteMap.get(tc === null || tc === void 0 ? void 0 : tc.pickleId));
        /* istanbul ignore if */
        if (!scenario) {
            return;
        }
        const doc = this._gherkinDocEvents.find(gde => gde.uri === (scenario === null || scenario === void 0 ? void 0 : scenario.uri));
        const uri = doc === null || doc === void 0 ? void 0 : doc.uri;
        const feature = doc === null || doc === void 0 ? void 0 : doc.feature;
        if (this._currentDoc.uri && this._currentDoc.feature && this.usesSpecGrouping() && doc != this._currentDoc && this.featureIsStarted(this._currentDoc.uri)) {
            this.emit('after-feature', this._currentDoc.uri, this._currentDoc.feature);
        }
        if (this.usesSpecGrouping() && doc && doc.uri && !this.featureIsStarted(doc.uri)) {
            this.emit('before-feature', doc.uri, doc.feature);
            this._currentDoc = doc;
            this._startedFeatures.push(doc.uri);
        }
        /**
         * The reporters need to have the keywords, like `Given|When|Then`. They are NOT available
         * on the scenario, they ARE on the feature.
         * This will aad them
         */
        if (scenario.steps && feature) {
            scenario.steps = (0, utils_1.addKeywordToStep)(scenario.steps, feature);
        }
        this._currentPickle = { uri, feature, scenario };
        let reporterScenario = scenario;
        reporterScenario.rule = (0, utils_1.getRule)(doc === null || doc === void 0 ? void 0 : doc.feature, this._pickleMap.get(scenario.id));
        this.emit('before-scenario', scenario.uri, doc === null || doc === void 0 ? void 0 : doc.feature, reporterScenario);
    }
    // {
    //     "testStepStarted": {
    //         "timestamp": {
    //             "seconds": "1609002214",
    //             "nanos": 454000000
    //         },
    //         "testStepId": "16",
    //         "testCaseStartedId": "20"
    //     }
    // }
    onTestStepStarted(testStepStartedEvent) {
        var _a, _b;
        const testcase = this._testCases.find((testcase) => this._currentTestCase && testcase.id === this._currentTestCase.testCaseId);
        const scenario = this._scenarios.find(sc => sc.id === this._suiteMap.get(testcase === null || testcase === void 0 ? void 0 : testcase.pickleId));
        const teststep = (_a = testcase === null || testcase === void 0 ? void 0 : testcase.testSteps) === null || _a === void 0 ? void 0 : _a.find((step) => step.id === testStepStartedEvent.testStepId);
        const step = ((_b = scenario === null || scenario === void 0 ? void 0 : scenario.steps) === null || _b === void 0 ? void 0 : _b.find((s) => s.id === (teststep === null || teststep === void 0 ? void 0 : teststep.pickleStepId))) || teststep;
        const doc = this._gherkinDocEvents.find(gde => gde.uri === (scenario === null || scenario === void 0 ? void 0 : scenario.uri));
        const uri = doc === null || doc === void 0 ? void 0 : doc.uri;
        const feature = doc === null || doc === void 0 ? void 0 : doc.feature;
        /* istanbul ignore if */
        if (!step) {
            return;
        }
        this._currentPickle = { uri, feature, scenario, step };
        this.emit('before-step', uri, feature, scenario, step);
    }
    // {
    //     "testStepFinished": {
    //         "testStepResult": {
    //             "status": "PASSED",
    //             "duration": {
    //                 "seconds": "0",
    //                 "nanos": 1000000
    //             }
    //         },
    //         "timestamp": {
    //             "seconds": "1609002214",
    //             "nanos": 455000000
    //         },
    //         "testStepId": "16",
    //         "testCaseStartedId": "20"
    //     }
    // }
    onTestStepFinished(testStepFinishedEvent) {
        var _a, _b;
        const testcase = this._testCases.find((testcase) => { var _a; return testcase.id === ((_a = this._currentTestCase) === null || _a === void 0 ? void 0 : _a.testCaseId); });
        const scenario = this._scenarios.find(sc => sc.id === this._suiteMap.get(testcase === null || testcase === void 0 ? void 0 : testcase.pickleId));
        const teststep = (_a = testcase === null || testcase === void 0 ? void 0 : testcase.testSteps) === null || _a === void 0 ? void 0 : _a.find((step) => step.id === testStepFinishedEvent.testStepId);
        const step = ((_b = scenario === null || scenario === void 0 ? void 0 : scenario.steps) === null || _b === void 0 ? void 0 : _b.find((s) => s.id === (teststep === null || teststep === void 0 ? void 0 : teststep.pickleStepId))) || teststep;
        const result = testStepFinishedEvent.testStepResult;
        const doc = this._gherkinDocEvents.find(gde => gde.uri === (scenario === null || scenario === void 0 ? void 0 : scenario.uri));
        const uri = doc === null || doc === void 0 ? void 0 : doc.uri;
        const feature = doc === null || doc === void 0 ? void 0 : doc.feature;
        /* istanbul ignore if */
        if (!step) {
            return;
        }
        this.emit('after-step', uri, feature, scenario, step, result);
        delete this._currentPickle;
    }
    // {
    //     "testCaseFinished": {
    //         "timestamp": {
    //             "seconds": "1609002223",
    //             "nanos": 913000000
    //         },
    //         "testCaseStartedId": "20"
    //     }
    // }
    onTestCaseFinished(results) {
        const tc = this._testCases.find(tc => { var _a; return tc.id === ((_a = this._currentTestCase) === null || _a === void 0 ? void 0 : _a.testCaseId); });
        const scenario = this._scenarios.find(sc => sc.id === this._suiteMap.get(tc === null || tc === void 0 ? void 0 : tc.pickleId));
        /* istanbul ignore if */
        if (!scenario) {
            return;
        }
        /**
         * propagate the first non passing result or the last one
         */
        const finalResult = results.find((r) => r.status !== cucumber_1.Status.PASSED) || results.pop();
        const doc = this._gherkinDocEvents.find(gde => gde.uri === (scenario === null || scenario === void 0 ? void 0 : scenario.uri));
        const uri = doc === null || doc === void 0 ? void 0 : doc.uri;
        const feature = doc === null || doc === void 0 ? void 0 : doc.feature;
        this._currentPickle = { uri, feature, scenario };
        this.emit('after-scenario', doc === null || doc === void 0 ? void 0 : doc.uri, doc === null || doc === void 0 ? void 0 : doc.feature, scenario, finalResult);
    }
    // testRunFinishedEvent = {
    //     "timestamp": {
    //         "seconds": "1609000747",
    //         "nanos": 793000000
    //     }
    // }
    onTestRunFinished() {
        delete this._currentTestCase;
        if (this.usesSpecGrouping()) {
            this.emit('after-feature', this._currentDoc.uri, this._currentDoc.feature);
            return;
        }
        const gherkinDocEvent = this._gherkinDocEvents.pop(); // see .push() in `handleBeforeFeature()`
        /* istanbul ignore if */
        if (!gherkinDocEvent) {
            return;
        }
        this.emit('after-feature', gherkinDocEvent.uri, gherkinDocEvent.feature);
    }
    getHookParams() {
        return this._currentPickle;
    }
    /**
     * returns a list of pickles to run based on capability tags
     * @param caps session capabilities
     */
    getPickleIds(caps) {
        const gherkinDocument = this._gherkinDocEvents[this._gherkinDocEvents.length - 1];
        const pickleIds = [...this._suiteMap.entries()]
            /**
             * match based on capability tags
            */
            .filter(([, fakeId]) => (0, utils_1.filterPickles)(caps, this._scenarios.find(s => s.id === fakeId)))
            /**
             * match based on Cucumber pickle filter
            */
            .filter(([, fakeId]) => {
                const pickle = { ...this._scenarios.find(s => s.id === fakeId) };
                pickle.uri = node_path_1.default.relative(__classPrivateFieldGet(this, _CucumberEventListener_cwd, "f"), pickle.uri);
                return this._pickleFilter.matches({
                    gherkinDocument,
                    pickle
                });
            })
            .map(([id]) => id);
        return pickleIds;
    }
}
_CucumberEventListener_cwd = new WeakMap();
exports.default = CucumberEventListener;
