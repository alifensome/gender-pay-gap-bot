"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const findCompany_1 = require("../utils/findCompany");
const write_1 = require("../utils/write");
const dataImporter = new importData_1.default();
const companiesData = dataImporter.companiesGpgData();
const twitterData = dataImporter.twitterUserDataProd();
const joinedData = [];
for (let index = 0; index < companiesData.length; index++) {
    const c = companiesData[index];
    const twitterCompany = (0, findCompany_1.findCompany)(c.companyName, c.companyNumber, twitterData);
    if (twitterCompany) {
        joinedData.push(Object.assign(Object.assign({}, c), { hasTwitterData: true, twitterId: twitterCompany.twitter_id_str, twitterScreenName: twitterCompany.twitter_screen_name }));
    }
    else {
        joinedData.push(Object.assign(Object.assign({}, c), { hasTwitterData: false }));
    }
}
(0, write_1.writeJsonFile)("./data/companyDataJoinedWithTweets.json", joinedData);
//# sourceMappingURL=joinTweetsToCompanyData.js.map