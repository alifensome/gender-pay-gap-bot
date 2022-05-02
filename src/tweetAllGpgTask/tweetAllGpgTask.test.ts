import { CompanySize } from "../importData"
import { mockCompanyDataItem, mockGraphData } from "../unitTestHelpers/mockData"
import { TweetAllGpgTask } from "./tweetAllGpgTask"

describe("TweetAllGpgTask", () => {
    const mockTwitterClient = {
        postTweet: jest.fn(),
        tweetWithFile: jest.fn()
    }
    const mockRepo = {
        getNextMatchingCompanyWithData: jest.fn().mockReturnValue(mockCompanyDataItem)
    }
    const mockDynamoDbClient = {
        getItem: jest.fn().mockResolvedValue({ data: { companyName: "Company Name Ltd 1", companyNumber: "123", size: CompanySize.From5000To19999 } }),
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
            expect(mockRepo.getNextMatchingCompanyWithData).toBeCalledWith("Company Name Ltd 1", "123", expect.any(Function))
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
            const expectedCopy = "At Company Name LTD, women's median hourly pay is 20% higher than men's, an increase of 10 percentage points since the previous year"
            expect(copy).toBe(expectedCopy)
        })
    })

    describe("matchLargeCompany", () => {
        it("should return true for companies over the size of 5000 with a gender paygap for at least two years", () => {
            const result = processor.matchLargeCompany({ medianGpg_2021_2022: 0, medianGpg_2020_2021: 10, companyName: "Company Name LTD", size: CompanySize.From5000To19999 } as any)
            expect(result).toBe(true)
        })
        it("should return false for companies under the size of 5000", () => {
            const result = processor.matchLargeCompany({ medianGpg_2021_2022: 0, medianGpg_2020_2021: 10, companyName: "Company Name LTD", size: CompanySize.From1000To4999 } as any)
            expect(result).toBe(false)
        })
        it("should return false for companies over the size of 5000 but without gender paygap for at least two years", () => {
            const result = processor.matchLargeCompany({ medianGpg_2021_2022: 0, medianGpg_2020_2021: null, companyName: "Company Name LTD", size: CompanySize.From5000To19999 } as any)
            expect(result).toBe(false)
        })
    })
})