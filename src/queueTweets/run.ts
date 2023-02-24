import dotEnv from "dotenv";
import { SqsClient } from "../sqs/Client";
import { Logger } from "tslog";
import { TwitterClient } from "../twitter/Client";
import { IncomingTweetListenerQueuer } from "./IncomingTweetListenerQueuer";
import { relevantWords } from "./relevantWords";
import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { isDebugMode } from "../utils/debug";
import { getEnvVar } from "../utils/getEnvVar";

const logger = new Logger();

logger.info("Started listening at time: " + new Date().toISOString());

logger.info(
  JSON.stringify({
    message: `starting listener. Listening for words: ${JSON.stringify(
      relevantWords
    )}`,
    eventType: "startingListener",
  })
);
dotEnv.config();

const twitterClient = new TwitterClient();
const sqsClient = new SqsClient();
const sqsClientTweetAtGpga = new SqsClient(
  getEnvVar("TWEET_AT_GPGA_SQS_QUEUE_URL")
);
const dataImporter = new DataImporter();
const repository = new Repository(dataImporter);

const handler = new IncomingTweetListenerQueuer(
  twitterClient,
  sqsClient,
  sqsClientTweetAtGpga,
  dataImporter,
  repository,
  logger
);

const isTest = isDebugMode();

handler.listen(isTest);
