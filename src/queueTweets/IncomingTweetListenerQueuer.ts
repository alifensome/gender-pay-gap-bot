import { TwitterClient } from "../twitter/Client";
import { Logger } from "tslog";
import { SqsClient } from "../sqs/Client";
import DataImporter, { TwitterData } from "../importData";
import { debugPrint } from "../utils/debugPrint";


export class IncomingTweetListenerQueuer {

    twitterClient: TwitterClient
    sqsClient: SqsClient
    logger: Logger;
    dataImporter: DataImporter
    constructor(twitterClient, sqsClient, dataImporter, logger) {
        this.twitterClient = twitterClient
        this.sqsClient = sqsClient
        this.dataImporter = dataImporter
        this.logger = logger
    }

    listen(isTest?: boolean) {
        if (isTest) {
            this.logger.info({ message: "running in debug mode!" })
        }
        const twitterData = isTest ? this.dataImporter.twitterUserDataTest() : this.dataImporter.twitterUserDataProd()
        const followers = this.getFollowsFromData(twitterData)
        return this.twitterClient.startStreamingTweets(followers, (input) => this.handleIncomingTweet(input))
    }

    getFollowsFromData(companies: TwitterData[]) {
        const twitterIds = []
        for (let index = 0; index < companies.length; index++) {
            const c = companies[index]
            twitterIds.push(c.twitter_id_str)
        }
        if (twitterIds.length === 0) {
            throw new Error("No twitter Ids!")
        }
        if (twitterIds.length > 4000) {
            this.logger.error({ message: "too many twitter IDs to watch!" })
        }
        return twitterIds
    }

    async handleIncomingTweet(input: HandleIncomingTweetInput) {

        if (input.isRetweet) {
            this.logger.info({ message: "Ignoring retweet", eventType: "ignoringRetweet" })
            return
        }

        // Check tweet contains words
        const isRelevantTweet = this.checkTweetContainsWord(input.fullTweetObject.text)
        if (!isRelevantTweet) {
            debugPrint("irrelevant tweet")
            return
        }

        // Queue the message
        await this.sqsClient.queueMessage(input)
        this.logger.info({ "message": `successfully queued tweet: ${input.tweetId}, userId: ${input.twitterUserId}`, eventType: "successfulQueue", screenName: input.screenName })
    }

    checkTweetContainsWord(tweet): boolean {
        const upperCaseTweet = tweet.toUpperCase()
        for (let index = 0; index < relevantWords.length; index++) {
            const word = relevantWords[index];
            if (upperCaseTweet.includes(word)) {
                return true
            }
        }
        return false
    }

}

export interface HandleIncomingTweetInput {
    twitterUserId: string;
    tweetId: string;
    user: string;
    screenName: string;
    isRetweet: boolean;
    text: string;
    timeStamp: string;
    fullTweetObject: any;
}


export const relevantWords = [
    "IWD2022",
    "#IWD2022",
    "#IWD22",
    "#IWD",
    "INTERNATIONALWOMENSDAY",
    "#INTERNATIONALWOMENSDAY",
    "#CHOOSETOCHALLENGE",
    "INTERNATIONAL WOMENS DAY",
    "INTERNATIONAL WOMEN'S DAY",
    "INTERNATIONAL WOMEN’S DAY",
    "WOMENS DAY",
    "WOMENSDAY",
    "WOMEN'S DAY",
    "WOMEN’S DAY"
]


