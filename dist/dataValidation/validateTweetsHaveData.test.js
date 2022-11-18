"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const Repository_1 = require("../importData/Repository");
const importer = new importData_1.default();
const repo = new Repository_1.Repository(importer);
repo.setData();
it("All twitter data should have a valid company", () => {
    const brokenTwitterCompanyIds = [];
    for (let index = 0; index < repo.twitterUserData.length; index++) {
        const twitterUser = repo.twitterUserData[index];
        const companyData = repo.getCompany(twitterUser.companyName, twitterUser.companyNumber);
        if (!companyData) {
            console.log(twitterUser.companyName, twitterUser);
            throw new Error("no data for " + JSON.stringify(twitterUser));
        }
        if (companyData.companyNumber !== twitterUser.companyNumber) {
            console.log(companyData.companyName);
            brokenTwitterCompanyIds.push(companyData);
        }
    }
    // There should be no broken twitter-company links!
    const expectedBroken = [];
    expect(brokenTwitterCompanyIds).toEqual(expectedBroken);
});
//# sourceMappingURL=validateTweetsHaveData.test.js.map