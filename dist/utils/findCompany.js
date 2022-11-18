"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCompanyPartialMatch = exports.findCompanyFullMatch = exports.findCompanyWithIndex = exports.findCompany = void 0;
function findCompany(name, companyNumber, list) {
    const result = findCompanyWithIndex(name, companyNumber, list);
    if (result) {
        return result.item;
    }
    return null;
}
exports.findCompany = findCompany;
function findCompanyWithIndex(name, companyNumber, list) {
    const exactMatch = findCompanyFullMatch(name, companyNumber, list);
    if (exactMatch) {
        return exactMatch;
    }
    const partialMatchResult = findCompanyPartialMatch(name, companyNumber, list);
    if (partialMatchResult) {
        return partialMatchResult;
    }
    return null;
}
exports.findCompanyWithIndex = findCompanyWithIndex;
function findCompanyFullMatch(name, companyNumber, list) {
    var _a, _b;
    const upperCaseName = name === null || name === void 0 ? void 0 : name.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (companyNumber !== null &&
            item.companyNumber !== null &&
            item.companyNumber === companyNumber &&
            upperCaseName !== "" &&
            ((_a = item.companyName) === null || _a === void 0 ? void 0 : _a.toUpperCase()) &&
            ((_b = item.companyName) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === upperCaseName) {
            return { item, index };
        }
    }
    return null;
}
exports.findCompanyFullMatch = findCompanyFullMatch;
function findCompanyPartialMatch(name, companyNumber, list) {
    var _a, _b;
    const upperCaseName = name === null || name === void 0 ? void 0 : name.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (companyNumber !== null && item.companyNumber !== null && item.companyNumber === companyNumber) {
            return { item, index };
        }
        if (upperCaseName !== "" && ((_a = item.companyName) === null || _a === void 0 ? void 0 : _a.toUpperCase()) && ((_b = item.companyName) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === upperCaseName) {
            return { item, index };
        }
    }
    return null;
}
exports.findCompanyPartialMatch = findCompanyPartialMatch;
//# sourceMappingURL=findCompany.js.map