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
const importData_1 = __importDefault(require("../importData"));
const Repository_1 = require("../importData/Repository");
const Client_1 = require("../twitter/Client");
const SqsTweetProcessor_1 = require("./SqsTweetProcessor");
const dataImporter = new importData_1.default();
const twitterClient = new Client_1.TwitterClient();
const repo = new Repository_1.Repository(dataImporter);
const envMinGpg = process.env.MIN_GPG;
const minGpg = parseMinGpg(envMinGpg);
const processor = new SqsTweetProcessor_1.SqsTweetProcessor(twitterClient, repo, minGpg);
function handler(event, context) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < event.Records.length; index++) {
            const record = event.Records[index];
            const { body } = record;
            const parsedBody = JSON.parse(body);
            const input = { twitterUserId: parsedBody.twitterUserId, tweetId: parsedBody.tweetId, screenName: parsedBody.screenName };
            yield processor.process(input);
        }
        return {};
    });
}
exports.handler = handler;
function parseMinGpg(minGpgFromEnv) {
    try {
        let parsedMinGpg = null;
        if (minGpgFromEnv) {
            parsedMinGpg = parseFloat(minGpgFromEnv);
        }
        return parsedMinGpg;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
//# sourceMappingURL=handler.js.map