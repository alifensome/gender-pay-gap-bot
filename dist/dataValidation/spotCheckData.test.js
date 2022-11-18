"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const Repository_1 = require("../importData/Repository");
const types_1 = require("../types");
const importer = new importData_1.default();
const repo = new Repository_1.Repository(importer);
const ryanAir = {
    companyName: "Ryanair ltd",
    companyNumber: null,
    sicCodes: "51101",
    data2021To2022: { meanGpg: 45.1, medianGpg: 42.8 },
    data2020To2021: { meanGpg: 67.8, medianGpg: 68.6 },
    data2019To2020: null,
    data2018To2019: { meanGpg: 62.2, medianGpg: 64.4 },
    data2017To2018: { meanGpg: 67, medianGpg: 71.8 },
    size: types_1.CompanySize.From1000To4999,
};
const jamesFisherNuclearLimited = {
    companyName: "JAMES FISHER NUCLEAR LIMITED",
    companyNumber: "SC204768",
    sicCodes: "62090",
    data2021To2022: { meanGpg: 34.3, medianGpg: 29.7 },
    data2020To2021: { meanGpg: 26.7, medianGpg: 21.6 },
    data2019To2020: null,
    data2018To2019: { meanGpg: 32.4, medianGpg: 35.3 },
    data2017To2018: { meanGpg: 33, medianGpg: 38.3 },
    size: types_1.CompanySize.From250To499,
};
const dorsetHealthcareNhsFoundationTrust = {
    companyName: "Dorset Healthcare Nhs Foundation Trust",
    companyNumber: null,
    sicCodes: "1,86210",
    data2021To2022: { meanGpg: 14.8, medianGpg: 8.7 },
    data2020To2021: { meanGpg: 14.1, medianGpg: 8 },
    data2019To2020: null,
    data2018To2019: { meanGpg: 16.4, medianGpg: 6.5 },
    data2017To2018: { meanGpg: 19.1, medianGpg: 6.6 },
    size: types_1.CompanySize.From5000To19999,
};
const doncasterMetropolitanBoroughCouncil = {
    companyName: "Doncaster Metropolitan Borough Council",
    companyNumber: null,
    sicCodes: "1,84110",
    data2021To2022: { meanGpg: 12.9, medianGpg: 13.9 },
    data2020To2021: { meanGpg: 14.1, medianGpg: 16 },
    data2019To2020: { meanGpg: 14.6, medianGpg: 16.9 },
    data2018To2019: { meanGpg: 14.8, medianGpg: 16.5 },
    data2017To2018: { meanGpg: 15.7, medianGpg: 21.1 },
    size: types_1.CompanySize.From5000To19999,
};
describe("spot check data", () => {
    it.each([
        [ryanAir],
        [jamesFisherNuclearLimited],
        [dorsetHealthcareNhsFoundationTrust],
        [doncasterMetropolitanBoroughCouncil],
    ])("should get and check the company from the data", (company) => {
        const companyFromData = repo.getCompany(company.companyName, company.companyNumber);
        expect(companyFromData).toEqual(company);
    });
});
//# sourceMappingURL=spotCheckData.test.js.map