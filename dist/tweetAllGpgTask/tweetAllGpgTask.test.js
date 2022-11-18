"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const mockData_1 = require("../unitTestHelpers/mockData");
const tweetAllGpgTask_1 = require("./tweetAllGpgTask");
describe("TweetAllGpgTask", () => {
    const mockTwitterClient = {
        postTweet: jest.fn(),
        tweetWithFile: jest.fn(),
    };
    const mockRepo = {
        getNextMatchingCompanyWithData: jest
            .fn()
            .mockReturnValue(mockData_1.mockCompanyDataItem),
    };
    const mockDynamoDbClient = {
        getItem: jest.fn().mockResolvedValue({
            data: {
                companyName: "Company Name Ltd 1",
                companyNumber: "123",
                size: types_1.CompanySize.From5000To19999,
            },
        }),
        putItem: jest.fn(),
        dynamoDB: jest.fn(),
        query: jest.fn().mockResolvedValue([]),
        unmarshallList: jest.fn(),
        tableName: "tableName",
    };
    const mockLambdaClient = {
        triggerPlot5YearGraph: jest.fn().mockResolvedValue("base64String"),
    };
    const processor = new tweetAllGpgTask_1.TweetAllGpgTask(mockTwitterClient, mockRepo, false, mockDynamoDbClient, mockLambdaClient);
    processor.logger = { info: jest.fn() };
    describe("sendNextTweet", () => {
        it("should send the next tweet", () => __awaiter(void 0, void 0, void 0, function* () {
            yield processor.sendNextTweet();
            expect(mockRepo.getNextMatchingCompanyWithData).toBeCalledWith("Company Name Ltd 1", "123", expect.any(Function));
            const expectedCopy = "At Company Name Ltd 2, women's median hourly pay is 52.1% lower than men's, an increase of 10 percentage points since the previous year";
            expect(mockTwitterClient.tweetWithFile).toBeCalledWith("base64String", "Company Name Ltd 2", expectedCopy);
            expect(mockLambdaClient.triggerPlot5YearGraph).toBeCalledWith(mockData_1.mockGraphData);
            expect(mockDynamoDbClient.getItem).toBeCalledWith({
                id: "lastCompanyTweet",
                pk: "lastCompanyTweet",
            });
            expect(mockDynamoDbClient.putItem).toBeCalledWith({
                id: "lastCompanyTweet",
                pk: "lastCompanyTweet",
                data: {
                    companyName: "Company Name Ltd 2",
                    companyNumber: "321",
                },
            });
        }));
    });
    describe("getCopy", () => {
        it("should say the median pays are equal", () => {
            const copy = processor.getCopy({
                data2021To2022: { medianGpg: 0 },
                data2020To2021: { medianGpg: 10 },
                companyName: "Company Name LTD",
            });
            const expectedCopy = "At Company Name LTD, men's and women's median hourly pay is equal, a decrease of 10 percentage points since the previous year";
            expect(copy).toBe(expectedCopy);
        });
        it("should say mens pay is higher", () => {
            const copy = processor.getCopy({
                data2021To2022: { medianGpg: 20 },
                data2020To2021: { medianGpg: 10 },
                companyName: "Company Name LTD",
            });
            const expectedCopy = "At Company Name LTD, women's median hourly pay is 20% lower than men's, an increase of 10 percentage points since the previous year";
            expect(copy).toBe(expectedCopy);
        });
        it("should women's pay is higher", () => {
            const copy = processor.getCopy({
                data2021To2022: { medianGpg: -20 },
                data2020To2021: { medianGpg: -10 },
                companyName: "Company Name LTD",
            });
            const expectedCopy = "At Company Name LTD, women's median hourly pay is 20% higher than men's, an increase of 10 percentage points since the previous year";
            expect(copy).toBe(expectedCopy);
        });
    });
    describe("matchLargeCompany", () => {
        it("should return true for companies over the size of 5000 with a gender paygap for at least two years", () => {
            const result = processor.matchLargeCompany({
                data2021To2022: { medianGpg: 0 },
                data2020To2021: { medianGpg: 10 },
                companyName: "Company Name LTD",
                size: types_1.CompanySize.From5000To19999,
            });
            expect(result).toBe(true);
        });
        it("should return false for companies under the size of 5000", () => {
            const result = processor.matchLargeCompany({
                data2021To2022: { medianGpg: 0 },
                data2020To2021: { medianGpg: 10 },
                companyName: "Company Name LTD",
                size: types_1.CompanySize.From1000To4999,
            });
            expect(result).toBe(false);
        });
        it("should return false for companies over the size of 5000 but without gender paygap for at least two years", () => {
            const result = processor.matchLargeCompany({
                data2021To2022: { medianGpg: 0 },
                data2020To2021: { medianGpg: null },
                companyName: "Company Name LTD",
                size: types_1.CompanySize.From5000To19999,
            });
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=tweetAllGpgTask.test.js.map