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
const getMostRecentGPG_1 = require("../utils/getMostRecentGPG");
const getCompanyDataByTwitterId_1 = require("../twitter/getCompanyDataByTwitterId");
const write_1 = require("../utils/write");
const index_1 = __importDefault(require("../importData/index"));
const dataImporter = new index_1.default();
const data = dataImporter.companiesGpgData();
const donkedData = dataImporter.successfulTweets();
const companyDataWithTwitter = dataImporter.twitterUserDataProd();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const highValueNotTweeted = [];
        for (let index = 0; index < data.length; index++) {
            const company = data[index];
            let gpg = (0, getMostRecentGPG_1.getMostRecentGPG)(company);
            if (!gpg || gpg < 50) {
                continue;
            }
            const hasBeenDonked = getDonkedByCompanyName(company.companyName, donkedData, companyDataWithTwitter);
            if (hasBeenDonked) {
                continue;
            }
            highValueNotTweeted.push(company);
        }
        const filePath = "./data/high-value-not-tweeted.json";
        yield (0, write_1.writeJsonFile)(filePath, highValueNotTweeted);
        function getDonkedByCompanyName(companyName, donkedData, companyDataWithTwitter) {
            var _a;
            for (let index = 0; index < donkedData.length; index++) {
                const d = donkedData[index];
                const companiesByTwitterName = (0, getCompanyDataByTwitterId_1.getAllCompanyDataByTwitterScreenName)(d.twitter_screen_name, companyDataWithTwitter);
                if (!companiesByTwitterName || !companiesByTwitterName.length) {
                    continue;
                }
                for (let index = 0; index < companiesByTwitterName.length; index++) {
                    const companyByTwitterName = companiesByTwitterName[index];
                    if (companyName.toLowerCase() == ((_a = companyByTwitterName.companyName) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
                        console.log("Skipping Company:", companyName, "Twitter name", companyByTwitterName === null || companyByTwitterName === void 0 ? void 0 : companyByTwitterName.companyName);
                        return d;
                    }
                }
            }
            return null;
        }
    });
}
run();
//# sourceMappingURL=highValues.js.map