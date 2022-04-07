import { mockCompanyDataItem, mockGraphData } from "../unitTestHelpers/mockData"
import { TweetAllGpgTask } from "./tweetAllGpgTask"

describe("TweetAllGpgTask", () => {
    const mockTwitterClient = {
        postTweet: jest.fn(),
        tweetWithFile: jest.fn()
    }
    const mockRepo = {
        getNextCompanyWithData: jest.fn().mockReturnValue(mockCompanyDataItem)
    }
    const mockDynamoDbClient = {
        getItem: jest.fn().mockResolvedValue({ data: { companyName: "Company Name Ltd 1", companyNumber: "123" } }),
        putItem: jest.fn(),
        dynamoDB: jest.fn() as any,
        query: jest.fn().mockResolvedValue([]),
        unmarshallList: jest.fn(),
        tableName: "tableName"
    }
    const mockLambdaClient = {
        triggerPlot5YearGraph: jest.fn().mockResolvedValue("base64String")
    }
    const processor = new TweetAllGpgTask(mockTwitterClient as any, mockRepo as any, false, mockDynamoDbClient, mockLambdaClient as any)
    processor.logger = { info: jest.fn() } as any
    describe("sendNextTweet", () => {
        it("should send the next tweet", async () => {
            await processor.sendNextTweet()
            expect(mockRepo.getNextCompanyWithData).toBeCalledWith("Company Name Ltd 1", "123")
            const expectedCopy = "At Company Name Ltd 2, women's median hourly pay is 52.1% lower than men's, an increase of 10 percentage points since the previous year"
            expect(mockTwitterClient.tweetWithFile).toBeCalledWith("base64String", "Company Name Ltd 2", expectedCopy)
            expect(mockLambdaClient.triggerPlot5YearGraph).toBeCalledWith(mockGraphData)
            expect(mockDynamoDbClient.getItem).toBeCalledWith({ "id": "lastCompanyTweet", "pk": "lastCompanyTweet" })
            expect(mockDynamoDbClient.putItem).toBeCalledWith({
                id: "lastCompanyTweet",
                pk: "lastCompanyTweet",
                data: {
                    companyName: "Company Name Ltd 2",
                    companyNumber: "321"
                }
            })
        })
    })
    describe("getCopy", () => {
        it("should say the median pays are equal", () => {
            const copy = processor.getCopy({ medianGpg_2021_2022: 0, medianGpg_2020_2021: 10, companyName: "Company Name LTD" } as any)
            const expectedCopy = "At Company Name LTD, men's and women's median hourly pay is equal, a decrease of 10 percentage points since the previous year"
            expect(copy).toBe(expectedCopy)
        })
        it("should say mens pay is higher", () => {
            const copy = processor.getCopy({ medianGpg_2021_2022: 20, medianGpg_2020_2021: 10, companyName: "Company Name LTD" } as any)
            const expectedCopy = "At Company Name LTD, women's median hourly pay is 20% lower than men's, an increase of 10 percentage points since the previous year"
            expect(copy).toBe(expectedCopy)
        })
        it("should women's pay is higher", () => {
            const copy = processor.getCopy({ medianGpg_2021_2022: -20, medianGpg_2020_2021: -10, companyName: "Company Name LTD" } as any)
            const expectedCopy = "At Company Name LTD, women's median hourly pay is 20% higher than men's, a decrease of 10 percentage points since the previous year"
            expect(copy).toBe(expectedCopy)
        })
    })
})