"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Client_1 = require("../sqs/Client");
const tslog_1 = require("tslog");
const Client_2 = require("../twitter/Client");
const IncomingTweetListenerQueuer_1 = require("./IncomingTweetListenerQueuer");
const importData_1 = __importDefault(require("../importData"));
const Repository_1 = require("../importData/Repository");
const debug_1 = require("../utils/debug");
const logger = new tslog_1.Logger();
logger.info(JSON.stringify({
    message: `starting listener. Listening for words: ${JSON.stringify(IncomingTweetListenerQueuer_1.relevantWords)}`,
    eventType: "startingListener",
}));
dotenv_1.default.config();
const twitterClient = new Client_2.TwitterClient();
const sqsClient = new Client_1.SqsClient();
const dataImporter = new importData_1.default();
const repository = new Repository_1.Repository(dataImporter);
const handler = new IncomingTweetListenerQueuer_1.IncomingTweetListenerQueuer(twitterClient, sqsClient, dataImporter, repository, logger);
const isTest = (0, debug_1.isDebugMode)();
handler.listen(isTest);
//# sourceMappingURL=run.js.map