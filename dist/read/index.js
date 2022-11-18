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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const write_js_1 = require("../utils/write.js");
const parseDataFromCompany_1 = require("./parseDataFromCompany");
const importData_1 = __importDefault(require("../importData"));
const findCompany_1 = require("../utils/findCompany");
const getMostRecentGPG_js_1 = require("../utils/getMostRecentGPG.js");
// TODO unit test these read data functions!
const dataImporter = new importData_1.default();
const json2022 = dataImporter.gpg_2021_2022();
const json2021 = dataImporter.gpg_2020_2021();
const json2020 = dataImporter.gpg_2019_2020();
const json2019 = dataImporter.gpg_2018_2019();
const json2018 = dataImporter.gpg_2017_2018();
getAllData().then(() => console.log("Finished!!!"));
function getAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Started reading data from 2021_2022");
        const data_2021_2022 = yield (0, parseDataFromCompany_1.parseDataFromJson)(json2022);
        console.log("Finished reading data from 2021_2022");
        console.log("Started reading data from 2020_2021");
        const data_2020_2021 = yield (0, parseDataFromCompany_1.parseDataFromJson)(json2021);
        console.log("Finished reading data from 2020_2021");
        console.log("Started reading data from 2019_2020");
        const data_2019_2020 = yield (0, parseDataFromCompany_1.parseDataFromJson)(json2020);
        console.log("Finished reading data from 2019_2020");
        console.log("Started reading data from 2018_2019");
        const data_2018_2019 = yield (0, parseDataFromCompany_1.parseDataFromJson)(json2019);
        console.log("Finished reading data from 2018_2019");
        console.log("Started reading data from 2017_2018");
        const data_2017_2018 = yield (0, parseDataFromCompany_1.parseDataFromJson)(json2018);
        console.log("Finished reading data from 2017_2018");
        const numberOfItems2022 = data_2021_2022.length;
        const numberOfItems2021 = data_2020_2021.length;
        const numberOfItems2020 = data_2019_2020.length;
        const numberOfItems2019 = data_2018_2019.length;
        const numberOfItems2018 = data_2017_2018.length;
        const totalData = numberOfItems2022 +
            numberOfItems2021 +
            numberOfItems2020 +
            numberOfItems2019 +
            numberOfItems2018;
        console.log("Total Data:", totalData);
        console.log("Number of items:", {
            numberOfItems2022,
            numberOfItems2021,
            numberOfItems2020,
            numberOfItems2019,
            numberOfItems2018,
            totalData,
        });
        if (process.argv[2] === "debug") {
            return;
        }
        // 2022 data
        const combinedData = [];
        let complete = 0;
        printPercentageComplete(complete, totalData);
        for (let index = 0; index < data_2021_2022.length; index++) {
            const company = data_2021_2022[index];
            const item_2021 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2020_2021);
            const item_2020 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2019_2020);
            const item_2019 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2018_2019);
            const item_2018 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2017_2018);
            combinedData.push(toCompanyGpgDataItem(company, item_2021, item_2020, item_2019, item_2018));
        }
        complete += numberOfItems2022;
        // 2021 data
        printPercentageComplete(complete, totalData);
        for (let index = 0; index < data_2020_2021.length; index++) {
            const company = data_2020_2021[index];
            const isInCombinedData = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, combinedData);
            if (isInCombinedData) {
                continue;
            }
            const item_2020 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2019_2020);
            const item_2019 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2018_2019);
            const item_2018 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2017_2018);
            combinedData.push(toCompanyGpgDataItem(null, company, item_2020, item_2019, item_2018));
        }
        complete += numberOfItems2021;
        // 2020 data
        printPercentageComplete(complete, totalData);
        for (let index = 0; index < data_2019_2020.length; index++) {
            const company = data_2019_2020[index];
            const isInCombinedData = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, combinedData);
            if (isInCombinedData) {
                continue;
            }
            const item_2019 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2018_2019);
            const item_2018 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2017_2018);
            combinedData.push(toCompanyGpgDataItem(null, null, company, item_2019, item_2018));
        }
        complete += numberOfItems2020;
        // 2019 data
        printPercentageComplete(complete, totalData);
        for (let index = 0; index < data_2018_2019.length; index++) {
            const company = data_2018_2019[index];
            const isInCombinedData = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, combinedData);
            if (isInCombinedData) {
                continue;
            }
            const item_2018 = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, data_2017_2018);
            combinedData.push(toCompanyGpgDataItem(null, null, null, company, item_2018));
        }
        complete += numberOfItems2019;
        // 2018 data
        printPercentageComplete(complete, totalData);
        for (let index = 0; index < data_2017_2018.length; index++) {
            const company = data_2017_2018[index];
            const isInCombinedData = (0, findCompany_1.findCompany)(company.companyName, company.companyNumber, combinedData);
            if (isInCombinedData) {
                continue;
            }
            combinedData.push(toCompanyGpgDataItem(null, null, null, null, company));
        }
        yield (0, write_js_1.writeJsonFile)("./data/companies_GPG_Data.json", combinedData);
        console.log("Wrote file!");
    });
}
function toCompanyGpgDataItem(item_2022, item_2021, item_2020, item_2019, item_2018) {
    const latestCompanyObject = getLatestCompanyEntry(item_2022, item_2021, item_2020, item_2019, item_2018);
    return {
        companyName: latestCompanyObject.companyName,
        companyNumber: latestCompanyObject.companyNumber,
        size: latestCompanyObject.size,
        sicCodes: latestCompanyObject.sicCodes,
        data2021To2022: toCompanyDataSingleYearItem(item_2022),
        data2020To2021: toCompanyDataSingleYearItem(item_2021),
        data2019To2020: toCompanyDataSingleYearItem(item_2020),
        data2018To2019: toCompanyDataSingleYearItem(item_2019),
        data2017To2018: toCompanyDataSingleYearItem(item_2018),
    };
}
function toCompanyDataSingleYearItem(company) {
    if (!(0, getMostRecentGPG_js_1.isNumber)(company === null || company === void 0 ? void 0 : company.genderPayGap) &&
        !(0, getMostRecentGPG_js_1.isNumber)(company === null || company === void 0 ? void 0 : company.medianGenderPayGap)) {
        return null;
    }
    if ((0, getMostRecentGPG_js_1.isNumber)(company.genderPayGap) && (0, getMostRecentGPG_js_1.isNumber)(company.medianGenderPayGap)) {
        return {
            meanGpg: company.genderPayGap,
            medianGpg: company.medianGenderPayGap,
        };
    }
    throw new Error(`wrong fields present: ${JSON.stringify(company)}`);
}
function getLatestCompanyEntry(item_2022, item_2021, item_2020, item_2019, item_2018) {
    const yearsOfCompany = [
        item_2022,
        item_2021,
        item_2020,
        item_2019,
        item_2018,
    ];
    for (let index = 0; index < yearsOfCompany.length; index++) {
        const element = yearsOfCompany[index];
        if (isValidCompany(element)) {
            return element;
        }
    }
    throw new Error(`there are no valid items for: ${JSON.stringify(yearsOfCompany)}`);
}
function isValidCompany(c) {
    return !!c && !!c.companyName;
}
function printPercentageComplete(current, totalData) {
    const complete = percentageComplete(current, totalData);
    console.log("Progress:", complete, "%");
}
function percentageComplete(current, totalData) {
    return (current / totalData) * 100;
}
//# sourceMappingURL=index.js.map