"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Client_1 = require("../sqs/Client");
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const sqsClient = new Client_1.SqsClient();
const data = JSON.parse(fs_1.default.readFileSync('./data/temp/missed.json', 'utf8'));
console.log(data.length);
for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const twitterUserId = element.twitterUserId;
    const tweetId = element.tweetId;
    const screenName = element.screenName;
    const input = { twitterUserId, tweetId, screenName };
    console.log(input);
    if (!twitterUserId || !tweetId || !screenName) {
        throw new Error("Bad input.");
    }
    sqsClient.queueMessage(input);
}
//# sourceMappingURL=manuallyQueueTweetsFile.js.map