"use strict";
/*
 *  Copyright 2021 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
class Storage {
    constructor() {
        this.suites = [];
        this.additionalSuitesData = {};
        this.testItems = [];
    }
    addSuite(data) {
        this.suites.push(data);
    }
    getAllSuites() {
        return [...this.suites];
    }
    getCurrentSuite() {
        return this.suites[this.suites.length - 1] || null;
    }
    removeSuite(suiteId) {
        this.suites = this.suites.filter(({ id }) => suiteId !== id);
    }
    addAdditionalSuiteData(key, data) {
        this.additionalSuitesData[key] = Object.assign(Object.assign({}, (this.additionalSuitesData[key] || {})), data);
    }
    getAdditionalSuiteData(key) {
        return this.additionalSuitesData[key] || {};
    }
    addTest(data) {
        this.testItems.push(data);
    }
    updateCurrentTest(data) {
        const lastElemIdx = this.testItems.length - 1;
        this.testItems[lastElemIdx] = Object.assign(Object.assign({}, this.testItems[lastElemIdx]), data);
    }
    getCurrentTest() {
        return this.testItems[this.testItems.length - 1] || null;
    }
    removeTest(testId) {
        this.testItems = this.testItems.filter(({ id }) => testId !== id);
    }
    hasTest({ title }) {
        return Boolean(this.testItems.find(({ name }) => name === title));
    }
}
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map