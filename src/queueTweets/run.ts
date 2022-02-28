import dotEnv from "dotenv"
import { SqsClient } from "../sqs/Client"
import { Logger } from "tslog"
import { TwitterClient } from "../twitter/Client"
import { IncomingTweetListenerQueuer } from "./IncomingTweetListenerQueuer"
import DataImporter from "../importData"

dotEnv.config()

const twitterClient = new TwitterClient()
const sqsClient = new SqsClient()
const dataImporter = new DataImporter()
const logger = new Logger()

const handler = new IncomingTweetListenerQueuer(twitterClient, sqsClient, dataImporter, logger)

const isTest = process.argv[2] === "test" || process.argv[3] === "test"

handler.listen(isTest)
