"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostRecentMedianGPG = exports.isNumber = exports.getMostRecentGPG = void 0;
const companyDataMultiYear_1 = require("./companyDataMultiYear");
function getMostRecentGPG(data) {
    const mostRecent = (0, companyDataMultiYear_1.forCompanyDataMultiYearFindFirstTrue)(data, (item) => isNumber(item.meanGpg));
    if (mostRecent) {
        return mostRecent.meanGpg;
    }
    return null;
}
exports.getMostRecentGPG = getMostRecentGPG;
function isNumber(n) {
    if (n === null || n === undefined || n === "") {
        return false;
    }
    if (typeof n === "string") {
        let parsedStringNumber = parseFloat(n);
        return isNumber(parsedStringNumber);
    }
    if (typeof n === "number" || typeof n === "bigint") {
        if (isSpecialNotANunber(n)) {
            return false;
        }
        return true;
    }
    return false;
}
exports.isNumber = isNumber;
function isSpecialNotANunber(n) {
    return n != n;
}
function getMostRecentMedianGPG(data) {
    const mostRecent = (0, companyDataMultiYear_1.forCompanyDataMultiYearFindFirstTrue)(data, (item) => isNumber(item.medianGpg));
    if (mostRecent) {
        return mostRecent.medianGpg;
    }
    return null;
}
exports.getMostRecentMedianGPG = getMostRecentMedianGPG;
//# sourceMappingURL=getMostRecentGPG.js.map