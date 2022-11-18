"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseCsv_1 = require("./parseCsv");
describe("CsvParser", () => {
    const csvParse = new parseCsv_1.CsvParser();
    const testPath = './src/read/parseCsv/testData.csv';
    it("should parse a CSV", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield csvParse.parseFromFile(testPath);
        expect(result).toEqual(expectedResults);
    }));
});
const expectedResults = [
    {
        "Address": "Royal Grammar School, High Street, Guildford, Surrey, GU1 3BB",
        "CompanyLinkToGPGInfo": "https://www.rgsg.co.uk",
        "CompanyNumber": "04104101",
        "CurrentName": "1509 GROUP",
        "DateSubmitted": "2022/02/02 11:06:02",
        "DiffMeanBonusPercent": "",
        "DiffMeanHourlyPercent": "18.0",
        "DiffMedianBonusPercent": "",
        "DiffMedianHourlyPercent": "16.0",
        "DueDate": "2022/04/05 00:00:00",
        "EmployerId": "15320",
        "EmployerName": "1509 GROUP",
        "EmployerSize": "Less than 250",
        "FemaleBonusPercent": "0.0",
        "FemaleLowerMiddleQuartile": "64.0",
        "FemaleLowerQuartile": "64.0",
        "FemaleTopQuartile": "29.0",
        "FemaleUpperMiddleQuartile": "50.0",
        "MaleBonusPercent": "0.0",
        "MaleLowerMiddleQuartile": "36.0",
        "MaleLowerQuartile": "36.0",
        "MaleTopQuartile": "71.0",
        "MaleUpperMiddleQuartile": "50.0",
        "PostCode": "GU1 3BB",
        "ResponsiblePerson": "Ann Mortimer (Payroll Manager)",
        "SicCodes": "85200,\n85310",
        "SubmittedAfterTheDeadline": "False",
    },
    {
        "Address": "Ldh House St Ives Business Park, Parsons Green, St. Ives, Cambridgeshire, PE27 4AA",
        "CompanyLinkToGPGInfo": "https://www.1life.co.uk/corporate-information/",
        "CompanyNumber": "02566586",
        "CurrentName": "1LIFE MANAGEMENT SOLUTIONS LIMITED",
        "DateSubmitted": "2022/02/01 12:19:55",
        "DiffMeanBonusPercent": "55.5",
        "DiffMeanHourlyPercent": "6.1",
        "DiffMedianBonusPercent": "-100.0",
        "DiffMedianHourlyPercent": "-35.3",
        "DueDate": "2022/04/05 00:00:00",
        "EmployerId": "687",
        "EmployerName": "1LIFE MANAGEMENT SOLUTIONS LIMITED",
        "EmployerSize": "Less than 250",
        "FemaleBonusPercent": "30.8",
        "FemaleLowerMiddleQuartile": "65.2",
        "FemaleLowerQuartile": "41.7",
        "FemaleTopQuartile": "52.2",
        "FemaleUpperMiddleQuartile": "65.2",
        "MaleBonusPercent": "69.2",
        "MaleLowerMiddleQuartile": "34.8",
        "MaleLowerQuartile": "58.3",
        "MaleTopQuartile": "47.8",
        "MaleUpperMiddleQuartile": "34.8",
        "PostCode": "PE27 4AA",
        "ResponsiblePerson": "Ann Chesher (Head of Employee Services)",
        "SicCodes": "93110,\n93130,\n93290",
        "SubmittedAfterTheDeadline": "False",
    },
    {
        "Address": "14b Dickson Street, Elgin Industrial Estate, Dunfermline, Fife, Scotland, KY12 7SN",
        "CompanyLinkToGPGInfo": "",
        "CompanyNumber": "SC272838",
        "CurrentName": "1ST HOME CARE LTD.",
        "DateSubmitted": "2022/02/08 14:48:58",
        "DiffMeanBonusPercent": "",
        "DiffMeanHourlyPercent": "-3.0",
        "DiffMedianBonusPercent": "",
        "DiffMedianHourlyPercent": "0.0",
        "DueDate": "2022/04/05 00:00:00",
        "EmployerId": "17484",
        "EmployerName": "1ST HOME CARE LTD.",
        "EmployerSize": "Less than 250",
        "FemaleBonusPercent": "0.0",
        "FemaleLowerMiddleQuartile": "91.0",
        "FemaleLowerQuartile": "91.0",
        "FemaleTopQuartile": "92.0",
        "FemaleUpperMiddleQuartile": "91.0",
        "MaleBonusPercent": "0.0",
        "MaleLowerMiddleQuartile": "9.0",
        "MaleLowerQuartile": "9.0",
        "MaleTopQuartile": "8.0",
        "MaleUpperMiddleQuartile": "9.0",
        "PostCode": "KY12 7SN",
        "ResponsiblePerson": "David Sargent (Group Chief Executive Officer)",
        "SicCodes": "86900,\n88100",
        "SubmittedAfterTheDeadline": "False",
    },
    {
        "Address": "Trinity Park House Trinity Business Park, Fox Way, Wakefield, West Yorkshire, WF2 8EE",
        "CompanyLinkToGPGInfo": "https://www.2sfg.com/how-we-work/gender/",
        "CompanyNumber": "02826929",
        "CurrentName": "2 SISTERS FOOD GROUP LIMITED",
        "DateSubmitted": "2022/02/11 12:39:54",
        "DiffMeanBonusPercent": "32.1",
        "DiffMeanHourlyPercent": "8.3",
        "DiffMedianBonusPercent": "2.7",
        "DiffMedianHourlyPercent": "5.6",
        "DueDate": "2022/04/05 00:00:00",
        "EmployerId": "77",
        "EmployerName": "2 SISTERS FOOD GROUP LIMITED",
        "EmployerSize": "5000 to 19,999",
        "FemaleBonusPercent": "2.0",
        "FemaleLowerMiddleQuartile": "43.0",
        "FemaleLowerQuartile": "46.0",
        "FemaleTopQuartile": "34.0",
        "FemaleUpperMiddleQuartile": "34.0",
        "MaleBonusPercent": "2.0",
        "MaleLowerMiddleQuartile": "57.0",
        "MaleLowerQuartile": "54.0",
        "MaleTopQuartile": "66.0",
        "MaleUpperMiddleQuartile": "66.0",
        "PostCode": "WF2 8EE",
        "ResponsiblePerson": "Lee Greenbury (Director of People and Compliance)",
        "SicCodes": "10120",
        "SubmittedAfterTheDeadline": "False",
    },
];
//# sourceMappingURL=parseCsv.test.js.map