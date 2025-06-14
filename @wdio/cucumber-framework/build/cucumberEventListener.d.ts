/// <reference types="node" />
import { EventEmitter } from 'events';
import { PickleFilter } from '@cucumber/cucumber';
import { Pickle, TestCase, TestStepResult, TestCaseStarted, GherkinDocument, TestStepStarted, TestStepFinished } from '@cucumber/messages';
import type { Capabilities } from '@wdio/types';
import { HookParams } from './types';
export default class CucumberEventListener extends EventEmitter {
    #private;
    private _pickleFilter;
    private _gherkinDocEvents;
    private _scenarios;
    private _testCases;
    private _currentTestCase?;
    private _currentPickle?;
    private _suiteMap;
    private _pickleMap;
    private _currentDoc;
    private _startedFeatures;
    constructor(eventBroadcaster: EventEmitter, _pickleFilter: PickleFilter);
    usesSpecGrouping(): boolean;
    featureIsStarted(feature: string): boolean;
    onGherkinDocument(gherkinDocEvent: GherkinDocument): void;
    onPickleAccepted(pickleEvent: Pickle): void;
    onTestRunStarted(): void;
    onTestCasePrepared(testCase: TestCase): void;
    onTestCaseStarted(testcase: TestCaseStarted): void;
    onTestStepStarted(testStepStartedEvent: TestStepStarted): void;
    onTestStepFinished(testStepFinishedEvent: TestStepFinished): void;
    onTestCaseFinished(results: TestStepResult[]): void;
    onTestRunFinished(): void;
    getHookParams(): HookParams | undefined;
    /**
     * returns a list of pickles to run based on capability tags
     * @param caps session capabilities
     */
    getPickleIds(caps: Capabilities.RemoteCapability): string[];
}
//# sourceMappingURL=cucumberEventListener.d.ts.map