"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twitter_api_client_1 = require("twitter-api-client");
const dotenv_1 = __importDefault(require("dotenv"));
const write_js_1 = require("../utils/write.js");
const bigInt_js_1 = __importDefault(require("../bigInt/bigInt.js"));
dotenv_1.default.config();
const twitterClient = new twitter_api_client_1.TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let max_id = "1369758162807586816";
        let allTimeLineTweets = [];
        while (true) {
            const timeLine = yield twitterClient.tweets.statusesUserTimeline({ user_id: "1367415164795039747", count: 1000, max_id, trim_user: true });
            if (!timeLine.length) {
                break;
            }
            allTimeLineTweets = allTimeLineTweets.concat(timeLine);
            const lastTweetId = timeLine[timeLine.length - 1].id_str;
            const bi = new bigInt_js_1.default(lastTweetId);
            bi.minusOne();
            max_id = bi.toString();
        }
        console.log("Count: ", allTimeLineTweets.length);
        yield (0, write_js_1.writeJsonFile)("./data/tweets/allTimeLineTweets.json", allTimeLineTweets);
        for (let index = 0; index < allTimeLineTweets.length; index++) {
            const post = allTimeLineTweets[index];
            console.log(index, " - ", post.id_str, " QuotedStatusId:", post.quoted_status_id_str, "\n");
        }
    });
}
run();
//# sourceMappingURL=getAllTimeLinePosts.js.map