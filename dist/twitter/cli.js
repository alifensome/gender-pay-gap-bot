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
exports.getUser = void 0;
const Client_1 = require("./Client");
const twitter_api_client_1 = require("twitter-api-client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const alisTwitterClient = new Client_1.TwitterClient();
const twitterClient = new twitter_api_client_1.TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
function getUser(userName) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield twitterClient.accountsAndUsers.usersSearch({ count: 10, q: userName });
        console.log(users);
    });
}
exports.getUser = getUser;
const cliArg = process.argv[2];
const input = process.argv[3];
console.log(`calling:${cliArg} with: ${input}.`);
switch (cliArg) {
    case "getUser":
        getUser(input);
        break;
    default:
        throw new Error("invalid arg");
}
//# sourceMappingURL=cli.js.map