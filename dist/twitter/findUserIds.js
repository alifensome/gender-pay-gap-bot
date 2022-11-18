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
exports.findUserByName = void 0;
const twitter_api_client_1 = require("twitter-api-client");
const dotenv_1 = __importDefault(require("dotenv"));
const isUk_1 = require("../utils/isUk");
const textMatch_1 = require("../utils/textMatch");
dotenv_1.default.config();
const twitterClient = new twitter_api_client_1.TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
function replaceSearchTerms(name) {
    return name.replace(" limited", "").replace(" Limited", "").replace(" LTD", "").replace(" Ltd", "").replace("(", "").replace(")", "").replace(/ *\([^)]*\) */g, "").replace(" uk", "").replace(" UK", "");
}
function findUserByName(companyName) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchName = replaceSearchTerms(companyName);
        const users = yield twitterClient.accountsAndUsers.usersSearch({ count: 10, q: searchName });
        for (let index = 0; index < users.length; index++) {
            const u = users[index];
            // If less than 30 followers then get rid of them
            if (u.followers_count < 30) {
                continue;
            }
            // if is not UK then continue
            const isUk = (0, isUk_1.isUkLocation)(u.location);
            if (!isUk) {
                continue;
            }
            // Check matching
            const wordMatch = (0, textMatch_1.getTextMatch)(companyName, u.name);
            if (wordMatch < 0.5) {
                continue;
            }
            if (wordMatch > 0.85) {
                return u;
            }
            // If verified and OK word match then return
            if (u.verified && wordMatch > 0.6) {
                console.log(`Found : ${u.name} - ${u.id} for ${companyName}.`);
                return u;
            }
        }
        // Could not find user
        console.log(`Not found for: ${companyName}.`);
        printPotentialUsers(users);
        return null;
    });
}
exports.findUserByName = findUserByName;
function printPotentialUsers(users) {
    if (!users.length) {
        console.log("No data");
    }
    for (let index = 0; index < users.length; index++) {
        const u = users[index];
        console.log(`${index} - ${u.name} - ${u.id}`);
    }
}
//# sourceMappingURL=findUserIds.js.map