"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysSinceBeginningOfYear = exports.findPercentageGpgRange = exports.findDailyGpg = void 0;
function findDailyGpg(today) {
    const range = findPercentageGpgRange(today);
    return [];
}
exports.findDailyGpg = findDailyGpg;
function findPercentageGpgRange(today) {
    const days = daysSinceBeginningOfYear(today);
    const daysZeroIndexed = days;
    const fractionOfYear = daysZeroIndexed / 365;
    const percentagePerDay = 100 / 365;
    const startPercentage = 100 - fractionOfYear * 100;
    const endPercentage = startPercentage + percentagePerDay;
    return {
        startPercentage,
        endPercentage,
    };
}
exports.findPercentageGpgRange = findPercentageGpgRange;
function daysSinceBeginningOfYear(now) {
    const nowRounded = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const start = new Date(now.getFullYear(), 0, 0, 0, 0, 0);
    const diff = nowRounded.valueOf() - start.valueOf();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
}
exports.daysSinceBeginningOfYear = daysSinceBeginningOfYear;
//# sourceMappingURL=FindDailyGpg.js.map