import DataImporter, { TwitterDataWithCompany, CompanyDataItem } from ".";

export class Repository {
    dataImporter: DataImporter;
    twitterUserData: TwitterDataWithCompany[];
    companiesGpgData: CompanyDataItem[];

    constructor(dataImporter: DataImporter) {
        this.dataImporter = dataImporter
    }

    setData() {
        this.twitterUserData = this.dataImporter.twitterUserDataProd()
        this.companiesGpgData = this.dataImporter.companiesGpgData()
    }

    getCompanyByTwitterId(twitterId: string): TwitterDataWithCompany | null {
        this.checkSetData();
        for (let index = 0; index < this.twitterUserData.length; index++) {
            const c = this.twitterUserData[index];
            if (c.twitter_id_str === twitterId) {
                return c;
            }
        }
        return null;
    }

    getGpgForTwitterId(twitterId: string) {
        const twitterData = this.getCompanyByTwitterId(twitterId)
        if (!twitterData) {
            return null
        }
        // this.getCompanyByNumber(twitterData.companyName, twitterData.companyNumber)
    }

    getCompanyByNumber(name: string, companyNumber: string): CompanyDataItem | null {
        const upperCaseName = name.toUpperCase();
        for (let index = 0; index < this.companiesGpgData.length; index++) {
            const item = this.companiesGpgData[index];
            if (item.companyName?.toUpperCase() === upperCaseName || item.companyNumber === companyNumber) {
                return item;
            }
        }
        return null;
    }


    private checkSetData() {
        if (!this.twitterUserData) {
            this.setData();
        }
    }
}