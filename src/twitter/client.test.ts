import { TwitterClient } from "./Client";

process.env["TWITTER_API_KEY"] = "consumerKey";
process.env["TWITTER_API_SECRET"] = "consumerSecret";
process.env["TWITTER_ACCESS_TOKEN"] = "accessToken";
process.env["TWITTER_ACCESS_TOKEN_SECRET"] = "accessTokenSecret";

describe("Client", () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  describe("onTweetAtGpga", () => {
    const client = new TwitterClient();
    const mockTweet = {
      id_str: "id_str",
      id: "should not be used as is wrong unless parsed with bigint!",
      user: {
        id_str: "userId",
        screen_name: "UserScreenName",
      },
      text: "Some tweet.",
    } as any;
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
        tweetId: "id_str",
        twitterUserId: "userId",
        user: {
          id_str: "userId",
          screen_name: "UserScreenName",
        },
      });
    });
    it("should say if its a retweet", async () => {
      const mockHandle = jest.fn();
      const mockRetweet = {
        ...mockTweet,
        text: "RT Some tweet.",
      } as any;
      await client.handleTweetEvent(mockRetweet, mockHandle as any);
      expect(mockHandle).toBeCalledTimes(1);
      expect(mockHandle).toBeCalledWith({
        fullTweetObject: mockRetweet,
        isRetweet: true,
        screenName: "UserScreenName",
        text: "RT Some tweet.",
        timeStamp: "2020-01-01T00:00:00.000Z",
        tweetId: "id_str",
        twitterUserId: "userId",
        user: {
          id_str: "userId",
          screen_name: "UserScreenName",
        },
      });
    });
  });
});
