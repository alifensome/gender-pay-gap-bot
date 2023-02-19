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
      },
      twitterData: { twitter_screen_name: "name" },
    }),
  };
  const processor = new SqsTweetProcessor(
    mockTwitterClient as any,
    mockRepo as any,
    null
  );
  processor.logger = { info: jest.fn(), error: jest.fn() } as any;

  describe("process", () => {
    it("should process tweets", async () => {
      const input = { tweetId: "123", twitterUserId: "u123", screenName: "" };
      await processor.process(input);
      expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 52.2% lower than men's.";
      expect(mockTwitterClient.quoteTweet).toBeCalledWith(
        expectedCopy,
        "name",
        "123"
      );
    });
    it("should process throw error when GPG < min gpg ", async () => {
      const processorWithMinGpg = new SqsTweetProcessor(
        mockTwitterClient as any,
        mockRepo as any,
        52.3
      );
      processorWithMinGpg.logger = { info: jest.fn(), error: jest.fn() } as any;
      const input = { tweetId: "123", twitterUserId: "u123", screenName: "" };
      expect(
        async () => await processorWithMinGpg.process(input)
      ).rejects.toThrowError("");
      expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 52.2% lower than men's.";
      expect(mockTwitterClient.quoteTweet).toBeCalledWith(
        expectedCopy,
        "name",
        "123"
      );
      expect(processorWithMinGpg.logger.error).toBeCalled();
    });
  });
});
