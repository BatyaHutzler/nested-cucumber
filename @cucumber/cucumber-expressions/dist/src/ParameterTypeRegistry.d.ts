import ParameterType from './ParameterType';
export default class ParameterTypeRegistry {
    static readonly INTEGER_REGEXPS: RegExp[];
    static readonly FLOAT_REGEXP: RegExp;
    static readonly WORD_REGEXP: RegExp;
    static readonly STRING_REGEXP: RegExp;
    static readonly ANONYMOUS_REGEXP: RegExp;
    private readonly parameterTypeByName;
    private readonly parameterTypesByRegexp;
    constructor();
    get parameterTypes(): IterableIterator<ParameterType<any>>;
    lookupByTypeName(typeName: string): ParameterType<any>;
    lookupByRegexp(parameterTypeRegexp: string, expressionRegexp: RegExp, text: string): ParameterType<any>;
    defineParameterType(parameterType: ParameterType<any>): void;
}
//# sourceMappingURL=ParameterTypeRegistry.d.ts.map