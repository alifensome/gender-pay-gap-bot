import { SqsTweetProcessor } from "./SqsTweetProcessor"

describe("SqsTweetProcessor", () => {
    const mockTwitterClient = {
        quoteTweet: jest.fn()
    }
    const mockRepo = {
        getGpgForTwitterId: jest.fn().mockReturnValue({ companyData: { medianGpg_2021_2022: 52.2, companyNumber: "321" }, twitterData: { twitter_screen_name: "name" } })
    }
    const processor = new SqsTweetProcessor(mockTwitterClient as any, mockRepo as any)
    it("should process tweets", async () => {
        const input = { tweetId: "123", twitterUserId: "u123", screenName: "" }
        await processor.process(input)
        expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId)
        const expectedCopy = "In this organisation, women's median hourly pay is 52.2% lower than men's."
        expect(mockTwitterClient.quoteTweet).toBeCalledWith(expectedCopy, "name", "123")
    })
})