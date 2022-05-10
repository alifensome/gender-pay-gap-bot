import Twit from "twit"
import { Logger } from "tslog";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { debugPrint } from "../utils/debug";
import { TwitterClient as TwitterApiClient } from 'twitter-api-client';
import { TwitterCredentialGetter } from "./TwitterCredentialGetter";

export class TwitterClient {
    twitPackage: Twit;
    logger: Logger
    twitterApiClient: TwitterApiClient;

    constructor(isTest = false) {
        const credentials = new TwitterCredentialGetter().getCredentials(isTest)
        this.twitPackage = new Twit({
            consumer_key: credentials.consumerKey,
            consumer_secret: credentials.consumerSecret,
            access_token: credentials.accessToken,
            access_token_secret: credentials.accessTokenSecret,
        });
        this.twitterApiClient = new TwitterApiClient({
            apiKey: credentials.consumerKey,
            apiSecret: credentials.consumerSecret,
            accessToken: credentials.accessToken,
            accessTokenSecret: credentials.accessTokenSecret,
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

    async getUserByScreenName(screenName: string): Promise<any> {
        const user = await this.twitterApiClient.accountsAndUsers.usersLookup({ screen_name: screenName })
        return user
    }
    async getUserTweetsByScreenName(screenName: string): Promise<any> {
        const user = await this.twitterApiClient.tweets.statusesUserTimeline({ screen_name: screenName })
        return user
    }

    async postMediaUpload(base64File: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.twitPackage.post('media/upload', { media_data: base64File }, (mediaUploadErr, mediaUploadData, mediaUploadResponse) => {
                if (mediaUploadErr) {
                    this.logger.error(JSON.stringify({ message: "error creating media upload", eventType: "errorTweeting" }))
                    return reject(mediaUploadErr)
                }
                return resolve(mediaUploadData)
            })
        }
        )
    }
    async postMediaMetaDataCreate(mediaIdStr: string, altText: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } }
            this.twitPackage.post('media/metadata/create', metaParams, (mediaMetadataErr, mediaMetadataData, mediaMetadataResponse) => {
                if (mediaMetadataErr) {
                    this.logger.error(JSON.stringify({ message: "error creating media upload metadata", eventType: "errorTweeting", errorMessage: mediaMetadataErr.message }))
                    return reject(mediaMetadataErr)
                }
                return resolve(mediaMetadataData)
            }
            )
        })
    }

    async postStatusWithMedia(statusText: string, mediaIdStrList: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = { status: statusText, media_ids: mediaIdStrList }

            this.twitPackage.post('statuses/update', params, (statusUpdateErr, statusUpdateData, statusUpdateResponse) => {
                if (statusUpdateErr) {
                    this.logger.error(JSON.stringify({ message: "error creating media upload metadata", eventType: "errorTweeting", errorMessage: statusUpdateErr.message }))
                    return reject(statusUpdateErr)
                }
                return resolve(statusUpdateData)
            })
        })
    }

    async tweetWithFile(base64File: string, companyName: string, statusText): Promise<void> {
        const mediaUploadData = await this.postMediaUpload(base64File)

        const mediaIdStr = mediaUploadData.media_id_string
        const altText = `Gender pay gap data graph ${companyName}`

        await this.postMediaMetaDataCreate(mediaIdStr, altText)

        await this.postStatusWithMedia(statusText, [mediaIdStr])
    }
}
