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
const tslog_1 = require("tslog");
const Client_1 = require("../twitter/Client");
const commander_1 = require("commander");
dotenv_1.default.config();
const twitterClient = new Client_1.TwitterClient();
commander_1.program.option("--action <action>").option("--arg1 <arg1>");
commander_1.program.parse();
const options = commander_1.program.opts();
const logger = new tslog_1.Logger();
logger.info("starting cli...");
const action = options.action;
const arg1 = options.arg1;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        switch (action) {
            case "getTweets":
                const result = yield twitterClient.getUserTweetsByScreenName(arg1);
                console.log(result);
                break;
            default:
                throw new Error(`not valid action ${action}`);
        }
    });
}
main();
//# sourceMappingURL=cli.js.map