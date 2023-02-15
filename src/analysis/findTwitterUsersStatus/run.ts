// Find the accounts that blocked us.
// npm run build && node ./dist/analysis/findTwitterUsersStatus/run.js

import DataImporter from "../../importData";
import { Repository } from "../../importData/Repository";
import dotenv from 'dotenv'
import { TwitterClient } from "../../twitter/Client";
import { Logger } from "tslog";
import { writeJsonFile } from "../../utils/write";
dotenv.config()

const dataImporter = new DataImporter()
const repo = new Repository(dataImporter)
repo.setData()

const twitterClient = new TwitterClient()
const twitterData = repo.twitterUserData
const logger = new Logger()

findBlockedForTwitterUserData();

async function findBlockedForTwitterUserData() {
    const results = {}
    results[TwitterUserBlockedStatus.BLOCKED] = 0
    results[TwitterUserBlockedStatus.NOT_FOUND] = 0
    results[TwitterUserBlockedStatus.OK] = 0
    results[TwitterUserBlockedStatus.UNKNOWN] = 0
    const totalItems = twitterData.length
    const blockedUsers: any[] = []

    for (let index = 0; index < twitterData.length; index++) {
        await sleep(5000)
        const item = twitterData[index];
        if (index % 100 === 0) {
            console.log(`Current iteration: ${index}.\n${index * 100 / totalItems}% done.`)
        }
        const status = await getBlockedStatus(item.twitter_screen_name)
        results[status]++
        blockedUsers.push({ ...item, twitterUserBlockedStatus: status })
    }

    logger.info({ results, totalItems, percentageBlocked: `${results[TwitterUserBlockedStatus.BLOCKED] * 100 / totalItems}%` })
    const filePath = "./data/twitterAccountData/twitterUserData-prod-withStatus.json"
    await writeJsonFile(filePath, blockedUsers)
}

export const enum TwitterUserBlockedStatus {
    OK = "OK",
    BLOCKED = "BLOCKED",
    NOT_FOUND = "NOT_FOUND",
    NO_AVAILABLE = "NO_AVAILABLE",
    UNKNOWN = "UNKNOWN"
}
async function getBlockedStatus(screenName: string): Promise<TwitterUserBlockedStatus> {
    try {
        await twitterClient.getUserTweetsByScreenName(screenName);
        return TwitterUserBlockedStatus.OK
    } catch (error) {
        const blockedStatus = parseErrorMessage(error)
        console.log({ error, screenName, blockedStatus })
        return blockedStatus
    }
}

function parseErrorMessage(error: any): TwitterUserBlockedStatus {
    if (error.statusCode === 401) {
        if (error.data === `{"errors":[{"code":136,"message":"You have been blocked from viewing this user's profile."}]}`) {
            return TwitterUserBlockedStatus.BLOCKED
        }
        if (error.data === '{"request":"\\/1.1\\/statuses\\/user_timeline.json","error":"Not authorized."}') {
            return TwitterUserBlockedStatus.NO_AVAILABLE
        }
        throw Error(`Uncategorised error: ${JSON.stringify(error)}`)
    }
    if (error.statusCode === 404) {
        return TwitterUserBlockedStatus.NOT_FOUND
    }
    // Throttling 900 Req / 15 mins.
    if (error.statusCode === 429) {
        throw new Error("RATE LIMITED")
    }
    return TwitterUserBlockedStatus.OK
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}