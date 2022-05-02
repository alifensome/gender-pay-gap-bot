import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { Logger } from "tslog";
import DynamoDbClient from "../dynamodb/Client";
import { CompanyDataItem } from "../importData";
import { Repository } from "../importData/Repository";
import { LambdaClient } from "../lambdaClient/LambdaClient";
import { gpgToData } from "../plotGraph/gpgToData";
import { TwitterClient } from "../twitter/Client";
import { companySizeCategoryToMinSize } from "../utils/companySizeUtils";

export class TweetAllGpgTask {
    twitterClient: TwitterClient;
    logger: Logger;
    repository: Repository;
    dynamoDbClient: DynamoDbClient
    minGPG: number | null;
    isTest: boolean;
    now: string;
    lambdaClient: LambdaClient;

    constructor(twitterClient: TwitterClient, repo: Repository, isTest, dynamoDbClient: DynamoDbClient, lambdaClient: LambdaClient) {
        this.twitterClient = twitterClient
        this.logger = new Logger({ name: "TweetAllGpgTask" })
        this.repository = repo
        this.isTest = isTest
        this.dynamoDbClient = dynamoDbClient
        this.now = new Date().toISOString()
        this.lambdaClient = lambdaClient
    }

    async getDynamoDbLastItem(): Promise<DynamoDbLastItem> {
        const result = await this.dynamoDbClient.getItem({ id: "lastCompanyTweet", pk: "lastCompanyTweet" })
        return result as DynamoDbLastItem | null
    }

    async updateDynamoDbLastItem({ companyName, companyNumber }): Promise<PutItemCommandOutput> {
        const result = await this.dynamoDbClient.putItem({ id: "lastCompanyTweet", pk: "lastCompanyTweet", data: { companyName, companyNumber } })
        return result
    }

    async getErrorLogs(): Promise<any[]> {
        return await this.dynamoDbClient.query({ KeyConditionExpression: "pk = :pk AND begins_with ( id, :id ) ", ExpressionAttributeValues: { ":pk": { S: "lastCompanyTweet_error" }, ":id": { S: "lastCompanyTweet_error_" } } }) as any[]
    }

    async putErrorLogs({ companyName, companyNumber, error }): Promise<PutItemCommandOutput> {
        const result = await this.dynamoDbClient.putItem({ id: `lastCompanyTweet_error_${this.now}`, pk: "lastCompanyTweet_error", data: { companyName, companyNumber, error } })
        return result
    }

    async sendNextTweet() {
        const errorLogs = await this.getErrorLogs()
        this.logger.info(JSON.stringify({ message: `number of errorLogs: ${errorLogs.length}`, numberOfErrorLogs: errorLogs.length }))

        if (errorLogs.length > 10) {
            this.logger.info(JSON.stringify({ message: "Too many errors", eventType: "tooManyErrors" }))
            return { ok: false, errorLogs }
        }
        let nextCompany = null
        let lastCompanyTweet = null
        let lastCompanyName = null
        let lastCompanyNumber = null
        try {
            lastCompanyTweet = await this.getDynamoDbLastItem()
            lastCompanyName = lastCompanyTweet?.data?.companyName
            lastCompanyNumber = lastCompanyTweet?.data?.companyNumber
            nextCompany = this.findNextCompanyOrFirst(lastCompanyName, lastCompanyNumber)
            if (!nextCompany) {
                this.logger.info(JSON.stringify({ message: "done", eventType: "finishedJob" }))
                return { isFinished: true }
            }
            const tweetCopy = this.getCopy(nextCompany)
            const graphData = gpgToData(nextCompany)
            const imageBase64 = await this.lambdaClient.triggerPlot5YearGraph(graphData)
            await this.twitterClient.tweetWithFile(imageBase64, nextCompany.companyName, tweetCopy)
            await this.updateDynamoDbLastItem({ companyName: nextCompany.companyName, companyNumber: nextCompany.companyNumber })
            this.logger.info(JSON.stringify({ message: "successful post from task.", eventType: "successfulPost", companyName: nextCompany.companyName, companyNumber: nextCompany.companyNumber }))
        } catch (error) {
            this.logger.error(JSON.stringify({ message: "error tweeting", eventType: "errorTweeting", nextCompany, lastCompanyTweet }))
            await this.putErrorLogs({
                companyName: lastCompanyName,
                companyNumber: lastCompanyNumber, error: error.message
            }).catch()
            throw error
        }
    }

    findNextCompanyOrFirst(companyName, companyNumber): CompanyDataItem {
        if (companyName) {
            return this.repository.getNextMatchingCompanyWithData(companyName, companyNumber, this.matchLargeCompany)
        } else {
            this.repository.checkSetData()
            return this.repository.companiesGpgData[0]
        }
    }

    getCopy(companyData: CompanyDataItem): string {
        if (companyData.medianGpg_2021_2022 === null || companyData.medianGpg_2020_2021 === null) {
            throw new Error("no median data for required year! This should not have happened!")
        }

        const difference = companyData.medianGpg_2021_2022 - companyData.medianGpg_2020_2021
        const roundedDifference = Number((difference).toFixed(1));

        const isPositiveGpg = companyData.medianGpg_2021_2022 >= 0.0
        const differenceCopy = this.getDifferenceCopy(roundedDifference, isPositiveGpg)
        if (companyData.medianGpg_2021_2022 === 0.0) {
            return `At ${companyData.companyName}, men's and women's median hourly pay is equal, ${differenceCopy}`
        }
        if (isPositiveGpg) {
            return `At ${companyData.companyName}, women's median hourly pay is ${companyData.medianGpg_2021_2022}% lower than men's, ${differenceCopy}`
        } else {
            return `At ${companyData.companyName}, women's median hourly pay is ${-1 * companyData.medianGpg_2021_2022}% higher than men's, ${differenceCopy}`
        }
    }

    getDifferenceCopy(difference: number, isPositiveGpg: boolean): string {
        if (difference > 0.0) {
            return `an increase of ${difference} percentage points since the previous year`
        } else if (difference < 0.0) {
            return `${isPositiveGpg ? "a decrease" : "an increase"} of ${-1 * difference} percentage points since the previous year`
        } else if (difference === 0.0) {
            return `this is the same as the previous year`
        }
    }

    matchLargeCompany(company: CompanyDataItem): boolean {
        if (companySizeCategoryToMinSize(company.size) < 5000) {
            return false
        }
        if (company && company.medianGpg_2021_2022 !== null && company.medianGpg_2020_2021 !== null) {
            return true
        }
        return false
    }
}

export interface DynamoDbLastItem {
    id: string
    pk: string
    data: {
        companyName: string,
        companyNumber: string | null
    }
}