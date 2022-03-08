import { Logger } from "tslog";
import { CompanyDataItem } from "../importData";
import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { getMostRecentMedianGPG } from "../utils/getMostRecentGPG";

export class SqsTweetProcessor {
    twitterClient: TwitterClient;
    logger: Logger;
    repository: Repository;
    minGPG: number | null;

    constructor(twitterClient: TwitterClient, repo: Repository, minGPG: number | null) {
        this.twitterClient = twitterClient
        this.logger = new Logger({ name: "SqsTweetProcessor" })
        this.repository = repo
        this.minGPG = minGPG
    }

    async process({ twitterUserId, tweetId, screenName }) {
        try {
            this.logger.info(JSON.stringify({ message: "processing sqs record", eventType: "processingRecord", twitterUserId, tweetId, screenName }))
            const data = this.repository.getGpgForTwitterId(twitterUserId)
            if (!data || !data.companyData) {
                this.logger.error(JSON.stringify({ message: "error finding company", eventType: "errorGettingCompany", tweetId, twitterUserId, errorSendingTweet: 1, screenName }))
                throw new Error(`could not find company. TwitterUserId: ${twitterUserId}, ${screenName}`)
            }

            const mostRecentGPG = getMostRecentMedianGPG(data.companyData)
            if (this.minGPG !== null && mostRecentGPG < this.minGPG) {
                this.logger.info(JSON.stringify({ message: "skipped", eventType: "skipTweet", tweetId, twitterUserId, screenName, companyName: data.companyData.companyName, tempSkip: 1 }))
                throw new Error("SKIP for now.")
            }

            const copy = this.getCopy(data.companyData)
            await this.twitterClient.quoteTweet(copy, data.twitterData.twitter_screen_name, tweetId)
            this.logger.info(JSON.stringify({ message: "sent tweet", eventType: "sentTweet", tweetId, twitterUserId, screenName, companyName: data.companyData.companyName, successfullySentTweet: 1 }))
        } catch (error) {
            this.logger.error(JSON.stringify({ message: "error sending tweet", eventType: "errorSendingTweet", tweetId, twitterUserId, errorSendingTweet: 1, screenName }))
            throw error
        }
    }

    getCopy(companyData: CompanyDataItem): string {
        const mostRecentGPG = getMostRecentMedianGPG(companyData)
        let mostRecent = 0
        if (typeof mostRecentGPG === "string") {
            mostRecent = parseFloat(mostRecentGPG)
        } else {
            mostRecent = mostRecentGPG
        }
        const isPositiveGpg = mostRecent > 0.0
        if (mostRecent === 0.0) {
            return `In this organisation, men's and women's median hourly pay is equal.`
        }
        if (isPositiveGpg) {
            return `In this organisation, women's median hourly pay is ${mostRecent}% lower than men's.`
        } else {
            return `In this organisation, women's median hourly pay is ${-1 * mostRecent}% higher than men's.`
        }
    }
}