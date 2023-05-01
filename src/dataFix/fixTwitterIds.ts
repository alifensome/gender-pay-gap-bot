import dotEnv from "dotenv";
import DataImporter from "../importData";
import { TwitterClient } from "twitter-api-client";
import { writeJsonFile } from "../utils/write.js";
import { getEnvVar } from "../utils/getEnvVar";
import { promptUser } from "../utils/promptUser";
import { TwitterData } from "../types";
import { isValidTwitterItem } from "../utils/isValidTwitterItem";
const dataImporter = new DataImporter();

// const companyDataProd = dataImporter.twitterUserDataProd();

dotEnv.config();

const path = process.argv[2];
console.log(`Fixing data fro path: ${path}. Continue?`);
const dataToFix: TwitterData[] = dataImporter.readFile(path);

const twitterClient = new TwitterClient({
  apiKey: getEnvVar("TWITTER_API_KEY"),
  apiSecret: getEnvVar("TWITTER_API_SECRET"),
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function run() {
  const shouldContinue = await promptUser("Continue?");

  if (shouldContinue !== "y") {
    console.log("exiting...");
    process.exit(0);
  }

  const maxValue = 2147483647;
  let numberOfErrors = 0;
  const newCompanyData: any[] = [];
  for (let index = 0; index < dataToFix.length; index++) {
    if (index % 100 === 0) {
      console.log(`${(index / dataToFix.length) * 100}%`);
    }
    const row = dataToFix[index];
    // unprocessable item
    if (
      !row.twitter_id_str &&
      !(row as any).twitter_id &&
      !row.twitter_screen_name
    ) {
      throw new Error(`unprocessable row: ${JSON.stringify(row)}`);
    }
    if (row.twitter_id_str && row.twitter_screen_name) {
      newCompanyData.push(row);
      continue;
    }
    let userIdStr = `${(row as any).twitter_id}`;
    let twitter_screen_name: string = row.twitter_screen_name;
    if (!(row as any).twitter_id || (row as any).twitter_id >= maxValue) {
      numberOfErrors++;
      //todo some of these data points don't have twitter_screen_name
      if (row.twitter_screen_name) {
        const user = await twitterClient.accountsAndUsers.usersLookup({
          screen_name: row.twitter_screen_name,
        });
        console.log(
          `Found ${row.companyName}, ${user[0].screen_name}, ID: ${user[0].id_str}.`
        );
        userIdStr = user[0].id_str;
        twitter_screen_name = user[0].screen_name;
      } else if (row.twitter_id_str || (row as any).twitter_id) {
        const user = await twitterClient.accountsAndUsers.usersLookup({
          user_id: row.twitter_id_str || `${(row as any).twitter_id}`,
        });
        console.log(
          `Found ${row.companyName}, ${user[0].screen_name}, ID: ${user[0].id_str}.`
        );
        userIdStr = user[0].id_str;
        twitter_screen_name = user[0].screen_name;
      }
    }
    row.twitter_id_str = userIdStr;
    row.twitter_screen_name = twitter_screen_name;
    if (!isValidTwitterItem(row)) {
      throw new Error(`invalid item ${JSON.stringify(row)}`);
    }
    newCompanyData.push(row);
  }
  // const row = companyDataProd[index];
  // if (row.twitter_id_str) {
  //   continue;
  // }
  // let userIdStr = `${row.twitter_id}`;
  // if (row.twitter_id > maxValue) {
  //   numberOfErrors++;
  //   const user = await twitterClient.accountsAndUsers.usersLookup({
  //     screen_name: row.twitter_screen_name,
  //   });
  //   console.log("Found ", user[0].screen_name);
  //   userIdStr = user[0].id_str;
  // }
  // row.twitter_id_str = userIdStr;
  // newCompanyData.push(row);
  // }

  console.log(numberOfErrors);
  await writeJsonFile(path, newCompanyData);
  console.log(
    `Number of items: ${newCompanyData.length}. Number of errors:${numberOfErrors}.`
  );
  console.log("exiting...");
  process.exit(0);
}

run();
