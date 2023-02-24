import Twit from "twit";
import { Logger } from "tslog";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { debugPrint } from "../utils/debug";
import {
  StatusesLookup,
  TwitterClient as TwitterApiClient,
} from "twitter-api-client";
import { TwitterCredentialGetter } from "./TwitterCredentialGetter";

type HandleIncomingStatusFunction = (
  input: HandleIncomingTweetInput
) => Promise<void>;

export class TwitterClient {
  twitPackage: Twit;
  logger: Logger;
  twitterApiClient: TwitterApiClient;

  constructor(isTest = false) {
    const credentials = new TwitterCredentialGetter().getCredentials(isTest);
    this.twitPackage = new Twit({
      consumer_key: credentials.consumerKey as string,
      consumer_secret: credentials.consumerSecret as string,
      access_token: credentials.accessToken,
      access_token_secret: credentials.accessTokenSecret,
    });
    this.twitterApiClient = new TwitterApiClient({
      apiKey: credentials.consumerKey as string,
      apiSecret: credentials.consumerSecret as string,
      accessToken: credentials.accessToken,
      accessTokenSecret: credentials.accessTokenSecret,
    });

    this.logger = new Logger({ name: TwitterClient.name });
  }

  async startStreamingTweets(
    following: string[],
    handleTweet: HandleIncomingStatusFunction
  ): Promise<void> {
    const stream = this.twitPackage.stream("statuses/filter", {
      follow: following,
    });
    this.logger.info(
      JSON.stringify({
        message: "streaming started",
        eventType: "streamingStarted",
      })
    );

    stream.on("tweet", async (tweet: StatusesLookup) => {
      try {
        const twitterUserId = tweet.user.id_str;
        const user = tweet.user;
        const screenName = tweet.user.screen_name;
        const isRetweet = tweet.text.startsWith("RT");
        const text = tweet.text;
        const timeStamp = new Date().toISOString();

        debugPrint({
          message: "tweet detected",
          eventType: "tweetReceived",
          twitterName: tweet.user.name,
          twitterUserId,
          screenName,
          isRetweet,
          text,
          timeStamp,
        });

        await handleTweet({
          twitterUserId,
          tweetId: tweet.id_str,
          user,
          screenName,
          isRetweet,
          text,
          timeStamp,
          fullTweetObject: tweet,
        });
      } catch (err: any) {
        this.logger.error(
          JSON.stringify({
            message: "Error while handling incoming tweeting",
            eventType: "errorHandlingTweet",
            errMessage: err.message,
            tweet,
          })
        );
      }
    });
  }

  async startStreamingTweetsTaggingGPGA(
    handleTweet: HandleIncomingStatusFunction
  ): Promise<void> {
    const stream = this.twitPackage.stream("statuses/filter", {
      track: "@PayGapApp",
    });
    this.logger.info(
      JSON.stringify({
        message: "streaming started for tweets tagging the gpga",
        eventType: "streamingStartedTweetsTaggingGPGA",
      })
    );

    stream.on("tweet", async (tweet: StatusesLookup) => {
      await this.onTweetAtGpga(tweet, handleTweet);
    });
  }

  // TODO this could be reused with some minor adjustments.
  async onTweetAtGpga(
    tweet: StatusesLookup,
    handleTweet: HandleIncomingStatusFunction
  ) {
    try {
      const twitterUserId = tweet.user.id_str;
      const user = tweet.user;
      const screenName = tweet.user.screen_name;
      const isRetweet = tweet.text.startsWith("RT");
      const text = tweet.text;
      const timeStamp = new Date().toISOString();

      console.log({
        tweet,
        message: "tweet detected at GPGA",
        eventType: "tweetReceivedAtGpga",
        twitterName: tweet.user.name,
        twitterUserId,
        screenName,
        isRetweet,
        text,
        timeStamp,
      });

      await handleTweet({
        twitterUserId,
        tweetId: tweet.id_str,
        user,
        screenName,
        isRetweet,
        text,
        timeStamp,
        fullTweetObject: tweet,
      });
    } catch (err: any) {
      this.logger.error(
        JSON.stringify({
          message: "Error while handling incoming tweet at the GPGA",
          eventType: "errorHandlingTweetAtGpga",
          errMessage: err.message,
          tweet,
        })
      );
    }
  }

  quoteTweet(
    status: string,
    screenName: string, // tweet.user.screen_name
    tweetId: string // tweet.id_str
  ) {
    return new Promise((resolve, reject) => {
      const attachmentUrl = `https://twitter.com/${screenName}/status/${tweetId}`;
      const body = {
        status,
        attachment_url: attachmentUrl,
        auto_populate_reply_metadata: true,
      };
      this.twitPackage.post("statuses/update", body, (err: Error) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "Tweet sent" });
      });
    });
  }

  postTweet(tweet: string) {
    return new Promise((resolve, reject) => {
      this.twitPackage.post(
        "statuses/update",
        { status: tweet },
        (err: Error) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: "Tweet sent" });
        }
      );
    });
  }

  reTweet(tweetId: string, tweet: string, quotedStatus: string) {
    return new Promise((resolve, reject) => {
      this.twitPackage.post(
        "statuses/retweet/" + tweetId,
        { status: tweet, quoted_status: quotedStatus } as any,
        (err: Error) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: "Tweet sent" });
        }
      );
    });
  }

  async getUserByScreenName(screenName: string): Promise<any> {
    const user = await this.twitterApiClient.accountsAndUsers.usersLookup({
      screen_name: screenName,
    });
    return user;
  }

  async getUserTweetsByScreenName(screenName: string): Promise<any> {
    const user = await this.twitterApiClient.tweets.statusesUserTimeline({
      screen_name: screenName,
    });
    return user;
  }

  async postMediaUpload(base64File: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.twitPackage.post(
        "media/upload",
        { media_data: base64File },
        (mediaUploadErr: Error, mediaUploadData: any) => {
          if (mediaUploadErr) {
            this.logger.error(
              JSON.stringify({
                message: "error creating media upload",
                eventType: "errorTweeting",
              })
            );
            return reject(mediaUploadErr);
          }
          return resolve(mediaUploadData);
        }
      );
    });
  }
  async postMediaMetaDataCreate(
    mediaIdStr: string,
    altText: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } };
      this.twitPackage.post(
        "media/metadata/create",
        metaParams,
        (mediaMetadataErr: Error, mediaMetadataData: any) => {
          if (mediaMetadataErr) {
            this.logger.error(
              JSON.stringify({
                message: "error creating media upload metadata",
                eventType: "errorTweeting",
                errorMessage: mediaMetadataErr.message,
              })
            );
            return reject(mediaMetadataErr);
          }
          return resolve(mediaMetadataData);
        }
      );
    });
  }

  async postStatusWithMedia(
    statusText: string,
    mediaIdStrList: string[]
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const params = { status: statusText, media_ids: mediaIdStrList };

      this.twitPackage.post(
        "statuses/update",
        params,
        (statusUpdateErr: Error, statusUpdateData: any) => {
          if (statusUpdateErr) {
            this.logger.error(
              JSON.stringify({
                message: "error creating media upload metadata",
                eventType: "errorTweeting",
                errorMessage: statusUpdateErr.message,
              })
            );
            return reject(statusUpdateErr);
          }
          return resolve(statusUpdateData);
        }
      );
    });
  }

  async tweetWithFile(
    base64File: string,
    companyName: string,
    statusText: string
  ): Promise<void> {
    const mediaUploadData = await this.postMediaUpload(base64File);

    const mediaIdStr = mediaUploadData.media_id_string;
    const altText = `Gender pay gap data graph ${companyName}`;

    await this.postMediaMetaDataCreate(mediaIdStr, altText);

    await this.postStatusWithMedia(statusText, [mediaIdStr]);
  }
}
