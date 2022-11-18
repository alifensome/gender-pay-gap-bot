"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockData_1 = require("../unitTestHelpers/mockData");
const companyDataMultiYear_1 = require("./companyDataMultiYear");
describe("companyDataMultiYearToList", () => {
    it("should get all available years from the multiyear item in descending age order", () => {
        const result = (0, companyDataMultiYear_1.companyDataMultiYearToList)(mockData_1.mockCompanyDataItem);
        expect(result).toEqual([
            { medianGpg: 52.1, meanGpg: 51.5 },
            { medianGpg: 42.1, meanGpg: 41.5 },
            { medianGpg: 32.1, meanGpg: 31.5 },
            { medianGpg: 22.1, meanGpg: 21.5 },
            { medianGpg: 11.1, meanGpg: 11.5 },
        ]);
    });
});
describe("forCompanyDataMultiYearFindFirstTrue", () => {
    it("should get all available years from the multiyear item in descending age order", () => {
        const result = (0, companyDataMultiYear_1.forCompanyDataMultiYearFindFirstTrue)(mockData_1.mockCompanyDataItem, (item) => item.medianGpg <= 22.1);
        expect(result).toEqual({ medianGpg: 22.1, meanGpg: 21.5 });
    });
});
//# sourceMappingURL=companyDataMultiYear.test.js.map