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
exports.getCompanyDeletedTweets = void 0;
const twitter_api_client_1 = require("twitter-api-client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const twitterClient = new twitter_api_client_1.TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
function getCompanyDeletedTweets(twitterIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const listOfListTwitterIds = truncate(twitterIds);
        printMatrix(listOfListTwitterIds);
        const allDeletedStatuses = [];
        for (let index = 0; index < listOfListTwitterIds.length; index++) {
            const listOfTwitterIds = listOfListTwitterIds[index];
            const ids = listOfTwitterIds.join(",");
            const statuses = yield twitterClient.tweets.statusesLookup({ id: ids, map: true });
            for (const key in statuses.id) {
                const value = statuses.id[key];
                if (value == null) {
                    allDeletedStatuses.push(key);
                }
            }
        }
        return allDeletedStatuses;
    });
}
exports.getCompanyDeletedTweets = getCompanyDeletedTweets;
function printMatrix(listOfListTwitterIds) {
    for (let index = 0; index < listOfListTwitterIds.length; index++) {
        const l = listOfListTwitterIds[index];
        console.log(l.length);
    }
}
function truncate(list, items = 100) {
    const matrix = [];
    let attempts = 0;
    while (attempts < 50) {
        attempts++;
        if (list.length == 0) {
            break;
        }
        matrix.push(list.slice(0, items));
        list.splice(0, items);
    }
    return matrix;
}
//# sourceMappingURL=hasCompanyDeletedTweet.js.map