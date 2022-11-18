"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const getMostRecentGPG_1 = require("../utils/getMostRecentGPG");
const dataImporter = new importData_1.default();
const donkedData = dataImporter.successfulTweetsWithCompanyData();
console.log("Total Donks:", donkedData.length);
const negativeGpg = [];
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const gpg = (0, getMostRecentGPG_1.getMostRecentGPG)(d);
    if (typeof gpg == "string" && gpg.includes("-")) {
        negativeGpg.push(d);
    }
}
console.log("Negative Gpg:", negativeGpg.length);
// Most dramatic pay gap
let companyWithHighestGpg = null;
let highestGpg = 0;
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const gpg = (0, getMostRecentGPG_1.getMostRecentGPG)(d);
    if (typeof gpg == "string" && gpg.includes("-")) {
        continue;
    }
    if (gpg > highestGpg) {
        companyWithHighestGpg = d;
        highestGpg = gpg;
    }
}
console.log("HighestGenderPayGap:", JSON.stringify(companyWithHighestGpg));
//# sourceMappingURL=successfulTweetsWithHigherWomanPay.js.map