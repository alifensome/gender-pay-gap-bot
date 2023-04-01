import { ListenerV2 } from "./ListenerV2";

import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { TwitterClient } from "../twitter/Client";
import { getEnvVar } from "../utils/getEnvVar";
import { SqsClient } from "../sqs/Client";
import { LambdaLogger } from "../lambdaLogger";
import { SearchQueryFormer } from "./searchQueryFormer";
import { config } from "dotenv";

config();

const dataImporter = new DataImporter();
const twitterClient = new TwitterClient();
const repo = new Repository(dataImporter);
const sqsClientTweetAtGpga = new SqsClient(getEnvVar("SQS_QUEUE_URL"));

/**
 * TODO
 * 1. pagination?
 * 2. Check the recent time/start time thing.
 */
export async function handler(): Promise<void> {
  const listenerV2 = new ListenerV2(
    twitterClient,
    sqsClientTweetAtGpga,
    repo,
    new LambdaLogger("listenerV2"),
    new SearchQueryFormer()
  );
  await listenerV2.run();
}
