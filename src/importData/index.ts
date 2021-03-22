import fs from 'fs';

class DataImporter {
    readFile(path) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    companiesGpgData(): CompanyDataItem[] {
        return this.readFile("./data/companies_GPG_Data.json")
    }
    successfulTweets() {
        return this.readFile("./data/tweets/successful-tweets.json")
    }
    twitterUserDataProd(): TwitterDataWithCompany[] {
        return this.readFile("./data/twitterAccountData/twitterUserData-prod.json")
    }
    allTimeLineTweets() {
        return this.readFile("./data/tweets/allTimeLineTweets.json")
    }
    successfulTweetsWithCompanyData() {
        return this.readFile("./data/tweets/successfulTweetsWithCompanyData.json")
    }
    twitterUserDataTest() {
        return this.readFile("./data/twitterAccountData/twitterUserData-test.json")
    }
    unsuccessfulTweets() {
        return this.readFile("./data/tweets/unsuccessful-tweets.json")
    }

    gpg_2020_2021() {
        return this.readFile("./data/gpg_2020_2021.json")
    }
    gpg_2019_2020() {
        return this.readFile("./data/gpg_2019_2020.json")
    }
    gpg_2018_2019() {
        return this.readFile("./data/gpg_2018_2019.json")
    }
    gpg_2017_2018() {
        return this.readFile("./data/gpg_2017_2018.json")
    }
    companyDataJoinedTweets(): CompanyDataJoinedTweetsItem[] {
        return this.readFile("./data/companyDataJoinedWithTweets.json")
    }
}

export default DataImporter

export interface CompanyDataItem {
    companyName: string
    companyNumber: string
    gpg_2020_2021?: number
    gpg_2019_2020?: number
    gpg_2018_2019?: number
    gpg_2017_2018?: number
}

export interface TwitterDataWithCompany {
    twitter_id_str: string;
    twitter_id: number;
    twitter_name: string;
    twitter_screen_name: string;
    companyName: string;
    companyNumber?: number;
    gpg_2020_2021?: number;
    gpg_2019_2020?: number;
    gpg_2018_2019?: number;
    gpg_2017_2018?: number;
}

export interface CompanyDataJoinedTweetsItem {
    companyName: string
    companyNumber?: string;
    gpg_2020_2021?: number;
    gpg_2019_2020?: number;
    gpg_2018_2019?: number;
    gpg_2017_2018?: number;
    hasTwitterData: boolean
    twitterId?: string
    twitterScreenName?: string

}