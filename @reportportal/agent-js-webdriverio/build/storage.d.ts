import { TestStats } from '@wdio/reporter';
import { AdditionalData, Suite, TestItem } from './models';
export declare class Storage {
    private suites;
    private additionalSuitesData;
    private testItems;
    addSuite(data: Suite): void;
    getAllSuites(): Suite[];
    getCurrentSuite(): Suite;
    removeSuite(suiteId: string): void;
    addAdditionalSuiteData(key: string, data: AdditionalData): void;
    getAdditionalSuiteData(key: string): AdditionalData;
    addTest(data: TestItem): void;
    updateCurrentTest(data: Partial<TestItem>): void;
    getCurrentTest(): TestItem;
    removeTest(testId: string): void;
    hasTest({ title }: TestStats): boolean;
}
