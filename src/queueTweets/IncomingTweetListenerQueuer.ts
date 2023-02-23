import { TwitterClient } from "../twitter/Client";
import { Logger } from "tslog";
import { SqsClient } from "../sqs/Client";
import DataImporter from "../importData";
import { debugPrint } from "../utils/debug";
import { Repository } from '../importData/Repository';
import { replaceMultiple } from "../utils/replace";
import { TwitterData } from "../types";
import { relevantWords } from "./relevantWords";

export class IncomingTweetListenerQueuer {
  twitterClient: TwitterClient;
  sqsClient: SqsClient;
  logger: Logger;
  dataImporter: DataImporter;
  repository: Repository;
  constructor(twitterClient: TwitterClient, sqsClient: SqsClient, dataImporter: DataImporter, repository: Repository, logger: Logger) {
    this.twitterClient = twitterClient;
    this.sqsClient = sqsClient;
    this.dataImporter = dataImporter;
    this.repository = repository;
    this.logger = logger;
  }

  listen(isTest?: boolean) {
    const twitterData = this.dataImporter.twitterUserDataProd();
    if (isTest) {
      this.logger.info(JSON.stringify({ message: "running in debug mode!" }));
      twitterData.push(this.dataImporter.twitterUserDataTest()[0]);
    }
    const followers = this.getFollowsFromData(twitterData);
    return this.twitterClient.startStreamingTweets(followers, (input) =>
      this.handleIncomingTweet(input)
    );
  }

  getFollowsFromData(companies: TwitterData[]) {
    const twitterIds: string[] = [];
    for (let index = 0; index < companies.length; index++) {
      const c = companies[index];
      twitterIds.push(c.twitter_id_str);
    }
    if (twitterIds.length === 0) {
      throw new Error("No twitter Ids!");
    }
    if (twitterIds.length > 4000) {
      this.logger.error(
        JSON.stringify({ message: "too many twitter IDs to watch!" })
      );
    }
    return twitterIds;
  }

  async handleIncomingTweet(input: HandleIncomingTweetInput) {
    if (input.isRetweet) {
      debugPrint({
        message: "Ignoring retweet",
        eventType: "ignoringRetweet",
      });
      return;
    }

    // Check tweet contains words
    const isRelevantTweet = this.checkTweetContainsWord(
      input.fullTweetObject.text
    );
    if (!isRelevantTweet) {
      debugPrint("irrelevant tweet");
      return;
    }

    const data = this.repository.getGpgForTwitterId(input.twitterUserId);
    if (!data || !data.companyData) {
      this.logger.info(
        JSON.stringify({
          message: "could not find twitter user, ignoring.",
          twitterUserId: input.twitterUserId,
          screenName: input.screenName,
          eventType: "couldNotGetUserIgnoring",
        })
      );
      return;
    }
    // Queue the message
    await this.sqsClient.queueMessage(input);
    this.logger.info(
      JSON.stringify({
        message: `successfully queued tweet: ${input.tweetId}, userId: ${input.twitterUserId}`,
        eventType: "successfulQueue",
        screenName: input.screenName,
      })
    );
  }

  checkTweetContainsWord(tweet: string): boolean {
    const upperCaseTweet = uppercaseAndReplace(tweet);
    const tweetedWords = upperCaseTweet.split(/[ ,]+/);
    for (let index = 0; index < relevantWords.length; index++) {
      const relevantWord = relevantWords[index];
      if (relevantWord.requiresExact) {
        const result = this.checkContainsExactWord(
          tweetedWords,
          relevantWord.phrase
        );
        if (result) {
          return true;
        }
      } else {
        const result = this.checkContainsPhrase(
          upperCaseTweet,
          relevantWord.phrase
        );
        if (result) {
          return true;
        }
      }
    }
    return false;
  }

  checkContainsPhrase(
    upperCaseTweet: string,
    relevantPhrase: string
  ): boolean {
    if (upperCaseTweet.includes(relevantPhrase)) {
      return true;
    }
    return false;
  }

  checkContainsExactWord(
    tweetedWords: string[],
    relevantPhrase: string
  ): boolean {
    for (let index = 0; index < tweetedWords.length; index++) {
      const tweetedWord = tweetedWords[index];
      if (tweetedWord === relevantPhrase) {
        return true;
      }
    }
    return false;
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

function uppercaseAndReplace(tweet: string) {
  const replacements = [
    { find: "'", replace: "" },
    { find: "’", replace: "" },
    { find: "#", replace: "" },
  ];
  const upperCaseTweet = replaceMultiple(tweet.toUpperCase(), replacements);
  return upperCaseTweet;
}
