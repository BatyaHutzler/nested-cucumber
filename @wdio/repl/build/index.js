"use strict";
/**
 *
 * This command helps you to debug your integration tests. It stops the running browser and gives
 * you time to jump into it and check the state of your application (e.g. using dev tools).
 * Your terminal transforms into a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)
 * interface that will allow you to try out certain commands, find elements and test actions on
 * them.
 *
 * [![WebdriverIO REPL](https://webdriver.io/img/repl.gif)](https://webdriver.io/img/repl.gif)
 *
 * If you run the WDIO testrunner make sure you increase the timeout property of the test framework
 * you are using (e.g. Mocha or Jasmine) in order to prevent test termination due to a test timeout.
 * Also avoid executing the command with multiple capabilities running at the same time.
 *
 * <iframe width="560" height="315" src="https://www.youtube.com/embed/xWwP-3B_YyE" frameBorder="0" allowFullScreen></iframe>
 *
 * <example>
    :debug.js
    it('should demonstrate the debug command', () => {
        $('#input').setValue('FOO')
        browser.debug() // jumping into the browser and change value of #input to 'BAR'
        const value = $('#input').getValue()
        console.log(value) // outputs: "BAR"
    })
 * </example>
 *
 * @alias browser.debug
 * @type utility
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = __importDefault(require("vm"));
const repl_1 = __importDefault(require("repl"));
const utils_1 = require("@wdio/utils");
const constants_1 = require("./constants");
class WDIORepl {
    constructor(config) {
        this._isCommandRunning = false;
        this._config = Object.assign(constants_1.DEFAULT_CONFIG, { eval: this.eval.bind(this) }, config);
    }
    eval(cmd, context, filename, callback) {
        if (this._isCommandRunning) {
            return;
        }
        if (cmd && constants_1.STATIC_RETURNS[cmd.trim()]) {
            return callback(null, constants_1.STATIC_RETURNS[cmd.trim()]);
        }
        vm_1.default.createContext(context);
        this._isCommandRunning = true;
        /* istanbul ignore if */
        if (utils_1.hasWdioSyncSupport) {
            return (0, utils_1.runFnInFiberContext)(() => this._runCmd(cmd, context, callback))();
        }
        return this._runCmd(cmd, context, callback);
    }
    _runCmd(cmd, context, callback) {
        try {
            const result = vm_1.default.runInContext(cmd, context);
            return this._handleResult(result, callback);
        }
        catch (e) {
            this._isCommandRunning = false;
            return callback(e, undefined);
        }
    }
    _handleResult(result, callback) {
        if (!result || typeof result.then !== 'function') {
            this._isCommandRunning = false;
            return callback(null, result);
        }
        let timeoutCalled = false;
        const timeout = setTimeout(() => {
            callback(new Error('Command execution timed out'), undefined);
            this._isCommandRunning = false;
            timeoutCalled = true;
        }, this._config.commandTimeout);
        result.then((res) => {
            /**
             * don't do anything if timeout was called
             */
            if (timeoutCalled) {
                return;
            }
            this._isCommandRunning = false;
            clearTimeout(timeout);
            return callback(null, res);
        }, (e) => {
            /**
             * don't do anything if timeout was called
             */
            if (timeoutCalled) {
                return;
            }
            this._isCommandRunning = false;
            clearTimeout(timeout);
            const errorMessage = e ? e.message : 'Command execution timed out';
            const commandError = new Error(errorMessage);
            delete commandError.stack;
            return callback(commandError, undefined);
        });
    }
    start(context) {
        if (this._replServer) {
            throw new Error('a repl was already initialised');
        }
        if (context) {
            const evalFn = this._config.eval;
            this._config.eval = function (cmd, _, filename, callback) {
                return evalFn.call(this, cmd, context, filename, callback);
            };
        }
        this._replServer = repl_1.default.start(this._config);
        return new Promise((resolve) => {
            return this._replServer.on('exit', resolve);
        });
    }
}
WDIORepl.introMessage = constants_1.INTRO_MESSAGE;
exports.default = WDIORepl;
