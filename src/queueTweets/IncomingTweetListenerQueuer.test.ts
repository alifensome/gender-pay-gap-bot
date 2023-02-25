import {
  HandleIncomingTweetInput,
  IncomingTweetListenerQueuer,
} from "./IncomingTweetListenerQueuer";
import { relevantWords } from "./relevantWords";
import { Logger } from "tslog";

const twitterData = [{ twitter_id_str: "1" }, { twitter_id_str: "2" }];

describe("IncomingTweetListenerQueuer", () => {
  const mockTwitterClient = {
    startStreamingTweets: jest.fn(),
    startStreamingTweetsTaggingGPGA: jest.fn(),
  };
  const mockSqsClient = {
    queueMessage: jest.fn(),
  };
  const mockSqsTweetAtGpgaClient = {
    queueMessage: jest.fn(),
  };
  const mockDataImporter = {
    twitterUserDataProd: jest.fn().mockReturnValue(twitterData),
  };
  const mockRepository = {
    getTwitterUserByTwitterId: jest.fn().mockReturnValue(twitterData[0]),
    getGpgForTwitterId: jest.fn().mockReturnValue({ companyData: {} }),
  };
  const handler = new IncomingTweetListenerQueuer(
    mockTwitterClient as any,
    mockSqsClient as any,
    mockSqsTweetAtGpgaClient as any,
    mockDataImporter as any,
    mockRepository as any,
    new Logger()
  );
  describe("listen", () => {
    it("should listen to twitter with a handler for company tweets and a handler for tweets at the GPGA", async () => {
      await handler.listen();
      expect(mockTwitterClient.startStreamingTweets).toBeCalledTimes(1);
      expect(mockTwitterClient.startStreamingTweets.mock.calls[0][0]).toEqual([
        "1",
        "2",
      ]);
    });
  });
  describe("getFollowsFromData", () => {
    it("should get the followers into a list", async () => {
      const followers = handler.getFollowsFromData(twitterData as any);
      expect(followers).toEqual(["1", "2"]);
    });
  });
  describe("checkTweetContainsWord", () => {
    it("checks that a special word is in the tweet", () => {
      const result = handler.checkTweetContainsWord("some text...  ");
      expect(result).toBe(false);
    });
    it("checks that a special word is in the tweet", () => {
      const result = handler.checkTweetContainsWord(
        "some text... WOMEN’S DAY "
      );
      expect(result).toBe(true);
    });
    it("should ignore apostrophes", () => {
      let result = handler.checkTweetContainsWord(
        "some text ' '’ '’... women’s history month            "
      );
      expect(result).toBe(true);
      result = handler.checkTweetContainsWord(
        "some text ' '’ '’... women's history month            "
      );
      expect(result).toBe(true);
      result = handler.checkTweetContainsWord(
        "some text ' '’ '’... womens history month            "
      );
      expect(result).toBe(true);
    });
    it("should not pick up random url stuff", () => {
      const text =
        "Can you help us find missing 11-year-old Nathan. Last seen in the Windsor Crescent area of Bridlington around 16:00… https://t.co/IMdCa5mfa1";
      let result = handler.checkTweetContainsWord(text);
      expect(result).toBe(false);
    });
  });
  describe("handleIncomingTweet", () => {
    beforeEach(() => {
      mockSqsClient.queueMessage.mockClear();
    });
    it("should take an incoming tweet and queue it", async () => {
      const input: HandleIncomingTweetInput = {
        twitterUserId: "twitterUserId",
        tweetId: "tweetId",
        user: { a: "user" } as any,
        screenName: "screenName",
        isRetweet: false,
        text: "text",
        timeStamp: "timeStamp",
        fullTweetObject: { text: relevantWords[0].phrase } as any,
      };
      await handler.handleIncomingTweet(input);
      expect(mockSqsClient.queueMessage).toBeCalledWith(input);
    });

    it("should take an incoming tweet directed at the GPGA and queue it to a the tweet at gpga queue", async () => {
      const input: HandleIncomingTweetInput = {
        twitterUserId: "twitterUserId",
        tweetId: "tweetId",
        user: { a: "user" } as any,
        screenName: "screenName",
        isRetweet: false,
        text: "@PayGapApp hello",
        timeStamp: "timeStamp",
        fullTweetObject: { text: relevantWords[0].phrase } as any,
      };
      await handler.handleIncomingTweet(input);
      expect(mockSqsTweetAtGpgaClient.queueMessage).toBeCalledWith(input, 0);
      expect(mockSqsClient.queueMessage).toHaveBeenCalledTimes(0);
    });
  });
});
