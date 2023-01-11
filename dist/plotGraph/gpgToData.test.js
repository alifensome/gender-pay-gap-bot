"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const gpgToData_1 = require("./gpgToData");
describe("gpgToData", () => {
    it("should parse the company to a data item", () => {
        const company = {
            companyName: "companyName",
            sicCodes: "",
            companyNumber: null,
            data2021To2022: {
                medianGpg: 6,
                meanGpg: 1,
            },
            data2020To2021: {
                meanGpg: 2,
                medianGpg: 7,
            },
            data2019To2020: {
                medianGpg: 8,
                meanGpg: 3,
            },
            data2018To2019: {
                meanGpg: 4,
                medianGpg: 9,
            },
            data2017To2018: {
                meanGpg: 5,
                medianGpg: 10,
            },
            size: types_1.CompanySize.From250To499,
        };
        const result = (0, gpgToData_1.gpgToData)(company);
        const expectedResult = {
            medianData: [
                { x: 2017, y: 10 },
                { x: 2018, y: 9 },
                { x: 2019, y: 8 },
                { x: 2020, y: 7 },
                { x: 2021, y: 6 },
            ],
            meanData: [
                { x: 2017, y: 5 },
                { x: 2018, y: 4 },
                { x: 2019, y: 3 },
                { x: 2020, y: 2 },
                { x: 2021, y: 1 },
            ],
        };
        expect(result).toEqual(expectedResult);
    });
    it("should parse not include null years", () => {
        const company = {
            companyName: "companyName",
            sicCodes: "",
            companyNumber: null,
            data2021To2022: {
                medianGpg: 6,
                meanGpg: 1,
            },
            data2020To2021: {
                meanGpg: 2,
                medianGpg: null,
            },
            data2019To2020: {
                medianGpg: 8,
                meanGpg: 3,
            },
            data2018To2019: {
                meanGpg: null,
                medianGpg: 9,
            },
            data2017To2018: {
                meanGpg: 5,
                medianGpg: 10,
            },
            size: types_1.CompanySize.From250To499,
        };
        const result = (0, gpgToData_1.gpgToData)(company);
        const expectedResult = {
            medianData: [
                { x: 2017, y: 10 },
                { x: 2018, y: 9 },
                { x: 2019, y: 8 },
                { x: 2021, y: 6 },
            ],
            meanData: [
                { x: 2017, y: 5 },
                { x: 2019, y: 3 },
                { x: 2020, y: 2 },
                { x: 2021, y: 1 },
            ],
        };
        expect(result).toEqual(expectedResult);
    });
    it("should parse the company to a data item even when 0", () => {
        const company = {
            companyName: "companyName",
            sicCodes: "",
            companyNumber: null,
            data2021To2022: {
                medianGpg: 0,
                meanGpg: 1,
            },
            data2020To2021: {
                meanGpg: 2,
                medianGpg: 7,
            },
            data2019To2020: {
                medianGpg: 8,
                meanGpg: 3,
            },
            data2018To2019: {
                meanGpg: 0,
                medianGpg: 9,
            },
            data2017To2018: {
                meanGpg: 5,
                medianGpg: 10,
            },
            size: types_1.CompanySize.From250To499,
        };
        const result = (0, gpgToData_1.gpgToData)(company);
        const expectedResult = {
            medianData: [
                { x: 2017, y: 10 },
                { x: 2018, y: 9 },
                { x: 2019, y: 8 },
                { x: 2020, y: 7 },
                { x: 2021, y: 0 },
            ],
            meanData: [
                { x: 2017, y: 5 },
                { x: 2018, y: 0 },
                { x: 2019, y: 3 },
                { x: 2020, y: 2 },
                { x: 2021, y: 1 },
            ],
        };
        expect(result).toEqual(expectedResult);
    });
});
//# sourceMappingURL=gpgToData.test.js.map