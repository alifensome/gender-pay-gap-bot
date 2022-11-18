"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../importData/Repository");
const importData_1 = __importDefault(require("../../importData"));
const getMostRecentGPG_1 = require("../../utils/getMostRecentGPG");
const write_1 = require("../../utils/write");
const importer = new importData_1.default();
const repo = new Repository_1.Repository(importer);
repo.setData();
let notFound = 0;
let found = 0;
const notFoundData = [];
for (let index = 0; index < repo.companiesGpgData.length; index++) {
    const companyData = repo.companiesGpgData[index];
    const twitterUser = repo.getTwitterUserByCompanyData(companyData.companyName, companyData.companyNumber);
    if (!twitterUser) {
        notFoundData.push(companyData);
        notFound++;
        console.log(`Not found: ${companyData.companyName}`);
    }
    else {
        console.log(`Found: ${companyData.companyName}`);
        found++;
    }
}
console.log(`Total Found: ${found}.\nNot Found: ${notFound}`);
notFoundData.sort((a, b) => (0, getMostRecentGPG_1.getMostRecentMedianGPG)(b) - (0, getMostRecentGPG_1.getMostRecentMedianGPG)(a));
const filePath = "./data/companyDataWithNoTwitterData.json";
(0, write_1.writeJsonFile)(filePath, notFoundData);
//# sourceMappingURL=run.js.map