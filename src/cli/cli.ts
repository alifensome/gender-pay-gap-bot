import dotEnv from "dotenv";
import { SqsClient } from "../sqs/Client";
import { Logger } from "tslog";
import { TwitterClient } from "../twitter/Client";
import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { isDebugMode } from "../utils/debug";
import { program } from "commander";

dotEnv.config();

const twitterClient = new TwitterClient();

program.option("--action <action>").option("--arg1 <arg1>");

program.parse();

const options = program.opts();
const logger = new Logger();
logger.info("starting cli...");

const action = options.action;
const arg1 = options.arg1;

async function main() {
  switch (action) {
    case "getTweets":
      const result = await twitterClient.getUserTweetsByScreenName(arg1);
      console.log(result);
      break;

    default:
      throw new Error(`not valid action ${action}`);
  }
}

main();
