"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../importData/Repository");
const importData_1 = __importDefault(require("../../importData"));
const importer = new importData_1.default();
const repo = new Repository_1.Repository(importer);
repo.setData();
it("should have valid data, a company for each twitter Id", () => {
    for (let index = 0; index < repo.twitterUserData.length; index++) {
        const twitterUser = repo.twitterUserData[index];
        const companyData = repo.getTwitterUserByCompanyData(twitterUser.companyName, twitterUser.companyNumber);
        if (!companyData) {
            console.log(twitterUser.companyName, twitterUser);
            throw new Error("no data for " + JSON.stringify(twitterUser));
        }
        if (companyData.companyNumber !== twitterUser.companyNumber) {
            console.log(companyData.companyName);
        }
        expect(companyData.companyNumber).toEqual(twitterUser.companyNumber);
    }
});
//# sourceMappingURL=run.test.js.map