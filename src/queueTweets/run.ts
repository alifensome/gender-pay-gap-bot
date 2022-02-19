import dotEnv from "dotenv"
import { SqsClient } from "../sqs/Client"
import { Logger } from "tslog"
import { TwitterClient } from "../twitter/Client"

dotEnv.config()

const twitterClient = new TwitterClient()
const logger = new Logger()
const sqsClient = new SqsClient()

// TODO local config / handler here
// TODO Infra
// SET .ENV after making infra