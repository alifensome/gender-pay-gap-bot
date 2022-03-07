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
    describe("getCopy", () => {
        it("should say the median pays are equal", () => {
            const copy = processor.getCopy({ medianGpg_2021_2022: 0, medianGpg_2017_2018: 10 } as any)
            const expectedCopy = "In this organisation, men's and women's median hourly pay is equal."
            expect(copy).toBe(expectedCopy)
        })
        it("should say the men's salary is higher", () => {
            const copy = processor.getCopy({ medianGpg_2021_2022: 12.4, medianGpg_2017_2018: 10 } as any)
            const expectedCopy = "In this organisation, women's median hourly pay is 12.4% lower than men's."
            expect(copy).toBe(expectedCopy)
        })
        it("should say the women's salary is higher", () => {
            const copy = processor.getCopy({ medianGpg_2021_2022: -12.4, medianGpg_2017_2018: 10 } as any)
            const expectedCopy = "In this organisation, women's median hourly pay is 12.4% higher than men's."
            expect(copy).toBe(expectedCopy)
        })
    })
})