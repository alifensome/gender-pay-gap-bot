"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const parse_1 = require("../read/parse");
const write_1 = require("../utils/write");
const importer = new importData_1.default();
const twitterData = importer.twitterUserDataProd();
const newData = [];
for (let index = 0; index < twitterData.length; index++) {
    const item = twitterData[index];
    newData.push({
        twitter_id_str: item.twitter_id_str,
        twitter_id: item.twitter_id,
        twitter_name: item.twitter_name,
        twitter_screen_name: item.twitter_screen_name,
        companyName: item.companyName,
        companyNumber: (0, parse_1.parseCompanyNumber)(item.companyNumber), // 3509322,
    });
}
(0, write_1.writeJsonFile)("./src/dataFix/twitterUserData.json", newData);
//# sourceMappingURL=fixTwitterDataCompanyNumber.js.map