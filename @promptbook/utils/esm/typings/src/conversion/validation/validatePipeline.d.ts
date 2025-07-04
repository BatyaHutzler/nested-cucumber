import type { PipelineJson } from '../../types/PipelineJson/PipelineJson';
/**
 * Validates PipelineJson if it is logically valid
 *
 * It checks:
 * -   if it has correct parameters dependency
 *
 * It does NOT check:
 * -   if it is valid json
 * -   if it is meaningful
 *
 * @param pipeline valid or invalid PipelineJson
 * @returns the same pipeline if it is logically valid
 * @throws {PipelineLogicError} on logical error in the pipeline
 * @public exported from `@promptbook/core`
 */
export declare function validatePipeline(pipeline: PipelineJson): PipelineJson;
/**
 * @private internal function for `validatePipeline`
 */
export declare function validatePipelineCore(pipeline: PipelineJson): void;
/**
 * TODO: !!!!! [🧞‍♀️] Do not allow joker + foreach
 * TODO: [🧠] Work with promptbookVersion
 * TODO: Use here some json-schema, Zod or something similar and change it to:
 *     > /**
 *     >  * Validates PipelineJson if it is logically valid.
 *     >  *
 *     >  * It checks:
 *     >  * -   it has a valid structure
 *     >  * -   ...
 *     >  ex port function validatePipeline(promptbook: really_unknown): asserts promptbook is PipelineJson {
 */
/**
 * TODO: [🐣][main] !!!! Validate that all samples match expectations
 * TODO: [🐣][🐝][main] !!!! Validate that knowledge is valid (non-void)
 * TODO: [🐣][main] !!!! Validate that persona can be used only with CHAT variant
 * TODO: [🐣][main] !!!! Validate that parameter with reserved name not used RESERVED_PARAMETER_NAMES
 * TODO: [🐣][main] !!!! Validate that reserved parameter is not used as joker
 * TODO: [🧠] Validation not only logic itself but imports around - files and websites and rerefenced pipelines exists
 * TODO: [🛠] Actions, instruments (and maybe knowledge) => Functions and tools
 */
