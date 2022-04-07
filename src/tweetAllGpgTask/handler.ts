import DynamoDbClient from "../dynamodb/Client";
import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { LambdaClient } from "../lambdaClient/LambdaClient";
import GraphPlotter from "../plotGraph/plot";
import { TwitterClient } from "../twitter/Client";
import { TweetAllGpgTask } from "./tweetAllGpgTask";

const region = "eu-west-2"
const dataImporter = new DataImporter()
const isTest = process.env.IS_TEST === "true"
const twitterClient = new TwitterClient(isTest)
const repo = new Repository(dataImporter)
const tableName = process.env.TABLE_NAME
const dynamoDbClient = new DynamoDbClient(tableName)
const lambdaClient = new LambdaClient(region)
const processor = new TweetAllGpgTask(twitterClient, repo, isTest, dynamoDbClient, lambdaClient)

export async function handler(event, context) {
    await processor.sendNextTweet()
    return { ok: true };
}
