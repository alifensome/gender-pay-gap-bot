import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { TweetAllGpgTask } from "./tweetAllGpgTask";

const dataImporter = new DataImporter()
const isTest = process.env.IS_TEST === "true"
const twitterClient = new TwitterClient(isTest)
const repo = new Repository(dataImporter)
const tableName = process.env.TABLE_NAME
const processor = new TweetAllGpgTask(twitterClient, repo, isTest, tableName)


export async function handler(event, context) {
    await processor.sendNextTweet()
    return { ok: true };
}
