import { createRequire } from "module";
import { getMostRecentGPG } from "../utils.js"
import { getCompanyDataByTwitterScreenName } from "../twitter/getCompanyDataByTwitterId.js";
import { writeJsonFile } from "../utils/write.js";

const require = createRequire(import.meta.url); // construct the require method
const data = require("../data/companies_GPG_Data.json")
const donkedData = require("../data/tweets/successful-tweets.json")
const companyDataWithTwitter = require("../data/twitterAccountData/twitterUserData-prod.json")

const highValueNotTweeted = []
for (let index = 0; index < data.length; index++) {
    const company = data[index];
    let gpg = getMostRecentGPG(company)
    if (!gpg || gpg < 50) {
        continue;
    }

    for (let index = 0; index < donkedData.length; index++) {
        const d = donkedData[index];

        const companyByTitterName = getCompanyDataByTwitterScreenName(d.twitter_screen_name, companyDataWithTwitter)
        if (!companyByTitterName || companyByTitterName.companyName == company.companyName) {
            continue
        }
    }
    highValueNotTweeted.push(company)
}

const filePath = "./data/high-value-not-tweeted.json"
await writeJsonFile(filePath, highValueNotTweeted)