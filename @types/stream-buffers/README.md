# Installation
> `npm install --save @types/stream-buffers`

# Summary
This package contains type definitions for stream-buffers (https://github.com/samcday/node-stream-buffer#readme).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/stream-buffers.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/stream-buffers/index.d.ts)
````ts
/// <reference types="node" />
import * as stream from "stream";

export interface WritableStreamBufferOptions extends stream.WritableOptions {
    initialSize?: number | undefined;
    incrementAmount?: number | undefined;
}

export class WritableStreamBuffer extends stream.Writable {
    constructor(options?: WritableStreamBufferOptions);
    size(): number;
    maxSize(): number;
    getContents(length?: number): Buffer | false;
    getContentsAsString(encoding?: string, length?: number): string | false;
}

export interface ReadableStreamBufferOptions extends stream.ReadableOptions {
    frequency?: number | undefined;
    chunkSize?: number | undefined;
    initialSize?: number | undefined;
    incrementAmount?: number | undefined;
}

export class ReadableStreamBuffer extends stream.Readable {
    constructor(options?: ReadableStreamBufferOptions);
    put(data: string | Buffer, encoding?: string): void;
    stop(): void;
    size(): number;
    maxSize(): number;
}

export const DEFAULT_INITIAL_SIZE: number;
export const DEFAULT_INCREMENT_AMOUNT: number;
export const DEFAULT_FREQUENCY: number;
export const DEFAULT_CHUNK_SIZE: number;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 15:11:36 GMT
 * Dependencies: [@types/node](https://npmjs.com/package/@types/node)

# Credits
These definitions were written by [Jason Dent](https://github.com/Jason3S).
