import Twit from "twit";
import { Logger } from "tslog";
import { HandleIncomingTweetStreamInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { debugPrint } from "../utils/debug";
import {
  StatusesLookup,
  TwitterClient as TwitterApiClient,
} from "twitter-api-client";
import { TwitterCredentialGetter } from "./TwitterCredentialGetter";
import { restartStream } from "./restartStream";
import { getEnvVar } from "../utils/getEnvVar";
import axios from "axios";
import { replaceMultiple } from "../utils/replace";
import { Stream } from "stream";
import { searchRecentTweetsResponse } from "./types";

type HandleIncomingStatusFunction = (
  input: HandleIncomingTweetStreamInput
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

  async searchRecentTweets(query: string): Promise<searchRecentTweetsResponse> {
    try {
      const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&tweet.fields=id,text&expansions=author_id&user.fields=id,name,username&max_results=100`;
      const bt = await this.getAuthToken();
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${bt}`,
        },
      });
      return data;
    } catch (error) {
      const errMessage = (error as Error)?.message;
      console.error(errMessage);
      throw new Error(
        `Error while searching for tweet: ${JSON.stringify(
          errMessage || error
        )}.`
      );
    }
  }

  async handleTweetEvent(
    tweet: TweetSearchStreamDataItem,
    handleTweet: HandleIncomingStatusFunction
  ) {
    // TODO report some log to show its working.
    try {
      const twitterUserId = tweet.data.author_id;
      const screenName = tweet.includes.users[0].username;
      const isRetweet = tweet.data.text.startsWith("RT");
      const text = tweet.data.text;
      const timeStamp = new Date().toISOString();
      const twitterId = tweet.data.id;
      // todo work out if its a reply.
      debugPrint({
        message: "tweet detected",
        eventType: "tweetReceived",
        twitterId,
        tweet,
        twitterUserId,
        screenName,
        isRetweet,
        text,
        timeStamp,
      });

      await handleTweet({
        twitterUserId,
        tweetId: twitterId,
        screenName,
        isRetweet,
        text,
        timeStamp,
        fullTweetObject: tweet,
      });
    } catch (err: any) {
      console.log(err);
      this.logger.error(
        JSON.stringify({
          message: "Error while handling incoming tweeting",
          eventType: "errorHandlingTweet",
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

  replyToTweet({ tweet, replyTweetId }: ReplyToTweetInput): Promise<any> {
    if (!tweet.includes("@")) {
      throw new Error("tweet must be in response to someone with an @ symbol.");
    }
    if (tweet.length > 280) {
      throw new Error(
        "tweet can not be longer than 280 chars But was:" +
          tweet.length +
          "Content:" +
          tweet
      );
    }
    return new Promise((resolve, reject) => {
      this.twitPackage.post(
        "statuses/update",
        {
          status: tweet,
          in_reply_to_status_id: replyTweetId,
        },
        (err: Error) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: "Tweet sent" });
        }
      );
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

  async getAuthToken(): Promise<string> {
    const apiKey = getEnvVar("TWITTER_API_KEY");
    const apiSecret = getEnvVar("TWITTER_API_SECRET");
    const { data } = await axios.post(
      "https://api.twitter.com/oauth2/token?grant_type=client_credentials",
      {},
      {
        auth: {
          username: apiKey,
          password: apiSecret,
        },
        headers: {},
      }
    );
    if (!data.access_token) {
      throw new Error("no auth token returned.");
    }
    return data.access_token;
  }

  async filterStreamV2(
    handleTweet: HandleIncomingStatusFunction,
    handleData: () => void
  ) {
    const bt = await this.getAuthToken();
    this.logger.info(
      JSON.stringify({
        message: "streaming started",
        eventType: "streamingStarted",
      })
    );

    const { data } = await axios.get(
      "https://api.twitter.com/2/tweets/search/stream?tweet.fields=id,text&expansions=author_id&user.fields=id,name,username",
      {
        headers: {
          Authorization: `Bearer ${bt}`,
        },
        responseType: "stream",
      }
    );

    const stream = data as Stream;

    stream.on("data", async (data: Buffer) => {
      handleData();
      const dataString = data.toString("utf-8");
      const dataNoNewLine = replaceMultiple(dataString, [
        { find: "\n" },
        { find: "\r" },
      ]);
      if (!dataNoNewLine) {
        return;
      }
      const parsedTweet = JSON.parse(
        dataNoNewLine
      ) as TweetSearchStreamDataItem;
      console.log({ data: dataString });
      await this.handleTweetEvent(parsedTweet, handleTweet);
    });

    stream.on("error", (data: Buffer) => {
      this.logger.error(
        JSON.stringify({
          message: "Error from stream",
          eventType: "errorFromStream",
          errMessage: data.toString("utf-8"),
        })
      );
    });

    stream.on("end", () => {
      this.logger.error(
        JSON.stringify({
          message:
            "Stream is finished. Exiting process for systemd to restart.",
          eventType: "streamDone",
        })
      );
      process.exit(1);
    });
  }
}

export interface ReplyToTweetInput {
  tweet: string;
  replyTweetId: string;
}

export interface SearchRecentTweetsDataResponse {
  data: SearchRecentTweetsDataResponseData[];
  includes: Includes;
  matching_rules: MatchingRule[];
}

export interface TweetSearchStreamDataItem {
  data: SearchRecentTweetsDataResponseData;
  includes: Includes;
  matching_rules: MatchingRule[];
}

export interface SearchRecentTweetsDataResponseData {
  author_id: string;
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
}

export interface Includes {
  users: User[];
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface MatchingRule {
  id: string;
  tag: string;
}
