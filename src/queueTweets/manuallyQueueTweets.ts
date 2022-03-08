import dotEnv from "dotenv"
import { SqsClient } from "../sqs/Client"
import { Logger } from "tslog"
import { TwitterClient } from "../twitter/Client"
import { HandleIncomingTweetInput } from "./IncomingTweetListenerQueuer"
import DataImporter from "../importData"
import { Repository } from "../importData/Repository"
import { argv } from "process"

dotEnv.config()

const twitterClient = new TwitterClient()
const sqsClient = new SqsClient()
const dataImporter = new DataImporter()
const repository = new Repository(dataImporter)
const logger = new Logger()

// HandleIncomingTweetInput {
//     twitterUserId: string;
//     tweetId: string;
//     user: string;
//     screenName: string;
//     isRetweet: boolean;
//     text: string;
//     timeStamp: string;
//     fullTweetObject: any;
// }

const twitterUserId = argv[2]
const tweetId = argv[3]
const screenName = argv[4]
const input: Partial<HandleIncomingTweetInput> = { twitterUserId, tweetId, screenName }
console.log(input)
if (!twitterUserId || !tweetId || !screenName) {
    throw new Error("Bad input.")
}
sqsClient.queueMessage(input)