import DynamoDbClient from "../dynamodb/Client";
import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import GraphPlotter from "../plotGraph/plot";
import { TwitterClient } from "../twitter/Client";
import { TweetAllGpgTask } from "./tweetAllGpgTask";

const dataImporter = new DataImporter()
const isTest = process.env.IS_TEST === "true"
const twitterClient = new TwitterClient(isTest)
const repo = new Repository(dataImporter)
const tableName = process.env.TABLE_NAME
const dynamoDbClient = new DynamoDbClient(tableName)
const graphPlotter = new GraphPlotter(isTest)
const processor = new TweetAllGpgTask(twitterClient, repo, isTest, dynamoDbClient, graphPlotter)

export async function handler(event, context) {
    await processor.sendNextTweet()
    return { ok: true };
}
