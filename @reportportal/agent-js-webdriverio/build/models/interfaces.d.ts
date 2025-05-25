/// <reference types="node" />
import { FILE_TYPES, LOG_LEVELS, TYPES, LAUNCH_MODES } from '../constants';
type launchMode = LAUNCH_MODES.DEFAULT | LAUNCH_MODES.DEBUG;
export interface ClientConfig {
    apiKey: string;
    endpoint: string;
    launch: string;
    project: string;
    description?: string;
    attributes?: Attribute[];
    headers?: BaseObj;
    mode?: launchMode;
    debug?: boolean;
    isLaunchMergeRequired?: boolean;
    launchUuidPrint?: boolean;
    launchUuidPrintOutput?: string;
    token?: string;
}
export interface Config extends ClientConfig {
    skippedIssue?: boolean;
    rerun?: boolean;
    rerunOf?: string;
    seleniumCommandsLogLevel?: LOG_LEVELS;
    reportSeleniumCommands?: boolean;
    launchId?: string;
}
export interface LaunchObj {
    name?: string;
    startTime?: Date | number;
    description?: string;
    attributes?: Attribute[];
    mode?: launchMode;
    rerun?: boolean;
    rerunOf?: string;
    id?: string;
}
export interface LaunchFinishObj {
    endTime?: Date | number;
    status?: string;
}
export interface StartTestItem {
    name: string;
    type: TYPES;
    startTime?: Date | number;
    description?: string;
    attributes?: Attribute[];
    codeRef?: string;
}
export interface LogRQ {
    level?: LOG_LEVELS;
    message?: string;
    time?: number;
    file?: Attachment;
}
export interface Attachment {
    name: string;
    type: FILE_TYPES;
    content: string | Buffer;
}
export interface Attribute {
    value: string;
    key?: string;
    system?: boolean;
}
export interface BaseObj {
    [name: string]: string;
}
export interface Issue {
    issueType: string;
    comment?: string;
    externalSystemIssues?: ExternalSystemIssue[];
}
export interface ExternalSystemIssue {
    submitter: string;
    systemId: string;
    ticketId: string;
    url: string;
    submitDate?: Date | number;
}
export interface Suite {
    id: string;
    name: string;
    codeRef?: string;
}
export interface TestItem {
    id: string;
    name: string;
    attributes?: Attribute[];
    description?: string;
    status?: string;
    testCaseId?: string;
}
export interface FinishTestItem {
    endTime?: Date | number;
    status?: string;
    issue?: Issue;
    codeRef?: string;
    attributes?: Attribute[];
}
export interface AdditionalData {
    attributes?: Attribute[];
    description?: string;
    status?: string;
    logs?: LogRQ[];
    testCaseId?: string;
}
export interface AdditionalSuitesData {
    [name: string]: AdditionalData;
}
export {};
