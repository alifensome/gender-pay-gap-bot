"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companySizeCategoryToMinSize = void 0;
const types_1 = require("../types");
function companySizeCategoryToMinSize(companySize) {
    switch (companySize) {
        case types_1.CompanySize.NotProvided:
            return 0;
        case types_1.CompanySize.LessThan250:
            return 0;
        case types_1.CompanySize.From250To499:
            return 250;
        case types_1.CompanySize.From500To999:
            return 500;
        case types_1.CompanySize.From1000To4999:
            return 1000;
        case types_1.CompanySize.From5000To19999:
            return 5000;
        case types_1.CompanySize.MoreThan20000:
            return 20000;
        default:
            throw new Error(`no company size for ${companySize}`);
    }
}
exports.companySizeCategoryToMinSize = companySizeCategoryToMinSize;
//# sourceMappingURL=companySizeUtils.js.map