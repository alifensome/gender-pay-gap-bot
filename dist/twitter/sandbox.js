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
dotenv_1.default.config();
const twitterClient = new twitter_api_client_1.TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // // Search for a user
        // const data = await twitterClient.accountsAndUsers.usersSearch({ q: 'twitterDev' });
        // console.log(data)
        // // Get message event by Id
        //  data = await twitterClient.directMessages.directMessagesEventsShow({ id: '1234' });
        //  console.log(data)
        // // Get most recent 25 retweets of a tweet
        //  data = await twitterClient.tweets.statusesRetweetsById({ id: '12345', count: 25 });
        //  console.log(data)
        // // Get local trends
        //  data = await twitterClient.trends.trendsAvailable();
        //  console.log(data)
        const user = yield twitterClient.accountsAndUsers.usersLookup({ user_id: "36364300" });
        console.log(user);
        // const t = await twitterClient.tweets.search({ q: "international women's day", user_id: "1367415164795039747" })
        // console.log(t)
        //       id: 1368603396748542000,
        // id_str:  '1368603396748541954',
        // This replies to the tweet. This could work
        // const result = await twitterClient.tweets.statusesUpdate({ in_reply_to_status_id: "1368603396748541954", status: "Look at this!", auto_populate_reply_metadata: true })
        // console.log(result)
        // const result = await twitterClient.tweets.statusesUpdate({
        //   attachment_url: "https://twitter.com/PayGapApp/status/1368264962263707651", status: "Look at this!!!", auto_populate_reply_metadata: true,
        // })
        // console.log(result)
        // const iwdTweets =  await twitterClient.tweets.search({ q : "international women's day ", count:1, })
        // console.log(iwdTweets)
    });
}
run();
//# sourceMappingURL=sandbox.js.map