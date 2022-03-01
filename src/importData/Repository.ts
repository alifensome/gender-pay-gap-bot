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

    getCompanyByTwitterId(twitterId: string): TwitterData | null {
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
        const twitterData = this.getCompanyByTwitterId(twitterId)
        if (!twitterData) {
            return null
        }
        const companyData = this.getCompanyByNumber(twitterData.companyName, twitterData.companyNumber)
        if (!companyData) {
            return null
        }
        return { companyData, twitterData }
    }

    getCompanyByNumber(name: string, companyNumber: string): CompanyDataItem | null {
        const upperCaseName = name?.toUpperCase();
        return findCompany(upperCaseName, companyNumber, this.companiesGpgData);
    }


    private checkSetData() {
        if (!this.twitterUserData) {
            this.setData();
        }
    }
}