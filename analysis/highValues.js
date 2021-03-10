import { createRequire } from "module";
import { getMostRecentGPG } from "../utils.js"
import { getAllCompanyDataByTwitterScreenName } from "../twitter/getCompanyDataByTwitterId.js";
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

    const hasBeenDonked = getDonkedByCompanyName(company.companyName, donkedData, companyDataWithTwitter)
    if (hasBeenDonked) {
        continue
    }

    highValueNotTweeted.push(company)
}

const filePath = "./data/high-value-not-tweeted.json"
await writeJsonFile(filePath, highValueNotTweeted)

function getDonkedByCompanyName(companyName, donkedData, companyDataWithTwitter) {
    for (let index = 0; index < donkedData.length; index++) {
        const d = donkedData[index];
        const companiesByTwitterName = getAllCompanyDataByTwitterScreenName(d.twitter_screen_name, companyDataWithTwitter)
        if (!companiesByTwitterName || !companiesByTwitterName.length) {
            continue
        }

        for (let index = 0; index < companiesByTwitterName.length; index++) {
            const companyByTwitterName = companiesByTwitterName[index];
            if (companyName.toLowerCase() == companyByTwitterName.companyName?.toLowerCase()) {
                console.log("Skipping Company:", companyName, "Twitter name", companyByTwitterName?.companyName)
                return d
            }
        }

    }
    return null
}