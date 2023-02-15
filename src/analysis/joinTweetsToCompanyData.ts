import DataImporter from "../importData";
import { TwitterData } from "../types";
import { findCompany } from "../utils/findCompany";
import { writeJsonFile } from "../utils/write";

const dataImporter = new DataImporter();
const companiesData = dataImporter.companiesGpgData();
const twitterData = dataImporter.twitterUserDataProd();

const joinedData: any = [];
for (let index = 0; index < companiesData.length; index++) {
  const c = companiesData[index];
  const twitterCompany = findCompany(
    c.companyName,
    c.companyNumber,
    twitterData
  ) as TwitterData;
  if (twitterCompany) {
    joinedData.push({
      ...c,
      hasTwitterData: true,
      twitterId: twitterCompany.twitter_id_str,
      twitterScreenName: twitterCompany.twitter_screen_name,
    });
  } else {
    joinedData.push({ ...c, hasTwitterData: false });
  }
}

writeJsonFile("./data/companyDataJoinedWithTweets.json", joinedData);
