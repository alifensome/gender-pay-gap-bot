import { createRequire } from "module";
import { getAllCompanyDataByTwitterScreenName } from "../twitter/getCompanyDataByTwitterId.js";
import { writeJsonFile } from "../utils/write.js"

const require = createRequire(import.meta.url); // construct the require method
const donkedData = require("../data/tweets/successful-tweets.json")
const companies = require("../data/twitterAccountData/twitterUserData-prod.json")
console.log("Total Donks:", donkedData.length)

const joinedData = []
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const companyData = getAllCompanyDataByTwitterScreenName(d.twitter_screen_name, companies)
    if (!companyData || !companyData.length) {
        throw new Error(`No company Data for ${JSON.stringify(d)}`)
    }
    joinedData.push({ ...d, ...companyData[0] })
}

writeJsonFile("./data/tweets/successfulTweetsWithCompanyData.json", joinedData)