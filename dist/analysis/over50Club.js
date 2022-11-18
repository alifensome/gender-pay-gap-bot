"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const importData_1 = __importDefault(require("../importData"));
const getMostRecentGPG_1 = require("../utils/getMostRecentGPG");
const write_1 = require("../utils/write");
const dataImporter = new importData_1.default();
dotenv_1.default.config();
let companyDataProd = dataImporter.twitterUserDataProd();
const theBadOnes = [];
for (let index = 0; index < companyDataProd.length; index++) {
    const company = companyDataProd[index];
    const mostRecentGPG = (0, getMostRecentGPG_1.getMostRecentGPG)(company);
    if (typeof mostRecentGPG == "string") {
        continue;
    }
    if (mostRecentGPG > 50) {
        theBadOnes.push(company);
    }
}
theBadOnes.sort((a, b) => {
    const mostRecentGPGA = (0, getMostRecentGPG_1.getMostRecentGPG)(a);
    const mostRecentGPGB = (0, getMostRecentGPG_1.getMostRecentGPG)(b);
    return mostRecentGPGB - mostRecentGPGA;
});
console.log(theBadOnes);
console.log(theBadOnes.length);
(0, write_1.writeJsonFile)("./data/over-50s.json", theBadOnes);
//# sourceMappingURL=over50Club.js.map