import { SqsTweetProcessor } from "./SqsTweetProcessor";

describe("SqsTweetProcessor", () => {
  const mockTwitterClient = {
    quoteTweet: jest.fn(),
  };
  const mockRepo = {
    getGpgForTwitterId: jest.fn().mockReturnValue({
      companyData: {
        data2021To2022: { medianGpg: 52.2 },
        data2020To2021: { medianGpg: 0 },
        companyNumber: "321",
        companyName: "companyName",
      },
      twitterData: { twitter_screen_name: "name" },
    }),
  };
  const mockDynamoDB = {
    getItem: jest.fn().mockResolvedValue(null),
    putItem: jest.fn(),
  };
  const processor = new SqsTweetProcessor(
    mockTwitterClient as any,
    mockRepo as any,
    null,
    mockDynamoDB as any
  );
  processor.logger = { info: jest.fn(), error: jest.fn() } as any;

  describe("process", () => {
    beforeEach(() => {
      mockTwitterClient.quoteTweet.mockClear();
    });
    it("should process tweets", async () => {
      const input = {
        tweetId: "123",
        twitterUserId: "u123",
        screenName: "name",
      };
      await processor.process(input);
      expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 52.2% lower than men's. The pay gap is 52.2 percentage points wider than the previous year.";
      expect(mockTwitterClient.quoteTweet).toBeCalledWith(
        expectedCopy,
        "name",
        "123"
      );
      expect(mockDynamoDB.getItem).toBeCalledTimes(1);
      expect(mockDynamoDB.getItem).toBeCalledWith({
        id: "123",
        pk: "successfulTweet",
      });

      expect(mockDynamoDB.putItem).toBeCalledTimes(1);
      expect(mockDynamoDB.putItem).toBeCalledWith({
        id: "123",
        pk: "successfulTweet",
        data: {
          companyName: "companyName",
          screenName: "name",
          tweetId: "123",
          twitterUserId: "u123",
        },
      });
    });
    it("should process throw error when GPG < min gpg ", async () => {
      const processorWithMinGpg = new SqsTweetProcessor(
        mockTwitterClient as any,
        mockRepo as any,
        52.3,
        mockDynamoDB as any
      );
      processorWithMinGpg.logger = { info: jest.fn(), error: jest.fn() } as any;
      const input = { tweetId: "123", twitterUserId: "u123", screenName: "" };
      expect(
        async () => await processorWithMinGpg.process(input)
      ).rejects.toThrowError("Skip for now.");
      expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId);
      expect(mockTwitterClient.quoteTweet).toBeCalledTimes(0);
      expect(processorWithMinGpg.logger.info).toBeCalled();
    });
  });
});
