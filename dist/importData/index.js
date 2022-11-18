"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class DataImporter {
    readFile(path) {
        return JSON.parse(fs_1.default.readFileSync(path, "utf8"));
    }
    companiesGpgData() {
        return this.readFile("./data/companies_GPG_Data.json");
    }
    companiesGpgDataTest() {
        return this.readFile("./data/companies_GPG_Data-test.json");
    }
    successfulTweets() {
        return this.readFile("./data/tweets/successful-tweets.json");
    }
    twitterUserDataProd() {
        return this.readFile("./data/twitterAccountData/twitterUserData-prod.json");
    }
    twitterUserDataTest() {
        return this.readFile("./data/twitterAccountData/twitterUserData-test.json");
    }
    allTimeLineTweets() {
        return this.readFile("./data/tweets/allTimeLineTweets.json");
    }
    successfulTweetsWithCompanyData() {
        return this.readFile("./data/tweets/successfulTweetsWithCompanyData.json");
    }
    unsuccessfulTweets() {
        return this.readFile("./data/tweets/unsuccessful-tweets.json");
    }
    gpg_2021_2022() {
        return this.readFile("./data/gpg_2021_2022.json");
    }
    gpg_2020_2021() {
        return this.readFile("./data/gpg_2020_2021.json");
    }
    gpg_2019_2020() {
        return this.readFile("./data/gpg_2019_2020.json");
    }
    gpg_2018_2019() {
        return this.readFile("./data/gpg_2018_2019.json");
    }
    gpg_2017_2018() {
        return this.readFile("./data/gpg_2017_2018.json");
    }
    companyDataJoinedTweets() {
        return this.readFile("./data/companyDataJoinedWithTweets.json");
    }
}
exports.default = DataImporter;
//# sourceMappingURL=index.js.map