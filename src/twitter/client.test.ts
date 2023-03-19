import { TweetSearchStreamDataItem, TwitterClient } from "./Client";

process.env["TWITTER_API_KEY"] = "consumerKey";
process.env["TWITTER_API_SECRET"] = "consumerSecret";
process.env["TWITTER_ACCESS_TOKEN"] = "accessToken";
process.env["TWITTER_ACCESS_TOKEN_SECRET"] = "accessTokenSecret";

describe("Client", () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  describe("onTweetAtGpga", () => {
    const client = new TwitterClient();
    const mockTweet: TweetSearchStreamDataItem = {
      data: {
        id: "id",
        author_id: "authorId",
        text: "Some tweet.",
        edit_history_tweet_ids: [],
      },
      includes: {
        users: [{ id: "userId", name: "name", username: "UserScreenName" }],
      },
      matching_rules: [],
    };
    it("should handle tweets", async () => {
      const mockHandle = jest.fn();

      await client.handleTweetEvent(mockTweet, mockHandle as any);
      expect(mockHandle).toBeCalledTimes(1);
      expect(mockHandle).toBeCalledWith({
        fullTweetObject: mockTweet,
        isRetweet: false,
        screenName: "UserScreenName",
        text: "Some tweet.",
        timeStamp: "2020-01-01T00:00:00.000Z",
        tweetId: "id",
        twitterUserId: "authorId",
      });
    });
    it("should say if its a retweet", async () => {
      const mockHandle = jest.fn();
      const mockRetweet: TweetSearchStreamDataItem = {
        ...mockTweet,
      };
      (mockRetweet.data.text = "RT Some tweet."),
        await client.handleTweetEvent(mockRetweet, mockHandle as any);
      expect(mockHandle).toBeCalledTimes(1);
      expect(mockHandle).toBeCalledWith({
        fullTweetObject: mockRetweet,
        isRetweet: true,
        screenName: "UserScreenName",
        text: "RT Some tweet.",
        timeStamp: "2020-01-01T00:00:00.000Z",
        tweetId: "id",
        twitterUserId: "authorId",
      });
    });
  });
});
