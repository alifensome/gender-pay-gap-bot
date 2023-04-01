import { TwitterClient } from "../twitter/Client";
import { SqsClient } from "../sqs/Client";
import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { replaceMultiple } from "../utils/replace";
import { TwitterData } from "../types";
import { relevantWords } from "./relevantWords";
import { deduplicateList } from "../utils/deduplicateList";
import { SearchQueryFormer } from "./searchQueryFormer";
import { LambdaLogger } from "../lambdaLogger";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import {
  searchRecentTweetsData,
  searchRecentTweetsResponse,
  User,
} from "../twitter/types";

export class ListenerV2 {
  twitterClient: TwitterClient;
  logger: LambdaLogger;
  repository: Repository;
  sqsClient: SqsClient;
  searchQueryFormer: SearchQueryFormer;

  constructor(
    twitterClient: TwitterClient,
    sqsClientTweetAtGpga: SqsClient,
    repository: Repository,
    logger: LambdaLogger,
    searchQueryFormer: SearchQueryFormer
  ) {
    this.twitterClient = twitterClient;
    this.sqsClient = sqsClientTweetAtGpga;
    this.repository = repository;
    this.logger = logger;
    this.searchQueryFormer = searchQueryFormer;
  }

  async run(): Promise<void> {
    const twitterUsers = this.repository.dataImporter.twitterUserDataProd();
    const follows = this.getFollowsFromData(twitterUsers);
    const queries = this.searchQueryFormer.toQuery(follows);
    this.logger.logEvent({
      eventType: "formedQueries",
      message: `formed ${queries.length} queries.`,
    });
    for (let index = 0; index < queries.length; index++) {
      const query = queries[index];
      const result = await this.twitterClient.searchRecentTweets(query);
      this.logger.logEvent({
        eventType: "foundRecentTweets",
        message: `Found ${result.data.length} recent tweets.`,
      });
      await this.handleSearchResponse(result);
    }

    this.logger.logEvent({
      eventType: "finishedListenerV2",
      message: `Done.`,
    });
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

    return deduplicateList(twitterIds, (x, y) => x === y);
  }

  async handleSearchResponse(input: searchRecentTweetsResponse): Promise<void> {
    for (let index = 0; index < input.data.length; index++) {
      const tweet = input.data[index];
      await this.handleTweet(tweet, input.includes.users);
    }
  }

  async handleTweet(
    tweet: searchRecentTweetsData,
    users: User[]
  ): Promise<void> {
    if (tweet.text.startsWith("RT")) {
      return;
    }

    const isRelevant = this.checkTweetContainsWord(tweet.text);
    if (isRelevant) {
      const user = users.find((u) => u.id === tweet.author_id);
      if (!user) {
        throw new Error("could not find author for id:" + tweet.author_id);
      }
      await this.handleRelevantTweet(tweet, user);
    }
    return;
  }

  async handleRelevantTweet(tweet: searchRecentTweetsData, user: User) {
    const input: HandleIncomingTweetInput = {
      twitterUserId: tweet.author_id,
      tweetId: tweet.id,
      screenName: user.username,
      isRetweet: tweet.text.startsWith("RT"),
      text: tweet.text,
      timeStamp: new Date().toISOString(),
    };
    await this.sqsClient.queueMessage(input, 0);

    this.logger.logEvent({
      message: `successfully queued: ${tweet.id}, userId: ${tweet.author_id}`,
      eventType: "successfulQueueTweet",
      screenName: user.username,
      twitterUserId: tweet.author_id,
      tweetId: tweet.id,
      tweet: tweet.text,
    });
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

function uppercaseAndReplace(tweet: string) {
  const replacements = [
    { find: "'", replace: "" },
    { find: "’", replace: "" },
    { find: "#", replace: "" },
  ];
  const upperCaseTweet = replaceMultiple(tweet.toUpperCase(), replacements);
  return upperCaseTweet;
}
