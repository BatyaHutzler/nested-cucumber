import { Reporters } from '@wdio/types';
import { Tag } from '@wdio/reporter/build/types';
import { Attribute, ClientConfig, LaunchObj, Suite } from './models';
export declare const promiseErrorHandler: (promise: Promise<any>) => void;
export declare const getClientConfig: (options: Partial<Reporters.Options>) => ClientConfig;
export declare const getAgentInfo: () => {
    version: string;
    name: string;
};
export declare const getSystemAttributes: (config: Partial<Reporters.Options>) => Attribute[];
export declare const getStartLaunchObj: (config: Partial<Reporters.Options>, launchObj?: LaunchObj) => LaunchObj;
export declare const getCodeRef: (filePath: string, title: string, ancestors: Suite[]) => string;
export declare const parseTags: (tags: string[] | Tag[]) => Attribute[];
export declare const limit: (val: any) => any;
