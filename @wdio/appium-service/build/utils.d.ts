import type { ArgValue, KeyValueArgs } from './types.js';
/**
 * Resolves the given path into a absolute path and appends the default filename as fallback when the provided path is a directory.
 * @param  {string} filePath         relative file or directory path
 * @param  {string} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
export declare function getFilePath(filePath: string, defaultFilename: string): string;
export declare function formatCliArgs(args: KeyValueArgs): string[];
export declare function sanitizeCliOptionValue(value: ArgValue): string;
export declare function isWindows(): boolean;
//# sourceMappingURL=utils.d.ts.map