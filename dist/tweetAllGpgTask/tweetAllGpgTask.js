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
exports.TweetAllGpgTask = void 0;
const tslog_1 = require("tslog");
const gpgToData_1 = require("../plotGraph/gpgToData");
const companySizeUtils_1 = require("../utils/companySizeUtils");
class TweetAllGpgTask {
    constructor(twitterClient, repo, isTest, dynamoDbClient, lambdaClient) {
        this.twitterClient = twitterClient;
        this.logger = new tslog_1.Logger({ name: "TweetAllGpgTask" });
        this.repository = repo;
        this.isTest = isTest;
        this.dynamoDbClient = dynamoDbClient;
        this.now = new Date().toISOString();
        this.lambdaClient = lambdaClient;
    }
    getDynamoDbLastItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dynamoDbClient.getItem({
                id: "lastCompanyTweet",
                pk: "lastCompanyTweet",
            });
            return result;
        });
    }
    updateDynamoDbLastItem({ companyName, companyNumber, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dynamoDbClient.putItem({
                id: "lastCompanyTweet",
                pk: "lastCompanyTweet",
                data: { companyName, companyNumber },
            });
            return result;
        });
    }
    getErrorLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.dynamoDbClient.query({
                KeyConditionExpression: "pk = :pk AND begins_with ( id, :id ) ",
                ExpressionAttributeValues: {
                    ":pk": { S: "lastCompanyTweet_error" },
                    ":id": { S: "lastCompanyTweet_error_" },
                },
            }));
        });
    }
    putErrorLogs({ companyName, companyNumber, error, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dynamoDbClient.putItem({
                id: `lastCompanyTweet_error_${this.now}`,
                pk: "lastCompanyTweet_error",
                data: { companyName, companyNumber, error },
            });
            return result;
        });
    }
    sendNextTweet() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const errorLogs = yield this.getErrorLogs();
            this.logger.info(JSON.stringify({
                message: `number of errorLogs: ${errorLogs.length}`,
                numberOfErrorLogs: errorLogs.length,
            }));
            if (errorLogs.length > 10) {
                this.logger.info(JSON.stringify({
                    message: "Too many errors",
                    eventType: "tooManyErrors",
                }));
                return { ok: false, errorLogs };
            }
            let nextCompany = null;
            let lastCompanyTweet = null;
            let lastCompanyName = null;
            let lastCompanyNumber = null;
            try {
                lastCompanyTweet = yield this.getDynamoDbLastItem();
                lastCompanyName = (_a = lastCompanyTweet === null || lastCompanyTweet === void 0 ? void 0 : lastCompanyTweet.data) === null || _a === void 0 ? void 0 : _a.companyName;
                lastCompanyNumber = (_b = lastCompanyTweet === null || lastCompanyTweet === void 0 ? void 0 : lastCompanyTweet.data) === null || _b === void 0 ? void 0 : _b.companyNumber;
                nextCompany = this.findNextCompanyOrFirst(lastCompanyName, lastCompanyNumber);
                if (!nextCompany) {
                    this.logger.info(JSON.stringify({ message: "done", eventType: "finishedJob" }));
                    return { isFinished: true };
                }
                const tweetCopy = this.getCopy(nextCompany);
                const graphData = (0, gpgToData_1.gpgToData)(nextCompany);
                const imageBase64 = yield this.lambdaClient.triggerPlot5YearGraph(graphData);
                yield this.twitterClient.tweetWithFile(imageBase64, nextCompany.companyName, tweetCopy);
                yield this.updateDynamoDbLastItem({
                    companyName: nextCompany.companyName,
                    companyNumber: nextCompany.companyNumber,
                });
                this.logger.info(JSON.stringify({
                    message: "successful post from task.",
                    eventType: "successfulPost",
                    companyName: nextCompany.companyName,
                    companyNumber: nextCompany.companyNumber,
                }));
            }
            catch (error) {
                this.logger.error(JSON.stringify({
                    message: "error tweeting",
                    eventType: "errorTweeting",
                    nextCompany,
                    lastCompanyTweet,
                }));
                yield this.putErrorLogs({
                    companyName: lastCompanyName,
                    companyNumber: lastCompanyNumber,
                    error: error.message,
                }).catch();
                throw error;
            }
        });
    }
    findNextCompanyOrFirst(companyName, companyNumber) {
        if (companyName) {
            return this.repository.getNextMatchingCompanyWithData(companyName, companyNumber, this.matchLargeCompany);
        }
        else {
            this.repository.checkSetData();
            return this.repository.companiesGpgData[0];
        }
    }
    getCopy(companyData) {
        if (companyData.data2021To2022.medianGpg === null ||
            companyData.data2020To2021.medianGpg === null) {
            throw new Error("no median data for required year! This should not have happened!");
        }
        const difference = companyData.data2021To2022.medianGpg -
            companyData.data2020To2021.medianGpg;
        const roundedDifference = Number(difference.toFixed(1));
        const isPositiveGpg = companyData.data2021To2022.medianGpg >= 0.0;
        const differenceCopy = this.getDifferenceCopy(roundedDifference, isPositiveGpg);
        if (companyData.data2021To2022.medianGpg === 0.0) {
            return `At ${companyData.companyName}, men's and women's median hourly pay is equal, ${differenceCopy}`;
        }
        if (isPositiveGpg) {
            return `At ${companyData.companyName}, women's median hourly pay is ${companyData.data2021To2022.medianGpg}% lower than men's, ${differenceCopy}`;
        }
        else {
            return `At ${companyData.companyName}, women's median hourly pay is ${-1 * companyData.data2021To2022.medianGpg}% higher than men's, ${differenceCopy}`;
        }
    }
    getDifferenceCopy(difference, isPositiveGpg) {
        if (difference > 0.0) {
            return `an increase of ${difference} percentage points since the previous year`;
        }
        else if (difference < 0.0) {
            return `${isPositiveGpg ? "a decrease" : "an increase"} of ${-1 * difference} percentage points since the previous year`;
        }
        else if (difference === 0.0) {
            return `this is the same as the previous year`;
        }
    }
    matchLargeCompany(company) {
        if ((0, companySizeUtils_1.companySizeCategoryToMinSize)(company.size) < 5000) {
            return false;
        }
        if (company &&
            company.data2021To2022.medianGpg !== null &&
            company.data2020To2021.medianGpg !== null) {
            return true;
        }
        return false;
    }
}
exports.TweetAllGpgTask = TweetAllGpgTask;
//# sourceMappingURL=tweetAllGpgTask.js.map