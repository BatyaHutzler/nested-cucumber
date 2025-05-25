import WDIOReporter, { AfterCommandArgs, BeforeCommandArgs, RunnerStats, SuiteStats, TestStats } from '@wdio/reporter';
import { Reporters } from '@wdio/types';
import { RP_STATUSES } from './constants';
import { Attribute, LogRQ } from './models';
export declare class Reporter extends WDIOReporter {
    private client;
    private tempLaunchId;
    private customLaunchStatus;
    private storage;
    private syncReporting;
    private testFilePath;
    private isMultiremote;
    private sanitizedCapabilities;
    constructor(options: Partial<Reporters.Options>);
    registerRPListeners(): void;
    unregisterRPListeners(): void;
    get isSynchronised(): boolean;
    set isSynchronised(val: boolean);
    onRunnerStart(runnerStats: Partial<RunnerStats>): void;
    onSuiteStart(suiteStats: SuiteStats): void;
    onTestStart(testStats: TestStats): void;
    onTestPass(testStats: TestStats): void;
    onTestSkip(testStats: TestStats): void;
    onTestFail(testStats: TestStats): void;
    finishTest(testStats: TestStats): void;
    onSuiteEnd(suiteStats: SuiteStats): void;
    onRunnerEnd(): Promise<void>;
    onBeforeCommand(command: BeforeCommandArgs): void;
    onAfterCommand(command: AfterCommandArgs): void;
    addAttributes({ attributes, suite }: {
        attributes: Attribute[];
        suite?: string;
    }): void;
    setDescription({ text, suite }: {
        text: string;
        suite?: string;
    }): void;
    setLaunchStatus(status: RP_STATUSES): void;
    setStatus({ status, suite }: {
        status: RP_STATUSES;
        suite?: string;
    }): void;
    setTestCaseId({ testCaseId, suite }: {
        testCaseId: string;
        suite?: string;
    }): void;
    sendTestItemLog({ log, suite }: {
        log: LogRQ;
        suite?: string;
    }): void;
    sendLaunchLog(log: LogRQ): void;
    sendLog(tempId: string, { level, message, file }: LogRQ): void;
}
