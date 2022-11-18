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
const SqsTweetProcessor_1 = require("./SqsTweetProcessor");
describe("SqsTweetProcessor", () => {
    const mockTwitterClient = {
        quoteTweet: jest.fn(),
    };
    const mockRepo = {
        getGpgForTwitterId: jest.fn().mockReturnValue({
            companyData: {
                data2021To2022: { medianGpg: 52.2 },
                companyNumber: "321",
            },
            twitterData: { twitter_screen_name: "name" },
        }),
    };
    const processor = new SqsTweetProcessor_1.SqsTweetProcessor(mockTwitterClient, mockRepo, null);
    processor.logger = { info: jest.fn(), error: jest.fn() };
    describe("process", () => {
        it("should process tweets", () => __awaiter(void 0, void 0, void 0, function* () {
            const input = { tweetId: "123", twitterUserId: "u123", screenName: "" };
            yield processor.process(input);
            expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId);
            const expectedCopy = "In this organisation, women's median hourly pay is 52.2% lower than men's.";
            expect(mockTwitterClient.quoteTweet).toBeCalledWith(expectedCopy, "name", "123");
        }));
        it("should process throw error when GPG < min gpg ", () => __awaiter(void 0, void 0, void 0, function* () {
            const processorWithMinGpg = new SqsTweetProcessor_1.SqsTweetProcessor(mockTwitterClient, mockRepo, 52.3);
            processorWithMinGpg.logger = { info: jest.fn(), error: jest.fn() };
            const input = { tweetId: "123", twitterUserId: "u123", screenName: "" };
            expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield processorWithMinGpg.process(input); })).rejects.toThrowError("");
            expect(mockRepo.getGpgForTwitterId).toBeCalledWith(input.twitterUserId);
            const expectedCopy = "In this organisation, women's median hourly pay is 52.2% lower than men's.";
            expect(mockTwitterClient.quoteTweet).toBeCalledWith(expectedCopy, "name", "123");
            expect(processorWithMinGpg.logger.error).toBeCalled();
        }));
    });
    describe("getCopy", () => {
        it("should say the median pays are equal", () => {
            const copy = processor.getCopy({
                data2021To2022: { medianGpg: 0 },
                data2017To2018: { medianGpg: 10 },
            });
            const expectedCopy = "In this organisation, men's and women's median hourly pay is equal.";
            expect(copy).toBe(expectedCopy);
        });
        it("should say the men's salary is higher", () => {
            const copy = processor.getCopy({
                data2021To2022: { medianGpg: 12.4 },
                data2017To2018: { medianGpg: 10 },
            });
            const expectedCopy = "In this organisation, women's median hourly pay is 12.4% lower than men's.";
            expect(copy).toBe(expectedCopy);
        });
        it("should say the women's salary is higher", () => {
            const copy = processor.getCopy({
                data2021To2022: { medianGpg: -12.4 },
                data2017To2018: { medianGpg: 10 },
            });
            const expectedCopy = "In this organisation, women's median hourly pay is 12.4% higher than men's.";
            expect(copy).toBe(expectedCopy);
        });
    });
});
//# sourceMappingURL=SqsTweetProcessor.test.js.map