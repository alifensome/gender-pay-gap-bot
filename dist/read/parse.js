"use strict";
// TODO refactor this to be cleaner :P
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGpg = exports.parseCompanyNumber = void 0;
function parseCompanyNumber(companyNumber) {
    if (typeof companyNumber === "number") {
        if (companyNumber.toString().length === 7) {
            return `0${companyNumber}`;
        }
        if (companyNumber.toString().length === 6) {
            return `00${companyNumber}`;
        }
        if (companyNumber.toString().length === 5) {
            return `000${companyNumber}`;
        }
        return companyNumber.toString();
    }
    if (!companyNumber) {
        return null;
    }
    return companyNumber;
}
exports.parseCompanyNumber = parseCompanyNumber;
function parseGpg(gpg) {
    if (typeof gpg === "string") {
        return parseFloat(gpg.replace("\t", ""));
    }
    if (gpg > 1000 || gpg < -1000) {
        throw new Error(`gpg out of bounds: ${gpg}`);
    }
    return gpg;
}
exports.parseGpg = parseGpg;
//# sourceMappingURL=parse.js.map