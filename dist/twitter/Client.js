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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterClient = void 0;
const twit_1 = __importDefault(require("twit"));
const tslog_1 = require("tslog");
const debug_1 = require("../utils/debug");
const twitter_api_client_1 = require("twitter-api-client");
const TwitterCredentialGetter_1 = require("./TwitterCredentialGetter");
class TwitterClient {
    constructor(isTest = false) {
        const credentials = new TwitterCredentialGetter_1.TwitterCredentialGetter().getCredentials(isTest);
        this.twitPackage = new twit_1.default({
            consumer_key: credentials.consumerKey,
            consumer_secret: credentials.consumerSecret,
            access_token: credentials.accessToken,
            access_token_secret: credentials.accessTokenSecret,
        });
        this.twitterApiClient = new twitter_api_client_1.TwitterClient({
            apiKey: credentials.consumerKey,
            apiSecret: credentials.consumerSecret,
            accessToken: credentials.accessToken,
            accessTokenSecret: credentials.accessTokenSecret,
        });
        this.logger = new tslog_1.Logger({ name: TwitterClient.name });
    }
    startStreamingTweets(following, handleTweet) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = this.twitPackage.stream('statuses/filter', { follow: following });
            this.logger.info(JSON.stringify({ message: "streaming started", eventType: "streamingStarted" }));
            stream.on('tweet', (tweet) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const twitterUserId = tweet.user.id_str;
                    const user = tweet.user;
                    const screenName = tweet.user.screen_name;
                    const isRetweet = tweet.text.startsWith("RT");
                    const text = tweet.text;
                    const timeStamp = new Date().toISOString();
                    (0, debug_1.debugPrint)({
                        message: "tweet detected",
                        eventType: "tweetReceived",
                        twitterName: tweet.user.name,
                        twitterUserId,
                        screenName,
                        isRetweet,
                        text,
                        timeStamp,
                    });
                    yield handleTweet({
                        twitterUserId,
                        tweetId: tweet.id_str,
                        user,
                        screenName,
                        isRetweet,
                        text,
                        timeStamp,
                        fullTweetObject: tweet
                    });
                }
                catch (err) {
                    this.logger.error(JSON.stringify({
                        message: "Error while handling incoming tweeting",
                        eventType: "errorHandlingTweet",
                        errMessage: err.message,
                        tweet,
                    }));
                }
            }));
        });
    }
    quoteTweet(status, screenName, // tweet.user.screen_name
    tweetId // tweet.id_str
    ) {
        return new Promise((resolve, reject) => {
            const attachmentUrl = `https://twitter.com/${screenName}/status/${tweetId}`;
            const body = { status, attachment_url: attachmentUrl, auto_populate_reply_metadata: true };
            this.twitPackage.post('statuses/update', body, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: 'Tweet sent' });
            });
        });
    }
    postTweet(tweet) {
        return new Promise((resolve, reject) => {
            this.twitPackage.post('statuses/update', { status: tweet }, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: 'Tweet sent' });
            });
        });
    }
    reTweet(tweetId, tweet, quotedStatus) {
        return new Promise((resolve, reject) => {
            this.twitPackage.post('statuses/retweet/' + tweetId, { status: tweet, quoted_status: quotedStatus }, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: 'Tweet sent' });
            });
        });
    }
    getUserByScreenName(screenName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.twitterApiClient.accountsAndUsers.usersLookup({ screen_name: screenName });
            return user;
        });
    }
    getUserTweetsByScreenName(screenName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.twitterApiClient.tweets.statusesUserTimeline({ screen_name: screenName });
            return user;
        });
    }
    postMediaUpload(base64File) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.twitPackage.post('media/upload', { media_data: base64File }, (mediaUploadErr, mediaUploadData, mediaUploadResponse) => {
                    if (mediaUploadErr) {
                        this.logger.error(JSON.stringify({ message: "error creating media upload", eventType: "errorTweeting" }));
                        return reject(mediaUploadErr);
                    }
                    return resolve(mediaUploadData);
                });
            });
        });
    }
    postMediaMetaDataCreate(mediaIdStr, altText) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } };
                this.twitPackage.post('media/metadata/create', metaParams, (mediaMetadataErr, mediaMetadataData, mediaMetadataResponse) => {
                    if (mediaMetadataErr) {
                        this.logger.error(JSON.stringify({ message: "error creating media upload metadata", eventType: "errorTweeting", errorMessage: mediaMetadataErr.message }));
                        return reject(mediaMetadataErr);
                    }
                    return resolve(mediaMetadataData);
                });
            });
        });
    }
    postStatusWithMedia(statusText, mediaIdStrList) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const params = { status: statusText, media_ids: mediaIdStrList };
                this.twitPackage.post('statuses/update', params, (statusUpdateErr, statusUpdateData, statusUpdateResponse) => {
                    if (statusUpdateErr) {
                        this.logger.error(JSON.stringify({ message: "error creating media upload metadata", eventType: "errorTweeting", errorMessage: statusUpdateErr.message }));
                        return reject(statusUpdateErr);
                    }
                    return resolve(statusUpdateData);
                });
            });
        });
    }
    tweetWithFile(base64File, companyName, statusText) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUploadData = yield this.postMediaUpload(base64File);
            const mediaIdStr = mediaUploadData.media_id_string;
            const altText = `Gender pay gap data graph ${companyName}`;
            yield this.postMediaMetaDataCreate(mediaIdStr, altText);
            yield this.postStatusWithMedia(statusText, [mediaIdStr]);
        });
    }
}
exports.TwitterClient = TwitterClient;
//# sourceMappingURL=Client.js.map