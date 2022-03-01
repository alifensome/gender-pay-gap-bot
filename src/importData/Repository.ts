import DataImporter, { TwitterData, CompanyDataItem } from ".";
import { findCompany } from '../utils/findCompany'

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
        const upperCaseName = name?.toUpperCase();
        return findCompany(upperCaseName, companyNumber, this.companiesGpgData);
    }

    getTwitterUserByCompanyData(name: string, companyNumber: string): TwitterData | null {
        const upperCaseName = name?.toUpperCase();
        return findCompany(upperCaseName, companyNumber, this.twitterUserData);
    }


    private checkSetData() {
        if (!this.twitterUserData) {
            this.setData();
        }
    }
}