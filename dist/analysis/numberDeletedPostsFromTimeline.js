"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const dataImporter = new importData_1.default();
const allTimeLineTweets = dataImporter.allTimeLineTweets();
const allQuotedStatusIds = [];
for (let index = 0; index < allTimeLineTweets.length; index++) {
    const tweet = allTimeLineTweets[index];
    if (tweet.quoted_status_id_str && !tweet.quoted_status) {
        allQuotedStatusIds.push(tweet.quoted_status_id_str);
    }
}
console.log("Deleted tweets:", allQuotedStatusIds.length);
// console.log(deletedTweets)
//# sourceMappingURL=numberDeletedPostsFromTimeline.js.map