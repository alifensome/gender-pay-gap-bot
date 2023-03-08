import dotEnv from "dotenv";
import DataImporter from "../importData";
import { TwitterClient } from "twitter-api-client";
import { getEnvVar } from "../utils/getEnvVar";
import { promptUser } from "../utils/promptUser";
import { TwitterData } from "../types";
import { wait } from "../utils/wait";
import { writeJsonFile } from "../utils/write";

const dataImporter = new DataImporter();

dotEnv.config();

const path = process.argv[2];
const dataToFix: TwitterData[] = dataImporter.readFile(path);

const twitterClient = new TwitterClient({
  apiKey: getEnvVar("TWITTER_API_KEY"),
  apiSecret: getEnvVar("TWITTER_API_SECRET"),
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function run() {
  const errorsBadMatch = [];
  const errors404 = [];
  try {
    console.log(
      `Fixing data for path: ${path}. Items in file: ${dataToFix.length}. Continue?`
    );
    const shouldContinue = await promptUser("Continue?");

    if (shouldContinue !== "y") {
      console.log("exiting...");
      process.exit(0);
    }

    for (let index = 0; index < dataToFix.length; index++) {
      await wait(3000);
      if (index % 100 === 0) {
        console.log(`${(index / dataToFix.length) * 100}%`);
      }
      const row = dataToFix[index];
      if (!row.twitter_id_str || !row.twitter_screen_name) {
        throw new Error(`unprocessable row: ${JSON.stringify(row)}`);
      }
      console.log(
        `Searching Screen name: ${row.twitter_screen_name}, ID: ${row.twitter_id_str}, companyName: ${row.companyName}.`
      );
      let user = null;
      try {
        user = await twitterClient.accountsAndUsers.usersLookup({
          screen_name: row.twitter_screen_name,
        });
      } catch (error) {
        if ((error as any).statusCode === 404) {
          try {
            user = await twitterClient.accountsAndUsers.usersLookup({
              user_id: row.twitter_id_str,
            });
          } catch (error) {
            if ((error as any).statusCode === 404) {
              errors404.push({
                row,
              });
              continue;
            }
            throw error;
          }
        } else {
          throw error;
        }
      }
      if (
        row.twitter_id_str !== user[0].id_str ||
        row.twitter_screen_name.toLocaleLowerCase() !==
          user[0].screen_name.toLocaleLowerCase()
      ) {
        console.log(JSON.stringify({ row, user }));
        errorsBadMatch.push({
          row,
          correctUserName: user[0].screen_name,
          correctTwitterId: user[0].id_str,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
  console.log({
    errorsBadMatch: JSON.stringify(errorsBadMatch),
    errors404: JSON.stringify(errors404),
  });
  await writeJsonFile('./data/twitterAccountData/ids-screenName.json',{
    errorsBadMatch,
    errors404,
  })
  console.log("exiting...");
  process.exit(0);
}

run();
