import ParameterType from './ParameterType';
export default class ParameterTypeMatcher {
    readonly parameterType: ParameterType<any>;
    private readonly regexpString;
    private readonly text;
    private matchPosition;
    private readonly match;
    constructor(parameterType: ParameterType<any>, regexpString: string, text: string, matchPosition?: number);
    advanceTo(newMatchPosition: number): ParameterTypeMatcher;
    get find(): boolean | RegExpMatchArray;
    get start(): number;
    get fullWord(): boolean | RegExpMatchArray;
    get matchStartWord(): true | RegExpMatchArray;
    get matchEndWord(): true | RegExpMatchArray;
    get group(): string;
    static compare(a: ParameterTypeMatcher, b: ParameterTypeMatcher): number;
}
//# sourceMappingURL=ParameterTypeMatcher.d.ts.map