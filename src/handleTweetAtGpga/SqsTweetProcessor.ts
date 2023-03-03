import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { CopyWriter } from "../copyWriter/CopyWriter";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { parseTweet, TweetAtGpgaType } from "./parseTweet";
import { shouldNeverHappen } from "../utils/shouldNeverHappen";
import { LambdaLogger } from "../lambdaLogger";
import { CompanyDataMultiYearItem } from "../types";

export class SqsTweetProcessor {
  twitterClient: TwitterClient;
  logger: LambdaLogger;
  repository: Repository;
  copyWriter: CopyWriter;

  constructor(twitterClient: TwitterClient, repo: Repository) {
    this.twitterClient = twitterClient;
    this.logger = new LambdaLogger(
      "HandleTweetAtGpgaTweetAtGpgaSqsTweetProcessor"
    );
    this.repository = repo;
    this.copyWriter = new CopyWriter();
  }

  async process(input: HandleIncomingTweetInput) {
    try {
      this.logger.logEvent({
        message: "processing sqs record",
        eventType: "processingRecordTweetAtGpga",
        twitterUserId: input.twitterUserId,
        tweetId: input.tweetId,
        screenName: input.screenName,
      });

      // parse tweet.
      const parsedTweetResult = parseTweet(input.text);

      switch (parsedTweetResult.type) {
        case TweetAtGpgaType.RequestingCompanyGpg:
          if (!parsedTweetResult.companyName) {
            throw new Error("no company name but was parsable.");
          }
          await this.handleRelevantTweet(parsedTweetResult.companyName, input);
          return;
        case TweetAtGpgaType.Irrelevant:
          // if unparsable then  reply with something else or ignore.
          this.logger.logEvent({
            eventType: "tweetAtUsSkippedAsIrrelevant",
            message: "Tweet at us skipped as irrelevant",
            screenName: input.screenName,
            tweetId: input.tweetId,
          });
          return;

        default:
          shouldNeverHappen(parsedTweetResult.type);
          return;
      }
    } catch (error) {
      this.logger.logEvent({
        message: "error sending tweet",
        eventType: "errorHandlingTweetAtGpga",
        tweetId: input.tweetId,
        twitterUserId: input.twitterUserId,
        screenName: input.screenName,
      });
      // todo handle error case somehow.
      throw error;
    }
  }

  async handleRelevantTweet(
    companyName: string,
    input: HandleIncomingTweetInput
  ) {
    this.logger.logEvent({
      message: "would have tweeted for input:",
      data: input,
      eventType: "tweetAtUsHandleRelevantTweet",
    });
    this.repository.checkSetData();
    const fuzzyMatchResult =
      this.repository.fuzzyFindCompanyByName(companyName);

    if (fuzzyMatchResult.exactMatch) {
      this.logger.logEvent({
        message: "found exact match",
        data: {
          input,
          fuzzyMatchName: fuzzyMatchResult.exactMatch.companyName,
        },
        eventType: "tweetAtUsExactMatch",
      });
      await this.handleSingleResult(fuzzyMatchResult.exactMatch, input);
      return;
    }

    if (fuzzyMatchResult.closeMatches) {
      const numberOfCloseMatches = fuzzyMatchResult.closeMatches.length;
      if (numberOfCloseMatches === 1) {
        // handle single result
        await this.handleSingleResult(fuzzyMatchResult!.closeMatches[0], input);
        return;
      }

      if (numberOfCloseMatches > 1 && numberOfCloseMatches <= 5) {
        // handle multiple results
        this.logger.logEvent({
          message: "found partial matches",
          data: input,
          eventType: "tweetAtUsPartialMatch",
          closeMatchNumber: numberOfCloseMatches,
        });

        await this.handleMultipleResults(fuzzyMatchResult.closeMatches, input);
        return;
      }
    }

    this.logger.logEvent({
      message: "found no matches",
      data: input,
      eventType: "tweetAtUsNoMatch",
    });
    await this.handleNotFound(input);
    return;
  }

  private async handleNotFound(input: HandleIncomingTweetInput) {
    const notFoundCopy = this.copyWriter.tweetAtUsCouldNotFindResults();

    await this.twitterClient.replyToTweet({
      tweet: notFoundCopy,
      replyTweetId: input.tweetId,
      screenName: input.screenName,
    });
  }

  private async handleMultipleResults(
    closeMatches: CompanyDataMultiYearItem[],
    input: HandleIncomingTweetInput
  ) {
    const multipleResultsCopy =
      this.copyWriter.tweetAtUsMultipleResultsFound(closeMatches);

    await this.twitterClient.replyToTweet({
      tweet: multipleResultsCopy,
      replyTweetId: input.tweetId,
      screenName: input.screenName,
    });
  }

  private async handleSingleResult(
    companyDataMultiYearItem: CompanyDataMultiYearItem,
    input: HandleIncomingTweetInput
  ) {
    const mostRecentGpg = getMostRecentMedianGPGOrThrow(
      companyDataMultiYearItem
    );
    const copy = this.copyWriter.getAtCompanyNameMedianPayCopy(
      companyDataMultiYearItem.companyName,
      mostRecentGpg
    );

    await this.twitterClient.replyToTweet({
      tweet: copy,
      replyTweetId: input.tweetId,
      screenName: input.screenName,
    });

    this.logger.logEvent({
      message: "sent tweet in reply to tweeting at gpga",
      eventType: "sentTweetReplyToTweetingAtGpga",
      tweetId: input.tweetId,
      twitterUserId: input.twitterUserId,
      screenName: input.screenName,
      companyName: companyDataMultiYearItem.companyName,
      companyNumber: companyDataMultiYearItem.companyNumber,
      successfullySentTweet: 1,
    });
  }
}
