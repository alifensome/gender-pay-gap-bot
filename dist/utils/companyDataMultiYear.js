"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forCompanyDataMultiYearFindFirstTrue = exports.companyDataMultiYearToList = void 0;
const currentYear = new Date().getFullYear();
function companyDataMultiYearToList(company) {
    const allYears = [];
    const lowestYear = 17;
    let year = currentYear;
    while (year >= lowestYear) {
        const yearData = company[`data${year - 1}To${year}`];
        if (yearData) {
            allYears.push(yearData);
        }
        year--;
    }
    return allYears;
}
exports.companyDataMultiYearToList = companyDataMultiYearToList;
function forCompanyDataMultiYearFindFirstTrue(company, predicate) {
    const list = companyDataMultiYearToList(company);
    for (const item of list) {
        if (predicate(item)) {
            return item;
        }
    }
    return null;
}
exports.forCompanyDataMultiYearFindFirstTrue = forCompanyDataMultiYearFindFirstTrue;
//# sourceMappingURL=companyDataMultiYear.js.map