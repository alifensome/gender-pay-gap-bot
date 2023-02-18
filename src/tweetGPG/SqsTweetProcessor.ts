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
    this.logger = new Logger({ name: "SqsTweetProcessor" });
    this.repository = repo;
    this.minGPG = minGPG;
    this.copyWriter = new CopyWriter();
  }

  async process({ twitterUserId, tweetId, screenName }: ProcessInput) {
    try {
      this.logger.info(
        JSON.stringify({
          message: "processing sqs record",
          eventType: "processingRecord",
          twitterUserId,
          tweetId,
          screenName,
        })
      );
      const data = this.repository.getGpgForTwitterId(twitterUserId);
      if (!data || !data.companyData) {
        this.logger.error(
          JSON.stringify({
            message: "error finding company",
            eventType: "errorGettingCompany",
            tweetId,
            twitterUserId,
            errorSendingTweet: 1,
            screenName,
          })
        );
        throw new Error(
          `could not find company. TwitterUserId: ${twitterUserId}, ${screenName}`
        );
      }

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

      const copy = this.copyWriter.medianGpgForThisOrganisation(
        data.companyData
      );
      await this.twitterClient.quoteTweet(
        copy,
        data.twitterData.twitter_screen_name,
        tweetId
      );
      this.logger.info(
        JSON.stringify({
          message: "sent tweet",
          eventType: "sentTweet",
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
          eventType: "errorSendingTweet",
          tweetId,
          twitterUserId,
          errorSendingTweet: 1,
          screenName,
        })
      );
      throw error;
    }
  }
}
