import { TweetSearchStreamDataItem, TwitterClient } from "../twitter/Client";
import { Logger } from "tslog";
import { SqsClient } from "../sqs/Client";
import DataImporter from "../importData";
import { debugPrint } from "../utils/debug";
import { Repository } from "../importData/Repository";
import { replaceMultiple } from "../utils/replace";
import { TwitterData } from "../types";
import { relevantWords } from "./relevantWords";
import StatusesLookup, {
  User,
} from "twitter-api-client/dist/interfaces/types/StatusesLookupTypes";
import { deduplicateList } from "../utils/deduplicateList";

const PayGapAppUserName = "@PayGapApp";

export class IncomingTweetListenerQueuer {
  twitterClient: TwitterClient;
  logger: Logger;
  dataImporter: DataImporter;
  repository: Repository;
  sqsClientTweetAtGpga: SqsClient;
  numberOfMessages = 0;

  constructor(
    twitterClient: TwitterClient,
    sqsClientTweetAtGpga: SqsClient,
    dataImporter: DataImporter,
    repository: Repository,
    logger: Logger
  ) {
    this.twitterClient = twitterClient;
    this.sqsClientTweetAtGpga = sqsClientTweetAtGpga;
    this.dataImporter = dataImporter;
    this.repository = repository;
    this.logger = logger;
  }

  listen(isTest?: boolean) {
    this.twitterClient.filterStreamV2((input) =>
      this.handleIncomingTweet(input)
    );
  }

  getFollowsFromData(twitterData: TwitterData[]) {
    const twitterIds: string[] = [];
    for (let index = 0; index < twitterData.length; index++) {
      const c = twitterData[index];
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
    return deduplicateList(twitterIds, (x, y) => x === y);
  }

  async handleIncomingTweet(
    input: HandleIncomingTweetStreamInput
  ): Promise<void> {
    this.numberOfMessages++;
    this.logger.info(
      JSON.stringify({
        message: `Received ${this.numberOfMessages} messaged since started listening.`,
        numberOfMessages: this.numberOfMessages,
        eventType: "receivedTweetAtGPGA",
      })
    );
    if (input.isRetweet) {
      debugPrint({
        message: "Ignoring retweet",
        eventType: "ignoringRetweet",
      });
      return;
    }

    if (input.text.includes(PayGapAppUserName)) {
      return await this.handleIncomingTweetAtTheGpga(input);
    }
    return;
  }

  async handleIncomingTweetAtTheGpga(input: HandleIncomingTweetStreamInput) {
    if (input.isRetweet) {
      debugPrint({
        message: "Ignoring retweet",
        eventType: "ignoringRetweet",
      });
      return;
    }

    // Queue the message to a new queue
    await this.sqsClientTweetAtGpga.queueMessage(input, 0);

    this.logger.info(
      JSON.stringify({
        message: `successfully queued tweet at the GPGA: ${input.tweetId}, userId: ${input.twitterUserId}`,
        eventType: "successfulQueueTweetAtGpga",
        screenName: input.screenName,
        input,
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

  checkContainsPhrase(upperCaseTweet: string, relevantPhrase: string): boolean {
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
  user: User;
  screenName: string;
  isRetweet: boolean;
  text: string;
  timeStamp: string;
  fullTweetObject: StatusesLookup;
}

export interface HandleIncomingTweetStreamInput {
  twitterUserId: string;
  tweetId: string;
  screenName: string;
  isRetweet: boolean;
  text: string;
  timeStamp: string;
  fullTweetObject: TweetSearchStreamDataItem;
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
