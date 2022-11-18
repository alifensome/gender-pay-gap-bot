"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const types_1 = require("../types");
const companySizeUtils_1 = require("./companySizeUtils");
describe("companySizeToAverageSize", () => {
    it("should convert the company size to min size", () => {
        const result = (0, companySizeUtils_1.companySizeCategoryToMinSize)(types_1.CompanySize.From1000To4999);
        expect(result).toBe(1000);
    });
    it("should throw an error if size is invalid", () => {
        expect(() => (0, companySizeUtils_1.companySizeCategoryToMinSize)("hi")).toThrowError("no company size for hi");
    });
    it("should be able to pass all the companies in the data set", () => {
        const dataImporter = new importData_1.default();
        const companies = dataImporter.companiesGpgData();
        for (let index = 0; index < companies.length; index++) {
            const c = companies[index];
            const result = (0, companySizeUtils_1.companySizeCategoryToMinSize)(c.size);
            expect(typeof result).toBe("number");
            expect(result).toBeGreaterThan(-1);
        }
    });
});
//# sourceMappingURL=companySizeUtils.test.js.map