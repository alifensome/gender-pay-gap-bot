import { Logger } from "tslog";
import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { CopyWriter } from "../copyWriter/CopyWriter";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";

export class SqsTweetProcessor {
  twitterClient: TwitterClient;
  logger: Logger;
  repository: Repository;
  copyWriter: CopyWriter;

  constructor(twitterClient: TwitterClient, repo: Repository) {
    this.twitterClient = twitterClient;
    this.logger = new Logger({ name: "TweetAtGpgaSqsTweetProcessor" });
    this.repository = repo;
    this.copyWriter = new CopyWriter();
  }

  async process(input: HandleIncomingTweetInput) {
    try {
      // TODO decide if its relevant / parsable.
      this.logger.info(
        JSON.stringify({
          message: "processing sqs record",
          eventType: "processingRecordTweetAtGpga",
          twitterUserId: input.twitterUserId,
          tweetId: input.tweetId,
          screenName: input.screenName,
        })
      );

      // parse tweet.

      // if unparsable then  reply with something else.

      // if parsable

      // get company(s) by name
      // const data = this.repository.getGpgForTwitterId(twitterUserId);
      // if (!data || !data.companyData) {
      //   this.logger.error(
      //     JSON.stringify({
      //       message: "error finding company",
      //       eventType: "errorGettingCompany",
      //       tweetId,
      //       twitterUserId,
      //       errorHandlingTweetAtGpga: 1,
      //       screenName,
      //     })
      //   );
      //   throw new Error(
      //     `could not find company. TwitterUserId: ${twitterUserId}, ${screenName}`
      //   );
      // }

      // build copy and stuff

      // const mostRecentGPG = getMostRecentMedianGPGOrThrow(data.companyData);

      // const copy =
      //   this.copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
      //     data.companyData
      //   );

      this.logger.info("would have tweeted for input:", input);
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
          tweetId: input.tweetId,
          twitterUserId: input.twitterUserId,
          screenName: input.screenName,
          // companyName: data.companyData.companyName,
          successfullySentTweet: 1,
        })
      );
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          message: "error sending tweet",
          eventType: "errorHandlingTweetAtGpga",
          tweetId: input.tweetId,
          twitterUserId: input.twitterUserId,
          screenName: input.screenName,
          errorHandlingTweetAtGpga: 1,
        })
      );
      throw error;
    }
  }
}
