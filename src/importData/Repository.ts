import DataImporter from ".";
import { TwitterData, CompanyDataItem } from "./types";
import { isDebugMode } from "../utils/debug";
import { findCompany, findCompanyWithIndex } from '../utils/findCompany'

export class Repository {

    dataImporter: DataImporter;
    twitterUserData: TwitterData[];
    companiesGpgData: CompanyDataItem[];

    constructor(dataImporter: DataImporter) {
        this.dataImporter = dataImporter
    }

    setData() {
        this.twitterUserData = this.dataImporter.twitterUserDataProd()
        this.companiesGpgData = this.dataImporter.companiesGpgData()
        if (isDebugMode()) {
            this.twitterUserData.push(this.dataImporter.twitterUserDataTest()[0])
            this.companiesGpgData.push(this.dataImporter.companiesGpgDataTest()[0])
        }
    }

    getTwitterUserByTwitterId(twitterId: string): TwitterData | null {
        this.checkSetData();
        for (let index = 0; index < this.twitterUserData.length; index++) {
            const c = this.twitterUserData[index];
            if (c.twitter_id_str === twitterId) {
                return c;
            }
        }
        return null;
    }

    getGpgForTwitterId(twitterId: string): { companyData: CompanyDataItem, twitterData: TwitterData } | null {
        const twitterData = this.getTwitterUserByTwitterId(twitterId)
        if (!twitterData) {
            return null
        }
        const companyData = this.getCompany(twitterData.companyName, twitterData.companyNumber)
        if (!companyData) {
            return null
        }
        return { companyData, twitterData }
    }

    getCompany(name: string, companyNumber: string): CompanyDataItem | null {
        this.checkSetData()
        const upperCaseName = name?.toUpperCase();
        return findCompany(upperCaseName, companyNumber, this.companiesGpgData);
    }

    getTwitterUserByCompanyData(name: string, companyNumber: string): TwitterData | null {
        const upperCaseName = name?.toUpperCase();
        return findCompany(upperCaseName, companyNumber, this.twitterUserData);
    }

    getNextCompanyWithData(name: string, companyNumber: string | null): CompanyDataItem | null {
        this.checkSetData()
        const current = findCompanyWithIndex(name, companyNumber, this.companiesGpgData)
        if (!current) {
            throw new Error(`could not find current company for name: ${name}, number:${companyNumber}`)
        }
        let nextIndex = current.index + 1
        while (true) {
            if (nextIndex > this.companiesGpgData.length) {
                return null
            }
            const nextCompany = this.companiesGpgData[nextIndex]
            if (nextCompany && nextCompany.medianGpg_2021_2022 !== null && nextCompany.medianGpg_2020_2021 !== null) {
                return nextCompany
            }
            nextIndex++
        }
    }

    getNextMatchingCompanyWithData(name: string, companyNumber: string | null, matchingFunction: (CompanyDataItem) => boolean): CompanyDataItem | null {
        this.checkSetData()
        const current = findCompanyWithIndex(name, companyNumber, this.companiesGpgData)
        if (!current) {
            throw new Error(`could not find current company for name: ${name}, number:${companyNumber}`)
        }
        let nextIndex = current.index + 1
        while (true) {
            if (nextIndex > this.companiesGpgData.length) {
                return null
            }
            const nextCompany = this.companiesGpgData[nextIndex]
            if (!nextCompany) {
                nextIndex++
                continue;
            }
            if (matchingFunction(nextCompany)) {
                return nextCompany
            } else {
                nextIndex++
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