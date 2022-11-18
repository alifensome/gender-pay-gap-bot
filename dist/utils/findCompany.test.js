"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findCompany_1 = require("./findCompany");
const companies = [
    {
        companyName: "1",
        companyNumber: "c1",
        uniqueIndex: 1
    },
    {
        companyName: "2",
        companyNumber: null,
        uniqueIndex: 1
    },
    {
        companyName: "3",
        companyNumber: "c3",
        uniqueIndex: 3
    },
    {
        companyName: "3",
        companyNumber: "c4",
        uniqueIndex: 4
    },
];
describe("findCompany", () => {
    it("should get the company by name", () => {
        const result = (0, findCompany_1.findCompany)("3", "not here", companies);
        expect(result).toEqual(companies[2]);
    });
    it("should get the company by companyNumber", () => {
        const result = (0, findCompany_1.findCompany)(null, "c1", companies);
        expect(result).toEqual(companies[0]);
    });
    it("should get nothing for nulls", () => {
        const result = (0, findCompany_1.findCompany)(null, null, companies);
        expect(result).toEqual(null);
    });
    it("should priorities exact match over only one field matching", () => {
        const result = (0, findCompany_1.findCompany)("3", "c4", companies);
        expect(result).toEqual(companies[3]);
    });
});
describe("findCompanyWithIndex", () => {
    it("should get the company by companyNumber and return index", () => {
        const result = (0, findCompany_1.findCompanyWithIndex)(null, "c1", companies);
        expect(result).toEqual({ item: companies[0], index: 0 });
    });
    it("should return null id not exists", () => {
        const result = (0, findCompany_1.findCompanyWithIndex)(null, "not here", companies);
        expect(result).toEqual(null);
    });
});
//# sourceMappingURL=findCompany.test.js.map