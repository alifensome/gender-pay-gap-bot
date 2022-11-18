"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const dataImporter = new importData_1.default();
const getCompanyDataByTwitterId_js_1 = require("../twitter/getCompanyDataByTwitterId.js");
const write_js_1 = require("../utils/write.js");
const donkedData = dataImporter.successfulTweets();
const companies = dataImporter.twitterUserDataProd();
console.log("Total Donks:", donkedData.length);
const joinedData = [];
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const companyData = (0, getCompanyDataByTwitterId_js_1.getAllCompanyDataByTwitterScreenName)(d.twitter_screen_name, companies);
    if (!companyData || !companyData.length) {
        throw new Error(`No company Data for ${JSON.stringify(d)}`);
    }
    joinedData.push(Object.assign(Object.assign({}, d), companyData[0]));
}
(0, write_js_1.writeJsonFile)("./data/tweets/successfulTweetsWithCompanyData.json", joinedData);
//# sourceMappingURL=successfulTweetsJoinCompanyData.js.map