import dotEnv from "dotenv"
import DataImporter from '../importData'
import { TwitterClient } from 'twitter-api-client';
import { writeJsonFile } from "../utils/write.js";
import { getEnvVar } from "../utils/getEnvVar";
import { promptUser } from "../utils/promptUser";
const dataImporter = new DataImporter()

dotEnv.config()

const path = process.argv0
console.log(`Fixing data fro path ${path}. Continue?`)


// readfile 
// const companyDataProd = dataImporter.twitterUserDataProd()

const twitterClient = new TwitterClient({
    apiKey: getEnvVar('TWITTER_API_KEY'),
    apiSecret: getEnvVar('TWITTER_API_SECRET'),
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function run() {
    const shouldContinue = await promptUser('Continue?');

    if (shouldContinue !== 'y') {
        process.exit(0)
    }
    const dataToFix = dataImporter.readFile(path)

    const maxValue = 2147483647
    let numberOfErrors = 0
    const newCompanyData: any[] = []
    for (let index = 0; index < dataToFix.length; index++) {
        if (index % 100 === 0) {
            console.log(`${(index / dataToFix.length) * 100}%`)
        }
        const row = dataToFix[index];
        if (row.twitter_id_str) {
            newCompanyData.push(row)
            continue;
        }
        if (!row.twitter_id) {
            throw new Error(`no twitterID found ${JSON.stringify(row)}`)
        }
        let userIdStr = `${row.twitter_id}`
        if (row.twitter_id >= maxValue) {
            numberOfErrors++
            const user = await twitterClient.accountsAndUsers.usersLookup({ screen_name: row.twitter_screen_name })
            console.log(`Found ${row.companyName}, ${user[0].screen_name}, ID: ${user[0].id_str}.`)
            userIdStr = user[0].id_str
        }
        row.twitter_id_str = userIdStr
        newCompanyData.push(row)
    }

    await writeJsonFile(path, newCompanyData)
    console.log(`Number of items: ${newCompanyData}. Number of errors:${numberOfErrors}.`)
}

run()