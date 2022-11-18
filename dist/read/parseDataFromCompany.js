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
exports.parseDataFromJson = exports.spreadSheetToJson = void 0;
const parse_1 = require("./parse");
const parseCsv_1 = require("./parseCsv/parseCsv");
const write_1 = require("../utils/write");
function spreadSheetToJson(filePath, outputFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const csvParser = new parseCsv_1.CsvParser();
        const rows = yield csvParser.parseFromFile(filePath);
        yield (0, write_1.writeJsonFile)(outputFileName, rows);
    });
}
exports.spreadSheetToJson = spreadSheetToJson;
function parseDataFromJson(jsonFile) {
    const data = [];
    for (let index = 0; index < jsonFile.length; index++) {
        const row = jsonFile[index];
        if (!row || !Object.keys(row).length) {
            continue;
        }
        const companyName = row.EmployerName;
        const companyNumber = (0, parse_1.parseCompanyNumber)(row.CompanyNumber);
        const genderPayGap = (0, parse_1.parseGpg)(row.DiffMeanHourlyPercent);
        const medianGenderPayGap = (0, parse_1.parseGpg)(row.DiffMedianHourlyPercent);
        const sicCodes = parseString(row.SicCodes);
        if (!companyName && !companyNumber) {
            continue;
        }
        const size = row.EmployerSize;
        data.push({ companyName, companyNumber, genderPayGap, medianGenderPayGap, sicCodes, size });
    }
    return data;
}
exports.parseDataFromJson = parseDataFromJson;
function parseString(s) {
    if (!s) {
        return "";
    }
    if (typeof s === "string") {
        const result = s.replace(/\n/g, "");
        return result;
    }
    return `${s}`;
}
//# sourceMappingURL=parseDataFromCompany.js.map