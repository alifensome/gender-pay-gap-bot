"use strict";
// Find the accounts that blocked us.
// npm run build && node ./dist/analysis/findTwitterUsersStatus/run.js
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
const importData_1 = __importDefault(require("../../importData"));
const Repository_1 = require("../../importData/Repository");
const dotenv_1 = __importDefault(require("dotenv"));
const Client_1 = require("../../twitter/Client");
const tslog_1 = require("tslog");
const write_1 = require("../../utils/write");
dotenv_1.default.config();
const dataImporter = new importData_1.default();
const repo = new Repository_1.Repository(dataImporter);
repo.setData();
const twitterClient = new Client_1.TwitterClient();
const twitterData = repo.twitterUserData;
const logger = new tslog_1.Logger();
findBlockedForTwitterUserData();
function findBlockedForTwitterUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        const results = {};
        results["BLOCKED" /* BLOCKED */] = 0;
        results["NOT_FOUND" /* NOT_FOUND */] = 0;
        results["OK" /* OK */] = 0;
        results["UNKNOWN" /* UNKNOWN */] = 0;
        const totalItems = twitterData.length;
        const blockedUsers = [];
        for (let index = 0; index < twitterData.length; index++) {
            yield sleep(5000);
            const item = twitterData[index];
            if (index % 100 === 0) {
                console.log(`Current iteration: ${index}.\n${index * 100 / totalItems}% done.`);
            }
            const status = yield getBlockedStatus(item.twitter_screen_name);
            results[status]++;
            blockedUsers.push(Object.assign(Object.assign({}, item), { twitterUserBlockedStatus: status }));
        }
        logger.info({ results, totalItems, percentageBlocked: `${results["BLOCKED" /* BLOCKED */] * 100 / totalItems}%` });
        const filePath = "./data/twitterAccountData/twitterUserData-prod-withStatus.json";
        yield (0, write_1.writeJsonFile)(filePath, blockedUsers);
    });
}
function getBlockedStatus(screenName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield twitterClient.getUserTweetsByScreenName(screenName);
            return "OK" /* OK */;
        }
        catch (error) {
            const blockedStatus = parseErrorMessage(error);
            console.log({ error, screenName, blockedStatus });
            return blockedStatus;
        }
    });
}
function parseErrorMessage(error) {
    if (error.statusCode === 401) {
        if (error.data === `{"errors":[{"code":136,"message":"You have been blocked from viewing this user's profile."}]}`) {
            return "BLOCKED" /* BLOCKED */;
        }
        if (error.data === '{"request":"\\/1.1\\/statuses\\/user_timeline.json","error":"Not authorized."}') {
            return "NO_AVAILABLE" /* NO_AVAILABLE */;
        }
        throw Error(`Uncategorised error: ${JSON.stringify(error)}`);
    }
    if (error.statusCode === 404) {
        return "NOT_FOUND" /* NOT_FOUND */;
    }
    // Throttling 900 Req / 15 mins.
    if (error.statusCode === 429) {
        throw new Error("RATE LIMITED");
    }
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
//# sourceMappingURL=run.js.map