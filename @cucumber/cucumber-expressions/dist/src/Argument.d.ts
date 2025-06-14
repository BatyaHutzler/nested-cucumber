import TreeRegexp from './TreeRegexp';
import ParameterType from './ParameterType';
import Group from './Group';
export default class Argument<T> {
    readonly group: Group;
    readonly parameterType: ParameterType<T>;
    static build(treeRegexp: TreeRegexp, text: string, parameterTypes: readonly ParameterType<any>[]): readonly Argument<any>[];
    constructor(group: Group, parameterType: ParameterType<T>);
    /**
     * Get the value returned by the parameter type's transformer function.
     *
     * @param thisObj the object in which the transformer function is applied.
     */
    getValue(thisObj: any): T;
    getParameterType(): ParameterType<T>;
}
//# sourceMappingURL=Argument.d.ts.map