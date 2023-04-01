import dotEnv from "dotenv";
import { SqsClient } from "../sqs/Client";
import { Logger } from "tslog";
import { TwitterClient } from "../twitter/Client";
import { HandleIncomingTweetInput } from "./IncomingTweetListenerQueuer";
import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { argv } from "process";

dotEnv.config();

const twitterClient = new TwitterClient();
const sqsClient = new SqsClient();
const dataImporter = new DataImporter();
const repository = new Repository(dataImporter);
const logger = new Logger();

const twitterUserId = argv[2];
const tweetId = argv[3];
const screenName = argv[4];
if (!twitterUserId || !tweetId || !screenName) {
  throw new Error("Bad input.");
}
const input: HandleIncomingTweetInput = {
  twitterUserId,
  tweetId,
  screenName,
  isRetweet: false,
  text: "",
  timeStamp: "",
};
console.log(input);
sqsClient.queueMessage(input);
