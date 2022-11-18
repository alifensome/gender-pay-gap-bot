"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Client_1 = require("../sqs/Client");
const tslog_1 = require("tslog");
const Client_2 = require("../twitter/Client");
const importData_1 = __importDefault(require("../importData"));
const Repository_1 = require("../importData/Repository");
const process_1 = require("process");
dotenv_1.default.config();
const twitterClient = new Client_2.TwitterClient();
const sqsClient = new Client_1.SqsClient();
const dataImporter = new importData_1.default();
const repository = new Repository_1.Repository(dataImporter);
const logger = new tslog_1.Logger();
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
const twitterUserId = process_1.argv[2];
const tweetId = process_1.argv[3];
const screenName = process_1.argv[4];
const input = { twitterUserId, tweetId, screenName };
console.log(input);
if (!twitterUserId || !tweetId || !screenName) {
    throw new Error("Bad input.");
}
sqsClient.queueMessage(input);
//# sourceMappingURL=manuallyQueueTweets.js.map