import { ListenerV2 } from "./ListenerV2";
import { relevantWords } from "./relevantWords";
import { LambdaLogger } from "../lambdaLogger";
import { HandleIncomingTweetStreamInput } from "../queueTweets/IncomingTweetListenerQueuer";
import {
  User,
  searchRecentTweetsData,
  searchRecentTweetsResponse,
} from "../twitter/types";

const twitterData = [{ twitter_id_str: "1" }, { twitter_id_str: "2" }];

class MockDate extends Date {
  constructor() {
    super("2023-04-01T14:06:01.357Z");
  }
}
// @ts-ignore
global.Date = MockDate;
const mockSearchRecentTweetsData: searchRecentTweetsData = {
  author_id: "twitterUserId",
  id: "tweetId",
  text: "yay International women's day",
  edit_history_tweet_ids: [],
};
const users: User[] = [
  { id: "twitterUserId", username: "screenName", name: "name" },
];

describe("ListenerV2", () => {
  const mockTwitterData: searchRecentTweetsResponse = {
    data: [mockSearchRecentTweetsData, mockSearchRecentTweetsData],
    includes: { users },
    meta: { newest_id: "", oldest_id: "", result_count: 10, next_token: "" },
  };
  const mockTwitterClient = {
    searchRecentTweets: jest.fn().mockResolvedValue(mockTwitterData),
  };
  const mockSqsClient = {
    queueMessage: jest.fn(),
  };
  const mockDataImporter = {
    twitterUserDataProd: jest.fn().mockReturnValue(twitterData),
  };
  const mockRepository = {
    dataImporter: mockDataImporter,
    getTwitterUserByTwitterId: jest.fn().mockReturnValue(twitterData[0]),
    getGpgForTwitterId: jest.fn().mockReturnValue({ companyData: {} }),
  };
  const mockSearchQueryFormer = {
    toQuery: jest.fn().mockReturnValue(["q1", "q2"]),
  };
  const handler = new ListenerV2(
    mockTwitterClient as any,
    mockSqsClient as any,
    mockRepository as any,
    new LambdaLogger("test"),
    mockSearchQueryFormer as any
  );
  const expectedSqsMessage = {
    isRetweet: false,
    screenName: "screenName",
    text: "yay International women's day",
    timeStamp: "2023-04-01T14:06:01.357Z",
    tweetId: "tweetId",
    twitterUserId: "twitterUserId",
  };
  beforeEach(() => {
    mockTwitterClient.searchRecentTweets.mockClear();
  });
  describe("run", () => {
    it("should listen to twitter with a handler for company tweets and a handler for tweets at the GPGA", async () => {
      await handler.run();
      expect(mockTwitterClient.searchRecentTweets).toBeCalledTimes(2);
      expect(mockTwitterClient.searchRecentTweets).toBeCalledWith("q1");
      expect(mockTwitterClient.searchRecentTweets).toBeCalledWith("q2");

      expect(mockSqsClient.queueMessage).toBeCalledTimes(4);
      expect(mockSqsClient.queueMessage).toBeCalledWith(expectedSqsMessage, 0);
    });
  });
  describe("getFollowsFromData", () => {
    it("should get the followers into a list", async () => {
      const followers = handler.getFollowsFromData(twitterData as any);
      expect(followers).toEqual(["1", "2"]);
    });
    it("should deduplicate", async () => {
      const followers = handler.getFollowsFromData([
        ...twitterData,
        ...twitterData,
      ] as any);
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
  describe("handleTweet", () => {
    beforeEach(() => {
      mockSqsClient.queueMessage.mockClear();
    });

    it("should queue relevant tweets", async () => {
      await handler.handleTweet(mockSearchRecentTweetsData, users);

      expect(mockSqsClient.queueMessage).toBeCalledTimes(1);
      expect(mockSqsClient.queueMessage).toBeCalledWith(expectedSqsMessage, 0);
    });

    it("should ignore retweets", async () => {
      const retweet = {
        ...mockSearchRecentTweetsData,
        text: "RT international women's day",
      };
      await handler.handleTweet(retweet, users);

      expect(mockSqsClient.queueMessage).toBeCalledTimes(0);
    });

    it("should ignore irrelevant tweets", async () => {
      const irrelevantTweet = {
        ...mockSearchRecentTweetsData,
        text: "hi Ali.",
      };
      await handler.handleTweet(irrelevantTweet, users);

      expect(mockSqsClient.queueMessage).toBeCalledTimes(0);
    });
  });
});
