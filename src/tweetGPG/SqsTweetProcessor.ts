import { Logger } from "tslog";
import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { CopyWriter } from "../copyWriter/CopyWriter";
import DynamoDbClient from "../dynamodb/Client";

interface ProcessInput {
  twitterUserId: string;
  tweetId: string;
  screenName: string;
}

export class SqsTweetProcessor {
  twitterClient: TwitterClient;
  logger: Logger<any>;
  repository: Repository;
  minGPG: number | null;
  copyWriter: CopyWriter;
  dynamoDbClient: DynamoDbClient;

  constructor(
    twitterClient: TwitterClient,
    repo: Repository,
    minGPG: number | null,
    dynamoDbClient: DynamoDbClient
  ) {
    this.twitterClient = twitterClient;
    this.logger = new Logger({ name: "SqsTweetProcessor" });
    this.repository = repo;
    this.minGPG = minGPG;
    this.copyWriter = new CopyWriter();
    this.dynamoDbClient = dynamoDbClient;
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
      const existingTweet = await this.dynamoDbClient.getItem({
        pk: "successfulTweet",
        id: tweetId,
      });
      if (existingTweet) {
        this.logger.info(
          JSON.stringify({
            message: "already tweeted this tweet.",
            eventType: "alreadyTweeted",
            twitterUserId,
            tweetId,
            screenName,
          })
        );
        return;
      }
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
        throw new Error("Skip for now.");
      }

      const copy =
        this.copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
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
      await this.dynamoDbClient.putItem({
        pk: "successfulTweet",
        id: tweetId,
        data: {
          tweetId,
          twitterUserId,
          screenName,
          companyName: data.companyData.companyName,
        },
      });
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
