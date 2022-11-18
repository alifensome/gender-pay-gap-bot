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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqsTweetProcessor = void 0;
const tslog_1 = require("tslog");
const getMostRecentGPG_1 = require("../utils/getMostRecentGPG");
class SqsTweetProcessor {
    constructor(twitterClient, repo, minGPG) {
        this.twitterClient = twitterClient;
        this.logger = new tslog_1.Logger({ name: "SqsTweetProcessor" });
        this.repository = repo;
        this.minGPG = minGPG;
    }
    process({ twitterUserId, tweetId, screenName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.info(JSON.stringify({
                    message: "processing sqs record",
                    eventType: "processingRecord",
                    twitterUserId,
                    tweetId,
                    screenName,
                }));
                const data = this.repository.getGpgForTwitterId(twitterUserId);
                if (!data || !data.companyData) {
                    this.logger.error(JSON.stringify({
                        message: "error finding company",
                        eventType: "errorGettingCompany",
                        tweetId,
                        twitterUserId,
                        errorSendingTweet: 1,
                        screenName,
                    }));
                    throw new Error(`could not find company. TwitterUserId: ${twitterUserId}, ${screenName}`);
                }
                const mostRecentGPG = (0, getMostRecentGPG_1.getMostRecentMedianGPG)(data.companyData);
                if (this.minGPG !== null && mostRecentGPG < this.minGPG) {
                    this.logger.info(JSON.stringify({
                        message: "skipped",
                        eventType: "skipTweet",
                        tweetId,
                        twitterUserId,
                        screenName,
                        companyName: data.companyData.companyName,
                        tempSkip: 1,
                    }));
                    throw new Error("SKIP for now.");
                }
                const copy = this.getCopy(data.companyData);
                yield this.twitterClient.quoteTweet(copy, data.twitterData.twitter_screen_name, tweetId);
                this.logger.info(JSON.stringify({
                    message: "sent tweet",
                    eventType: "sentTweet",
                    tweetId,
                    twitterUserId,
                    screenName,
                    companyName: data.companyData.companyName,
                    successfullySentTweet: 1,
                }));
            }
            catch (error) {
                this.logger.error(JSON.stringify({
                    message: "error sending tweet",
                    eventType: "errorSendingTweet",
                    tweetId,
                    twitterUserId,
                    errorSendingTweet: 1,
                    screenName,
                }));
                throw error;
            }
        });
    }
    getCopy(companyData) {
        const mostRecentGPG = (0, getMostRecentGPG_1.getMostRecentMedianGPG)(companyData);
        let mostRecent = 0;
        if (typeof mostRecentGPG === "string") {
            mostRecent = parseFloat(mostRecentGPG);
        }
        else {
            mostRecent = mostRecentGPG;
        }
        const isPositiveGpg = mostRecent > 0.0;
        if (mostRecent === 0.0) {
            return `In this organisation, men's and women's median hourly pay is equal.`;
        }
        if (isPositiveGpg) {
            return `In this organisation, women's median hourly pay is ${mostRecent}% lower than men's.`;
        }
        else {
            return `In this organisation, women's median hourly pay is ${-1 * mostRecent}% higher than men's.`;
        }
    }
}
exports.SqsTweetProcessor = SqsTweetProcessor;
//# sourceMappingURL=SqsTweetProcessor.js.map