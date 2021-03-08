import dotEnv from "dotenv"
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import fs from "fs"
import { TwitterClient } from 'twitter-api-client';
import { writeJsonFile } from "../utils/write.js";

dotEnv.config()
const require = createRequire(import.meta.url); // construct the require method
let companyDataProd = require("../data/twitterAccountData/twitterUserData-prod.json")

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


const maxValue = 2147483647
let numberOfErrors = 0
const newCompanyData = []
for (let index = 0; index < companyDataProd.length; index++) {
    if (index % 100 == 0) {
        console.log(`${(index / companyDataProd.length) * 100}%`)
    }
    const row = companyDataProd[index];
    let userIdStr = `${row.twitter_id}`
    if (row.twitter_id > maxValue) {
        numberOfErrors++
        const user = await twitterClient.accountsAndUsers.usersLookup({ screen_name: row.twitter_screen_name })
        console.log("Found ", user[0].screen_name)
        userIdStr = user[0].id_str
    }
    newCompanyData.push({ twitter_id_str: userIdStr, ...row })
}

writeJsonFile("./dataFix/twitterIds.json", newCompanyData)
console.log(numberOfErrors)