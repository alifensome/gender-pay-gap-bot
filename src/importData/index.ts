import fs from "fs";
import { CompanyDataCsvItem } from "../read/combineDataSets/types";
import { TwitterData, CompanyDataMultiYearItem } from "../types";
import { S3 } from "../s3/s3Client";

class DataImporter {
  s3Client: S3;
  constructor() {
    this.s3Client = new S3();
  }
  readFile(path: string) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }

  async readfileLocallyOrGetFromS3<T>(
    path: string,
    fileName: string
  ): Promise<T[]> {
    if (fs.existsSync(path)) {
      return this.readFile(path);
    } else {
      return await this.s3Client.getData(fileName);
    }
  }
  companiesGpgDataLocal(): CompanyDataMultiYearItem[] {
    const fileName = "companies_GPG_Data.json";
    const path = "./data/" + fileName;
    return this.readFile(path);
  }
  async companiesGpgData(): Promise<CompanyDataMultiYearItem[]> {
    const fileName = "companies_GPG_Data.json";
    const path = "./data/" + fileName;
    return this.readfileLocallyOrGetFromS3<CompanyDataMultiYearItem>(
      path,
      fileName
    );
  }
  companiesGpgDataTest(): CompanyDataMultiYearItem[] {
    return this.readFile("./data/companies_GPG_Data-test.json");
  }
  successfulTweets() {
    return this.readFile("./data/tweets/successful-tweets.json");
  }
  twitterUserDataProdLocal(): TwitterData[] {
    const fileName = "twitterUserData-prod.json";
    const path = `./data/twitterAccountData/${fileName}`;
    return this.readFile(path);
  }
  async twitterUserDataProd(): Promise<TwitterData[]> {
    const fileName = "twitterUserData-prod.json";
    const path = `./data/twitterAccountData/${fileName}`;
    return this.readfileLocallyOrGetFromS3<TwitterData>(path, fileName);
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
  gpg_2023_2024(): CompanyDataCsvItem[] {
    return this.gpgByYear(2023);
  }
  gpg_2022_2023(): CompanyDataCsvItem[] {
    return this.gpgByYear(2022);
  }
  gpg_2021_2022(): CompanyDataCsvItem[] {
    return this.gpgByYear(2021);
  }
  gpg_2020_2021(): CompanyDataCsvItem[] {
    return this.gpgByYear(2020);
  }
  gpg_2019_2020(): CompanyDataCsvItem[] {
    return this.gpgByYear(2019);
  }
  gpg_2018_2019(): CompanyDataCsvItem[] {
    return this.gpgByYear(2018);
  }
  gpg_2017_2018(): CompanyDataCsvItem[] {
    return this.gpgByYear(2017);
  }
}

export default DataImporter;
