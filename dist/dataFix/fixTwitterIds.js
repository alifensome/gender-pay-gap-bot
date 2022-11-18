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
const dotenv_1 = __importDefault(require("dotenv"));
const importData_1 = __importDefault(require("../importData"));
const twitter_api_client_1 = require("twitter-api-client");
const write_js_1 = require("../utils/write.js");
const dataImporter = new importData_1.default();
dotenv_1.default.config();
const companyDataProd = dataImporter.twitterUserDataProd();
const twitterClient = new twitter_api_client_1.TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const maxValue = 2147483647;
        let numberOfErrors = 0;
        const newCompanyData = [];
        for (let index = 0; index < companyDataProd.length; index++) {
            if (index % 100 === 0) {
                console.log(`${(index / companyDataProd.length) * 100}%`);
            }
            const row = companyDataProd[index];
            let userIdStr = `${row.twitter_id}`;
            if (row.twitter_id > maxValue) {
                numberOfErrors++;
                const user = yield twitterClient.accountsAndUsers.usersLookup({ screen_name: row.twitter_screen_name });
                console.log("Found ", user[0].screen_name);
                userIdStr = user[0].id_str;
            }
            newCompanyData.push(Object.assign({ twitter_id_str: userIdStr }, row));
        }
        (0, write_js_1.writeJsonFile)("./dataFix/twitterIds.json", newCompanyData);
        console.log(numberOfErrors);
    });
}
run();
//# sourceMappingURL=fixTwitterIds.js.map