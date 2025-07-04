/// <reference types="node" />
/// <reference types="node" />
import type { CDPSession } from 'puppeteer-core/lib/cjs/puppeteer/common/Connection';
import type Protocol from 'devtools-protocol';
import Interception from '.';
import type { Matches, MockOverwrite, MockResponseParams } from './types';
type ClientResponse = {
    body: string;
    base64Encoded?: boolean;
};
interface HeaderEntry {
    name: string;
    value: string;
}
type Event = {
    requestId: string;
    request: Matches & {
        mockedResponse: string | Buffer;
    };
    responseStatusCode?: number;
    responseHeaders: HeaderEntry[];
};
export default class DevtoolsInterception extends Interception {
    static handleRequestInterception(client: CDPSession, mocks: Set<Interception>): (event: Event) => Promise<void | ClientResponse>;
    /**
     * allows access to all requests made with given pattern
     */
    get calls(): Matches[];
    /**
     * Resets all information stored in the `mock.calls` set.
     */
    clear(): void;
    /**
     * Does everything that `mock.clear()` does, and also
     * removes any mocked return values or implementations.
     */
    restore(): void;
    /**
     * Always respond with same overwrite
     * @param {*} overwrites  payload to overwrite the response
     * @param {*} params      additional respond parameters to overwrite
     */
    respond(overwrite: MockOverwrite, params?: MockResponseParams): void;
    /**
     * Respond request once with given overwrite
     * @param {*} overwrites  payload to overwrite the response
     * @param {*} params      additional respond parameters to overwrite
     */
    respondOnce(overwrite: MockOverwrite, params?: MockResponseParams): void;
    /**
     * Abort the request with an error code
     * @param {string} errorCode  error code of the response
     */
    abort(errorReason: Protocol.Network.ErrorReason, sticky?: boolean): void;
    /**
     * Abort the request once with an error code
     * @param {string} errorReason  error code of the response
     */
    abortOnce(errorReason: Protocol.Network.ErrorReason): void;
}
export {};
//# sourceMappingURL=devtools.d.ts.map