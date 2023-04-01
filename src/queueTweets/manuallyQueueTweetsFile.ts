import dotEnv from "dotenv";
import { SqsClient } from "../sqs/Client";
import { HandleIncomingTweetInput } from "./IncomingTweetListenerQueuer";
import fs from "fs";

dotEnv.config();

const sqsClient = new SqsClient();

const data = JSON.parse(fs.readFileSync("./data/temp/missed.json", "utf8"));
console.log(data.length);

for (let index = 0; index < data.length; index++) {
  const element = data[index];
  const twitterUserId = element.twitterUserId;
  const tweetId = element.tweetId;
  const screenName = element.screenName;
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
}
