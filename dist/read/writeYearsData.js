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
exports.writeAllData = exports.genericWriteData = void 0;
const parseDataFromCompany_js_1 = require("./parseDataFromCompany.js");
function write2022_2023_data() {
    return __awaiter(this, void 0, void 0, function* () {
        yield genericWriteData(2022);
    });
}
function write2021_2022_data() {
    return __awaiter(this, void 0, void 0, function* () {
        yield genericWriteData(2021);
    });
}
function write2020_2021_data() {
    return __awaiter(this, void 0, void 0, function* () {
        yield genericWriteData(2020);
    });
}
function write2019_2020_data() {
    return __awaiter(this, void 0, void 0, function* () {
        yield genericWriteData(2019);
    });
}
function write2018_2019_data() {
    return __awaiter(this, void 0, void 0, function* () {
        yield genericWriteData(2018);
    });
}
function write2017_2018_data() {
    return __awaiter(this, void 0, void 0, function* () {
        yield genericWriteData(2017);
    });
}
// year is the first calendar year of the snapshot eg 21-22 would be 21
function genericWriteData(year) {
    return __awaiter(this, void 0, void 0, function* () {
        const startYear = year;
        const endYear = year + 1;
        const formattedYearGap = `${startYear}_${endYear}`;
        console.log(`Started reading data from ${formattedYearGap}`);
        const filePath = `./data/UK Gender Pay Gap Data - ${startYear} to ${endYear}.csv`;
        const outputFilePath = `./data/gpg_${formattedYearGap}.json`;
        yield (0, parseDataFromCompany_js_1.spreadSheetToJson)(filePath, outputFilePath);
        console.log(`Finished reading data from ${formattedYearGap}`);
    });
}
exports.genericWriteData = genericWriteData;
function writeAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield write2022_2023_data();
        yield write2021_2022_data();
        yield write2020_2021_data();
        yield write2019_2020_data();
        yield write2018_2019_data();
        yield write2017_2018_data();
    });
}
exports.writeAllData = writeAllData;
//# sourceMappingURL=writeYearsData.js.map