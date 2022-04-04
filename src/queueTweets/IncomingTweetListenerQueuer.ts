import { TwitterClient } from "../twitter/Client";
import { Logger } from "tslog";
import { SqsClient } from "../sqs/Client";
import DataImporter, { TwitterData } from "../importData";
import { debugPrint } from "../utils/debug";
import { Repository } from "../importData/Repository";
import { replaceMultiple } from "../utils/replace";


export class IncomingTweetListenerQueuer {
    twitterClient: TwitterClient
    sqsClient: SqsClient
    logger: Logger;
    dataImporter: DataImporter
    repository: Repository
    constructor(twitterClient, sqsClient, dataImporter, repository, logger) {
        this.twitterClient = twitterClient
        this.sqsClient = sqsClient
        this.dataImporter = dataImporter
        this.repository = repository
        this.logger = logger
    }

    listen(isTest?: boolean) {
        const twitterData = this.dataImporter.twitterUserDataProd()
        if (isTest) {
            this.logger.info(JSON.stringify({ message: "running in debug mode!" }))
            twitterData.push(this.dataImporter.twitterUserDataTest()[0])
        }
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
            this.logger.error(JSON.stringify({ message: "too many twitter IDs to watch!" }))
        }
        return twitterIds
    }

    async handleIncomingTweet(input: HandleIncomingTweetInput) {

        if (input.isRetweet) {
            this.logger.info(JSON.stringify({ message: "Ignoring retweet", eventType: "ignoringRetweet" }))
            return
        }

        // Check tweet contains words
        const isRelevantTweet = this.checkTweetContainsWord(input.fullTweetObject.text)
        if (!isRelevantTweet) {
            debugPrint("irrelevant tweet")
            return
        }

        const data = this.repository.getGpgForTwitterId(input.twitterUserId)
        if (!data || !data.companyData) {
            this.logger.info(JSON.stringify({ message: "could not find twitter user, ignoring.", twitterUserId: input.twitterUserId, screenName: input.screenName, eventType: "couldNotGetUserIgnoring" }))
            return
        }
        // Queue the message
        await this.sqsClient.queueMessage(input)
        this.logger.info(JSON.stringify({ "message": `successfully queued tweet: ${input.tweetId}, userId: ${input.twitterUserId}`, eventType: "successfulQueue", screenName: input.screenName }))
    }

    checkTweetContainsWord(tweet: string): boolean {
        const replacements = [{ find: "'", replace: "" }, { find: "’", replace: "" }]
        const upperCaseTweet = replaceMultiple(tweet.toUpperCase(), replacements)
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
    "IWD2023",
    "IWD2022",
    "#IWD2022",
    "#IWD23",
    "#IWD22",
    "#IWD",
    "INTERNATIONALWOMENSDAY",
    "#INTERNATIONALWOMENSDAY",
    "#CHOOSETOCHALLENGE",
    "INTERNATIONAL WOMENS DAY",
    "INTERNATIONAL WOMENS MONTH",
    "WOMENSDAY",
    "WOMENS DAY",
    "BREAKTHEBIAS",
    "WOMENS HISTORY MONTH",
    "WOMANS HISTORY MONTH",
    "WOMENS MONTH",
    "WOMANS MONTH",
    "WOMENS WEEK",
    "GENDER PAY GAP",
    "GIRL BOSS",
    "GIRLBOSS",
    "EQUALITY"
]


