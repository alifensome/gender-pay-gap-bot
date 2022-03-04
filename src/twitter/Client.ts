import Twit from "twit"
import { Logger } from "tslog";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { debugPrint } from "../utils/debug";

export class TwitterClient {
    twitPackage: Twit;
    logger: Logger

    constructor() {
        this.twitPackage = new Twit({
            consumer_key: process.env.TWITTER_API_KEY,
            consumer_secret: process.env.TWITTER_API_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });
        this.logger = new Logger({ name: TwitterClient.name });
    }

    async startStreamingTweets(following: string[], handleTweet: (input: HandleIncomingTweetInput) => Promise<void>): Promise<void> {
        const stream = this.twitPackage.stream('statuses/filter', { follow: following });
        this.logger.info(JSON.stringify({ message: "streaming started", eventType: "streamingStarted" }))

        stream.on('tweet', async (tweet) => {
            try {
                const twitterUserId = tweet.user.id_str
                const user = tweet.user
                const screenName = tweet.user.screen_name
                const isRetweet = tweet.text.startsWith("RT")
                const text = tweet.text
                const timeStamp = new Date().toISOString()

                debugPrint({
                    message: "tweet detected",
                    eventType: "tweetReceived",
                    twitterName: tweet.user.name,
                    twitterUserId,
                    screenName,
                    isRetweet,
                    text,
                    timeStamp,
                })

                await handleTweet({
                    twitterUserId,
                    tweetId: tweet.id_str,
                    user,
                    screenName,
                    isRetweet,
                    text,
                    timeStamp,
                    fullTweetObject: tweet
                })


            } catch (err) {
                this.logger.error(JSON.stringify({
                    message: "Error while handling incoming tweeting",
                    eventType: "errorHandlingTweet",
                    errMessage: err.message,
                    tweet,
                }))
            }
        });
    }

    quoteTweet(status, screenName: string, // tweet.user.screen_name
        tweetId: string // tweet.id_str
    ) {
        return new Promise((resolve, reject) => {
            const attachmentUrl = `https://twitter.com/${screenName}/status/${tweetId}`
            const body = { status, attachment_url: attachmentUrl, auto_populate_reply_metadata: true }
            this.twitPackage.post('statuses/update', body, (err) => {
                if (err) { return reject(err) }
                return resolve({ status: 'Tweet sent' })
            })
        })
    }

    postTweet(tweet) {
        return new Promise((resolve, reject) => {
            this.twitPackage.post('statuses/update', { status: tweet }, (err) => {
                if (err) { return reject(err) }
                return resolve({ status: 'Tweet sent' })
            })
        })
    }

    reTweet(tweetId, tweet, quotedStatus) {
        return new Promise((resolve, reject) => {
            this.twitPackage.post('statuses/retweet/' + tweetId, { status: tweet, quoted_status: quotedStatus }, (err) => {
                if (err) { return reject(err) }
                return resolve({ status: 'Tweet sent' })
            })
        })
    }
}