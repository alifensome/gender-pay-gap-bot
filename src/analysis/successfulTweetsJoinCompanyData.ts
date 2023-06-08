import DataImporter from "../importData";
const dataImporter = new DataImporter();
import { getAllCompanyDataByTwitterScreenName } from "../twitter/getCompanyDataByTwitterId.js";
import { writeJsonFile } from "../utils/write.js";

const donkedData = dataImporter.successfulTweets();
const companies = dataImporter.twitterUserDataProdLocal();
console.log("Total Donks:", donkedData.length);

const joinedData: any[] = [];
for (let index = 0; index < donkedData.length; index++) {
  const d = donkedData[index];
  const companyData = getAllCompanyDataByTwitterScreenName(
    d.twitter_screen_name,
    companies
  );
  if (!companyData || !companyData.length) {
    throw new Error(`No company Data for ${JSON.stringify(d)}`);
  }
  joinedData.push({ ...d, ...companyData[0] });
}

writeJsonFile("./data/tweets/successfulTweetsWithCompanyData.json", joinedData);
