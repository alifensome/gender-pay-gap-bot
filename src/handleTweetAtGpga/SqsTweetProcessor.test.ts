import {
  getMockCompanyDataItem,
  mockCompanyDataItem,
} from "../unitTestHelpers/mockData";
import { SqsTweetProcessor } from "./SqsTweetProcessor";

const baseInput = {
  twitterUserId: "twitterUserId",
  tweetId: "tweetId",
  user: undefined as any,
  screenName: "screenName",
  isRetweet: false,
  text: "@PayGapApp some random text.",
  timeStamp: "timeStamp",
  fullTweetObject: undefined as any,
};

const mockTwitterClient = {
  replyToTweet: jest.fn(),
};
const mockRepo = {
  checkSetData: jest.fn(),
  fuzzyFindCompanyByName: jest.fn().mockReturnValue({
    exactMatch: mockCompanyDataItem,
    closeMatches: [],
  }),
};
const handler = new SqsTweetProcessor(
  mockTwitterClient as any,
  mockRepo as any
);

describe("SqsTweetProcessor", () => {
  beforeEach(() => {
    mockTwitterClient.replyToTweet.mockClear();
  });
  describe("process", () => {
    it("should parse the tweet and ignore impassable tweets", async () => {
      const input = {
        ...baseInput,
      };
      await handler.process(input);
      expect(mockTwitterClient.replyToTweet).toHaveBeenCalledTimes(0);
    });
    it("should find the exact item and tweet it", async () => {
      const input = {
        ...baseInput,
        text: "@PayGapApp pay gap for Company Name 1",
      };
      await handler.process(input);
      expect(mockTwitterClient.replyToTweet).toHaveBeenCalledTimes(1);
      expect(mockTwitterClient.replyToTweet).toBeCalledWith({
        replyTweetId: "tweetId",
        screenName: "screenName",
        tweet:
          "At Company Name Ltd 2, women's median hourly pay is 10.1% lower than men's.",
      });
      expect(mockRepo.fuzzyFindCompanyByName).toBeCalledWith("company name 1");
    });
    it("should find the top 3 items and tweet a list", async () => {
      const input = {
        ...baseInput,
        text: "@PayGapApp pay gap for Company Name 1",
      };
      (mockRepo.fuzzyFindCompanyByName = jest.fn().mockReturnValue({
        exactMatch: null,
        closeMatches: [
          getMockCompanyDataItem("123"),
          getMockCompanyDataItem("456"),
          getMockCompanyDataItem("789"),
          getMockCompanyDataItem("1011"),
        ],
      })),
        await handler.process(input);
      expect(mockTwitterClient.replyToTweet).toHaveBeenCalledTimes(1);
      expect(mockTwitterClient.replyToTweet).toBeCalledWith({
        replyTweetId: "tweetId",
        screenName: "screenName",
        tweet:
          "I found 3 matches for your request. Did you mean:\n\nCompany Name Ltd 123\nCompany Name Ltd 456\nCompany Name Ltd 789\n\nReply with 'pay gap for' followed by the company name and I'll fetch the data",
      });
      expect(mockRepo.fuzzyFindCompanyByName).toBeCalledWith("company name 1");
    });
    it("should find the no items and direct to the website", async () => {
      const input = {
        ...baseInput,
        text: "@PayGapApp pay gap for Company Name 1",
      };
      (mockRepo.fuzzyFindCompanyByName = jest.fn().mockReturnValue({
        exactMatch: null,
        closeMatches: [],
      })),
        await handler.process(input);
      expect(mockTwitterClient.replyToTweet).toHaveBeenCalledTimes(1);
      expect(mockTwitterClient.replyToTweet).toBeCalledWith({
        replyTweetId: "tweetId",
        screenName: "screenName",
        tweet:
          "I couldn't find a match for your request, or there are too many companies matching that name. Try searching for them here instead: https://gender-pay-gap.service.gov.uk/",
      });
      expect(mockRepo.fuzzyFindCompanyByName).toBeCalledWith("company name 1");
    });
  });
});
