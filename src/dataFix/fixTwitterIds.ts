import dotEnv from "dotenv";
import DataImporter from "../importData";
import { TwitterClient } from "twitter-api-client";
import { writeJsonFile } from "../utils/write.js";
import { getEnvVar } from "../utils/getEnvVar";
const dataImporter = new DataImporter();

dotEnv.config();
const companyDataProd = dataImporter.twitterUserDataProd();

const twitterClient = new TwitterClient({
  apiKey: getEnvVar("TWITTER_API_KEY"),
  apiSecret: getEnvVar("TWITTER_API_SECRET"),
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function run() {
  const maxValue = 2147483647;
  let numberOfErrors = 0;
  const newCompanyData: any[] = [];
  for (let index = 0; index < companyDataProd.length; index++) {
    if (index % 100 === 0) {
      console.log(`${(index / companyDataProd.length) * 100}%`);
    }
    const row = companyDataProd[index];
    if (row.twitter_id_str) {
      continue;
    }
    let userIdStr = `${row.twitter_id}`;
    if (row.twitter_id > maxValue) {
      numberOfErrors++;
      const user = await twitterClient.accountsAndUsers.usersLookup({
        screen_name: row.twitter_screen_name,
      });
      console.log("Found ", user[0].screen_name);
      userIdStr = user[0].id_str;
    }
    row.twitter_id_str = userIdStr;
    newCompanyData.push(row);
  }

  writeJsonFile("./dataFix/twitterIds.json", newCompanyData);
  console.log(numberOfErrors);
}

run();
