import {
  HandleIncomingTweetStreamInput,
  IncomingTweetListenerQueuer,
} from "./IncomingTweetListenerQueuer";
import { relevantWords } from "../listenerV2/relevantWords";
import { Logger } from "tslog";

const twitterData = [{ twitter_id_str: "1" }, { twitter_id_str: "2" }];

describe("IncomingTweetListenerQueuer", () => {
  const mockTwitterClient = {
    filterStreamV2: jest.fn(),
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
    mockSqsTweetAtGpgaClient as any,
    mockDataImporter as any,
    mockRepository as any,
    new Logger()
  );
  describe("listen", () => {
    it("should listen to twitter with a handler for company tweets and a handler for tweets at the GPGA", async () => {
      await handler.listen();
      expect(mockTwitterClient.filterStreamV2).toBeCalledTimes(1);
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

  describe("handleIncomingTweet", () => {
    beforeEach(() => {
      mockSqsTweetAtGpgaClient.queueMessage.mockClear();
    });

    it("should take an incoming tweet directed at the GPGA and queue it to a the tweet at gpga queue", async () => {
      const input: HandleIncomingTweetStreamInput = {
        twitterUserId: "twitterUserId",
        tweetId: "tweetId",
        screenName: "screenName",
        isRetweet: false,
        text: "@PayGapApp hello",
        timeStamp: "timeStamp",
        fullTweetObject: {
          text: relevantWords[0].phrase,
        } as any,
      };
      await handler.handleIncomingTweet(input);
      expect(mockSqsTweetAtGpgaClient.queueMessage).toBeCalledWith(input, 0);
    });
  });
  it("should take an incoming tweet directed at the GPGA and queue it to a the tweet at gpga queue even if its a reply", async () => {
    const input: HandleIncomingTweetStreamInput = {
      twitterUserId: "twitterUserId",
      tweetId: "tweetId",
      screenName: "screenName",
      isRetweet: false,
      text: "@PayGapApp hello",
      timeStamp: "timeStamp",
      fullTweetObject: {
        text: relevantWords[0].phrase,
        in_reply_to_status_id: "in_reply_to_status_id",
      } as any,
    };
    await handler.handleIncomingTweet(input);
    expect(mockSqsTweetAtGpgaClient.queueMessage).toBeCalledWith(input, 0);
  });
});
