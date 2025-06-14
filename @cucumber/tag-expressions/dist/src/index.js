"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OPERAND = 'operand';
const OPERATOR = 'operator';
const PREC = {
    '(': -2,
    ')': -1,
    or: 0,
    and: 1,
    not: 2,
};
const ASSOC = {
    or: 'left',
    and: 'left',
    not: 'right',
};
/**
 * Parses infix boolean expression (using Dijkstra's Shunting Yard algorithm)
 * and builds a tree of expressions. The root node of the expression is returned.
 *
 * This expression can be evaluated by passing in an array of literals that resolve to true
 */
function parse(infix) {
    const tokens = tokenize(infix);
    if (tokens.length === 0) {
        return new True();
    }
    const expressions = [];
    const operators = [];
    let expectedTokenType = OPERAND;
    tokens.forEach(function (token) {
        if (isUnary(token)) {
            check(expectedTokenType, OPERAND);
            operators.push(token);
            expectedTokenType = OPERAND;
        }
        else if (isBinary(token)) {
            check(expectedTokenType, OPERATOR);
            while (operators.length > 0 &&
                isOp(peek(operators)) &&
                ((ASSOC[token] === 'left' && PREC[token] <= PREC[peek(operators)]) ||
                    (ASSOC[token] === 'right' && PREC[token] < PREC[peek(operators)]))) {
                pushExpr(pop(operators), expressions);
            }
            operators.push(token);
            expectedTokenType = OPERAND;
        }
        else if ('(' === token) {
            check(expectedTokenType, OPERAND);
            operators.push(token);
            expectedTokenType = OPERAND;
        }
        else if (')' === token) {
            check(expectedTokenType, OPERATOR);
            while (operators.length > 0 && peek(operators) !== '(') {
                pushExpr(pop(operators), expressions);
            }
            if (operators.length === 0) {
                throw Error('Syntax error. Unmatched )');
            }
            if (peek(operators) === '(') {
                pop(operators);
            }
            expectedTokenType = OPERATOR;
        }
        else {
            check(expectedTokenType, OPERAND);
            pushExpr(token, expressions);
            expectedTokenType = OPERATOR;
        }
    });
    while (operators.length > 0) {
        if (peek(operators) === '(') {
            throw Error('Syntax error. Unmatched (');
        }
        pushExpr(pop(operators), expressions);
    }
    return pop(expressions);
}
exports.default = parse;
function tokenize(expr) {
    const tokens = [];
    let isEscaped = false;
    let token;
    for (let i = 0; i < expr.length; i++) {
        const c = expr.charAt(i);
        if ('\\' === c) {
            isEscaped = true;
        }
        else {
            if (/\s/.test(c)) {
                // skip
                if (token) {
                    // end of token
                    tokens.push(token.join(''));
                    token = undefined;
                }
            }
            else {
                if ((c === '(' || c === ')') && !isEscaped) {
                    if (token) {
                        // end of token
                        tokens.push(token.join(''));
                        token = undefined;
                    }
                    tokens.push(c);
                    continue;
                }
                token = token ? token : []; // start of token
                token.push(c);
            }
            isEscaped = false;
        }
    }
    if (token) {
        tokens.push(token.join(''));
    }
    return tokens;
}
function isUnary(token) {
    return 'not' === token;
}
function isBinary(token) {
    return 'or' === token || 'and' === token;
}
function isOp(token) {
    return ASSOC[token] !== undefined;
}
function check(expectedTokenType, tokenType) {
    if (expectedTokenType !== tokenType) {
        throw new Error('Syntax error. Expected ' + expectedTokenType);
    }
}
function peek(stack) {
    return stack[stack.length - 1];
}
function pop(stack) {
    if (stack.length === 0) {
        throw new Error('empty stack');
    }
    return stack.pop();
}
function pushExpr(token, stack) {
    if (token === 'and') {
        const rightAndExpr = pop(stack);
        stack.push(new And(pop(stack), rightAndExpr));
    }
    else if (token === 'or') {
        const rightOrExpr = pop(stack);
        stack.push(new Or(pop(stack), rightOrExpr));
    }
    else if (token === 'not') {
        stack.push(new Not(pop(stack)));
    }
    else {
        stack.push(new Literal(token));
    }
}
class Literal {
    constructor(value) {
        this.value = value;
    }
    evaluate(variables) {
        return variables.indexOf(this.value) !== -1;
    }
    toString() {
        return this.value.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    }
}
class Or {
    constructor(leftExpr, rightExpr) {
        this.leftExpr = leftExpr;
        this.rightExpr = rightExpr;
    }
    evaluate(variables) {
        return this.leftExpr.evaluate(variables) || this.rightExpr.evaluate(variables);
    }
    toString() {
        return '( ' + this.leftExpr.toString() + ' or ' + this.rightExpr.toString() + ' )';
    }
}
class And {
    constructor(leftExpr, rightExpr) {
        this.leftExpr = leftExpr;
        this.rightExpr = rightExpr;
    }
    evaluate(variables) {
        return this.leftExpr.evaluate(variables) && this.rightExpr.evaluate(variables);
    }
    toString() {
        return '( ' + this.leftExpr.toString() + ' and ' + this.rightExpr.toString() + ' )';
    }
}
class Not {
    constructor(expr) {
        this.expr = expr;
    }
    evaluate(variables) {
        return !this.expr.evaluate(variables);
    }
    toString() {
        return 'not ( ' + this.expr.toString() + ' )';
    }
}
class True {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(variables) {
        return true;
    }
    toString() {
        return 'true';
    }
}
//# sourceMappingURL=index.js.map