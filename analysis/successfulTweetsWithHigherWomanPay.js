import { createRequire } from "module";
import { getCompanyDataByTwitterId } from "../twitter/getCompanyDataByTwitterId.js";
import { getMostRecentGPG } from "../utils.js";


const require = createRequire(import.meta.url); // construct the require method
const donkedData = require("../data/tweets/successfulTweetsWithCompanyData.json")

console.log("Total Donks:", donkedData.length)

const negativeGpg = []
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const gpg = getMostRecentGPG(d)
    if (typeof gpg == "string" && gpg.includes("-")) {
        negativeGpg.push(d)
    }
}

console.log("Negative Gpg:", negativeGpg.length)

// Most dramatic pay gap
let companyWithHighestGpg = null
let highestGpg = 0
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const gpg = getMostRecentGPG(d)
    if (typeof gpg == "string" && gpg.includes("-")) {
        continue
    }
    if (gpg > highestGpg) {
        companyWithHighestGpg = d
        highestGpg = gpg
    }
}

console.log("HighestGenderPayGap:", JSON.stringify(companyWithHighestGpg))