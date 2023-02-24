import { Logger } from "tslog";
import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { CopyWriter } from "../copyWriter/CopyWriter";

interface ProcessInput {
  twitterUserId: string;
  tweetId: string;
  screenName: string;
}

export class SqsTweetProcessor {
  twitterClient: TwitterClient;
  logger: Logger;
  repository: Repository;
  minGPG: number | null;
  copyWriter: CopyWriter;

  constructor(
    twitterClient: TwitterClient,
    repo: Repository,
    minGPG: number | null
  ) {
    this.twitterClient = twitterClient;
    this.logger = new Logger({ name: "TweetAtGpgaSqsTweetProcessor" });
    this.repository = repo;
    this.minGPG = minGPG;
    this.copyWriter = new CopyWriter();
  }

  async process({ twitterUserId, tweetId, screenName }: ProcessInput) {
    try {
      // TODO decide if its relevant / parsable.
      this.logger.info(
        JSON.stringify({
          message: "processing sqs record",
          eventType: "processingRecordTweetAtGpga",
          twitterUserId,
          tweetId,
          screenName,
        })
      );

      // parse tweet.

      // if unparsable then  reply with something else.

      // if parsable

      // get company(s) by name
      const data = this.repository.getGpgForTwitterId(twitterUserId);
      if (!data || !data.companyData) {
        this.logger.error(
          JSON.stringify({
            message: "error finding company",
            eventType: "errorGettingCompany",
            tweetId,
            twitterUserId,
            errorHandlingTweetAtGpga: 1,
            screenName,
          })
        );
        throw new Error(
          `could not find company. TwitterUserId: ${twitterUserId}, ${screenName}`
        );
      }

      // build copy and stuff

      const mostRecentGPG = getMostRecentMedianGPGOrThrow(data.companyData);
      if (this.minGPG !== null && mostRecentGPG < this.minGPG) {
        this.logger.info(
          JSON.stringify({
            message: "skipped",
            eventType: "skipTweet",
            tweetId,
            twitterUserId,
            screenName,
            companyName: data.companyData.companyName,
            tempSkip: 1,
          })
        );
        throw new Error("SKIP for now.");
      }

      const copy =
        this.copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          data.companyData
        );

      this.logger.info("would have tweeted:", {
        copy,
        twitter_screen_name: data.twitterData.twitter_screen_name,
        tweetId,
      });
      // TODO reply to the tweet rather than quote tweeting.

      // await this.twitterClient.quoteTweet(
      //   copy,
      //   data.twitterData.twitter_screen_name,
      //   tweetId
      // );
      this.logger.info(
        JSON.stringify({
          message: "sent tweet in reply to tweeting at gpga",
          eventType: "sentTweetReplyToTweetingAtGpga",
          tweetId,
          twitterUserId,
          screenName,
          companyName: data.companyData.companyName,
          successfullySentTweet: 1,
        })
      );
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          message: "error sending tweet",
          eventType: "errorHandlingTweetAtGpga",
          tweetId,
          twitterUserId,
          errorHandlingTweetAtGpga: 1,
          screenName,
        })
      );
      throw error;
    }
  }
}
