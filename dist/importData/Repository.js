"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const debug_1 = require("../utils/debug");
const findCompany_1 = require("../utils/findCompany");
class Repository {
    constructor(dataImporter) {
        this.dataImporter = dataImporter;
    }
    setData() {
        this.twitterUserData = this.dataImporter.twitterUserDataProd();
        this.companiesGpgData = this.dataImporter.companiesGpgData();
        if ((0, debug_1.isDebugMode)()) {
            this.twitterUserData.push(this.dataImporter.twitterUserDataTest()[0]);
            this.companiesGpgData.push(this.dataImporter.companiesGpgDataTest()[0]);
        }
    }
    getTwitterUserByTwitterId(twitterId) {
        this.checkSetData();
        for (let index = 0; index < this.twitterUserData.length; index++) {
            const c = this.twitterUserData[index];
            if (c.twitter_id_str === twitterId) {
                return c;
            }
        }
        return null;
    }
    getGpgForTwitterId(twitterId) {
        const twitterData = this.getTwitterUserByTwitterId(twitterId);
        if (!twitterData) {
            return null;
        }
        const companyData = this.getCompany(twitterData.companyName, twitterData.companyNumber);
        if (!companyData) {
            return null;
        }
        return { companyData, twitterData };
    }
    getCompany(name, companyNumber) {
        this.checkSetData();
        const upperCaseName = name === null || name === void 0 ? void 0 : name.toUpperCase();
        return (0, findCompany_1.findCompany)(upperCaseName, companyNumber, this.companiesGpgData);
    }
    getTwitterUserByCompanyData(name, companyNumber) {
        const upperCaseName = name === null || name === void 0 ? void 0 : name.toUpperCase();
        return (0, findCompany_1.findCompany)(upperCaseName, companyNumber, this.twitterUserData);
    }
    getNextCompanyWithData(name, companyNumber) {
        this.checkSetData();
        const current = (0, findCompany_1.findCompanyWithIndex)(name, companyNumber, this.companiesGpgData);
        if (!current) {
            throw new Error(`could not find current company for name: ${name}, number:${companyNumber}`);
        }
        let nextIndex = current.index + 1;
        while (true) {
            if (nextIndex > this.companiesGpgData.length) {
                return null;
            }
            const nextCompany = this.companiesGpgData[nextIndex];
            if (nextCompany &&
                nextCompany.data2021To2022.meanGpg &&
                nextCompany.data2020To2021.meanGpg) {
                return nextCompany;
            }
            nextIndex++;
        }
    }
    getNextMatchingCompanyWithData(name, companyNumber, matchingFunction) {
        this.checkSetData();
        const current = (0, findCompany_1.findCompanyWithIndex)(name, companyNumber, this.companiesGpgData);
        if (!current) {
            throw new Error(`could not find current company for name: ${name}, number:${companyNumber}`);
        }
        let nextIndex = current.index + 1;
        while (true) {
            if (nextIndex > this.companiesGpgData.length) {
                return null;
            }
            const nextCompany = this.companiesGpgData[nextIndex];
            if (!nextCompany) {
                nextIndex++;
                continue;
            }
            if (matchingFunction(nextCompany)) {
                return nextCompany;
            }
            else {
                nextIndex++;
                continue;
            }
        }
    }
    checkSetData() {
        if (!this.twitterUserData || !this.companiesGpgData) {
            this.setData();
        }
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map