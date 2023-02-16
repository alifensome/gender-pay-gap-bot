import fs from "fs";
import { CompanyDataCsvItem } from "../read/parseDataFromCompany";
import {
  TwitterData,
  CompanyDataJoinedTweetsItem,
  CompanyDataMultiYearItem,
} from "../types";

class DataImporter {
  readFile(path: string) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }
  companiesGpgData(): CompanyDataMultiYearItem[] {
    return this.readFile("./data/companies_GPG_Data.json");
  }
  companiesGpgDataTest(): CompanyDataMultiYearItem[] {
    return this.readFile("./data/companies_GPG_Data-test.json");
  }
  successfulTweets() {
    return this.readFile("./data/tweets/successful-tweets.json");
  }
  twitterUserDataProd(): TwitterData[] {
    return this.readFile("./data/twitterAccountData/twitterUserData-prod.json");
  }
  twitterUserDataTest(): TwitterData[] {
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

  /**
   * Generic import data/gpg.
   * @param year gpg starting year e.g. 2022 for 2022-2023.
   * @returns 
   */
  gpgByYear(year: number): CompanyDataCsvItem[] {
    return this.readFile(`./data/gpg_${year}_${year + 1}.json`);
  }
  gpg_2022_2023(): CompanyDataCsvItem[] {
    return this.gpgByYear(2022)
  }
  gpg_2021_2022(): CompanyDataCsvItem[] {
    return this.gpgByYear(2021)
  }
  gpg_2020_2021(): CompanyDataCsvItem[] {
    return this.gpgByYear(2020)
  }
  gpg_2019_2020(): CompanyDataCsvItem[] {
    return this.gpgByYear(2019)
  }
  gpg_2018_2019(): CompanyDataCsvItem[] {
    return this.gpgByYear(2018)
  }
  gpg_2017_2018(): CompanyDataCsvItem[] {
    return this.gpgByYear(2017)
  }
  companyDataJoinedTweets(): CompanyDataJoinedTweetsItem[] {
    return this.readFile("./data/companyDataJoinedWithTweets.json");
  }
}

export default DataImporter;
