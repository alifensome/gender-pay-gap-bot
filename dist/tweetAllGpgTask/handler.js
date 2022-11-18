"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const Client_1 = __importDefault(require("../dynamodb/Client"));
const importData_1 = __importDefault(require("../importData"));
const Repository_1 = require("../importData/Repository");
const LambdaClient_1 = require("../lambdaClient/LambdaClient");
const Client_2 = require("../twitter/Client");
const tweetAllGpgTask_1 = require("./tweetAllGpgTask");
const region = "eu-west-2";
const dataImporter = new importData_1.default();
const isTest = process.env.IS_TEST === "true";
const twitterClient = new Client_2.TwitterClient(isTest);
const repo = new Repository_1.Repository(dataImporter);
const tableName = process.env.TABLE_NAME;
const dynamoDbClient = new Client_1.default(tableName);
const lambdaClient = new LambdaClient_1.LambdaClient(region);
const processor = new tweetAllGpgTask_1.TweetAllGpgTask(twitterClient, repo, isTest, dynamoDbClient, lambdaClient);
function handler(event, context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield processor.sendNextTweet();
        return { ok: true };
    });
}
exports.handler = handler;
//# sourceMappingURL=handler.js.map