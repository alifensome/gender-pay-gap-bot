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
exports.IncomingTweetListenerQueuer = void 0;
const debug_1 = require("../utils/debug");
const replace_1 = require("../utils/replace");
const relevantWords_1 = require("./relevantWords");
class IncomingTweetListenerQueuer {
    constructor(twitterClient, sqsClient, dataImporter, repository, logger) {
        this.twitterClient = twitterClient;
        this.sqsClient = sqsClient;
        this.dataImporter = dataImporter;
        this.repository = repository;
        this.logger = logger;
    }
    listen(isTest) {
        const twitterData = this.dataImporter.twitterUserDataProd();
        if (isTest) {
            this.logger.info(JSON.stringify({ message: "running in debug mode!" }));
            twitterData.push(this.dataImporter.twitterUserDataTest()[0]);
        }
        const followers = this.getFollowsFromData(twitterData);
        return this.twitterClient.startStreamingTweets(followers, (input) => this.handleIncomingTweet(input));
    }
    getFollowsFromData(companies) {
        const twitterIds = [];
        for (let index = 0; index < companies.length; index++) {
            const c = companies[index];
            twitterIds.push(c.twitter_id_str);
        }
        if (twitterIds.length === 0) {
            throw new Error("No twitter Ids!");
        }
        if (twitterIds.length > 4000) {
            this.logger.error(JSON.stringify({ message: "too many twitter IDs to watch!" }));
        }
        return twitterIds;
    }
    handleIncomingTweet(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input.isRetweet) {
                (0, debug_1.debugPrint)({
                    message: "Ignoring retweet",
                    eventType: "ignoringRetweet",
                });
                return;
            }
            // Check tweet contains words
            const isRelevantTweet = this.checkTweetContainsWord(input.fullTweetObject.text);
            if (!isRelevantTweet) {
                (0, debug_1.debugPrint)("irrelevant tweet");
                return;
            }
            const data = this.repository.getGpgForTwitterId(input.twitterUserId);
            if (!data || !data.companyData) {
                this.logger.info(JSON.stringify({
                    message: "could not find twitter user, ignoring.",
                    twitterUserId: input.twitterUserId,
                    screenName: input.screenName,
                    eventType: "couldNotGetUserIgnoring",
                }));
                return;
            }
            // Queue the message
            yield this.sqsClient.queueMessage(input);
            this.logger.info(JSON.stringify({
                message: `successfully queued tweet: ${input.tweetId}, userId: ${input.twitterUserId}`,
                eventType: "successfulQueue",
                screenName: input.screenName,
            }));
        });
    }
    checkTweetContainsWord(tweet) {
        const upperCaseTweet = uppercaseAndReplace(tweet);
        const tweetedWords = upperCaseTweet.split(/[ ,]+/);
        for (let index = 0; index < relevantWords_1.relevantWords.length; index++) {
            const relevantWord = relevantWords_1.relevantWords[index];
            if (relevantWord.requiresExact) {
                const result = this.checkContainsExactWord(tweetedWords, relevantWord.phrase);
                if (result) {
                    return true;
                }
            }
            else {
                const result = this.checkContainsPhrase(upperCaseTweet, relevantWord.phrase);
                if (result) {
                    return true;
                }
            }
        }
        return false;
    }
    checkContainsPhrase(upperCaseTweet, relivenatPhrase) {
        if (upperCaseTweet.includes(relivenatPhrase)) {
            return true;
        }
        return false;
    }
    checkContainsExactWord(tweetedWords, relivenatPhrase) {
        for (let index = 0; index < tweetedWords.length; index++) {
            const tweetedWord = tweetedWords[index];
            if (tweetedWord === relivenatPhrase) {
                return true;
            }
        }
        return false;
    }
}
exports.IncomingTweetListenerQueuer = IncomingTweetListenerQueuer;
function uppercaseAndReplace(tweet) {
    const replacements = [
        { find: "'", replace: "" },
        { find: "’", replace: "" },
        { find: "#", replace: "" },
    ];
    const upperCaseTweet = (0, replace_1.replaceMultiple)(tweet.toUpperCase(), replacements);
    return upperCaseTweet;
}
//# sourceMappingURL=IncomingTweetListenerQueuer.js.map