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
const IncomingTweetListenerQueuer_1 = require("./IncomingTweetListenerQueuer");
const relevantWords_1 = require("./relevantWords");
const tslog_1 = require("tslog");
const twitterData = [{ twitter_id_str: "1" }, { twitter_id_str: "2" }];
describe("IncomingTweetListenerQueuer", () => {
    const mockTwitterClient = {
        startStreamingTweets: jest.fn(),
    };
    const mockSqsClient = {
        queueMessage: jest.fn(),
    };
    const mockDataImporter = {
        twitterUserDataProd: jest.fn().mockReturnValue(twitterData),
    };
    const mockRepository = {
        getGpgForTwitterId: jest.fn().mockReturnValue({ companyData: {} }),
    };
    const handler = new IncomingTweetListenerQueuer_1.IncomingTweetListenerQueuer(mockTwitterClient, mockSqsClient, mockDataImporter, mockRepository, new tslog_1.Logger());
    describe("listen", () => {
        it("should listen to twitter with a handler", () => __awaiter(void 0, void 0, void 0, function* () {
            yield handler.listen();
            expect(mockTwitterClient.startStreamingTweets).toBeCalledTimes(1);
            expect(mockTwitterClient.startStreamingTweets.mock.calls[0][0]).toEqual([
                "1",
                "2",
            ]);
        }));
    });
    describe("getFollowsFromData", () => {
        it("should get the followers into a list", () => __awaiter(void 0, void 0, void 0, function* () {
            const followers = handler.getFollowsFromData(twitterData);
            expect(followers).toEqual(["1", "2"]);
        }));
    });
    describe("checkTweetContainsWord", () => {
        it("checks that a special word is in the tweet", () => {
            const result = handler.checkTweetContainsWord("some text...  ");
            expect(result).toBe(false);
        });
        it("checks that a special word is in the tweet", () => {
            const result = handler.checkTweetContainsWord("some text... WOMEN’S DAY ");
            expect(result).toBe(true);
        });
        it("should ignore apostrophes", () => {
            let result = handler.checkTweetContainsWord("some text ' '’ '’... women’s history month            ");
            expect(result).toBe(true);
            result = handler.checkTweetContainsWord("some text ' '’ '’... women's history month            ");
            expect(result).toBe(true);
            result = handler.checkTweetContainsWord("some text ' '’ '’... womens history month            ");
            expect(result).toBe(true);
        });
        it("should not pick up random url stuff", () => {
            const text = "Can you help us find missing 11-year-old Nathan. Last seen in the Windsor Crescent area of Bridlington around 16:00… https://t.co/IMdCa5mfa1";
            let result = handler.checkTweetContainsWord(text);
            expect(result).toBe(false);
        });
    });
    describe("handleIncomingTweet", () => {
        it("should take an incoming tweet and queue it", () => __awaiter(void 0, void 0, void 0, function* () {
            const input = {
                twitterUserId: "twitterUserId",
                tweetId: "tweetId",
                user: "user",
                screenName: "screenName",
                isRetweet: false,
                text: "text",
                timeStamp: "timeStamp",
                fullTweetObject: { text: relevantWords_1.relevantWords[0].phrase },
            };
            yield handler.handleIncomingTweet(input);
            expect(mockSqsClient.queueMessage).toBeCalledWith(input);
        }));
    });
});
//# sourceMappingURL=IncomingTweetListenerQueuer.test.js.map