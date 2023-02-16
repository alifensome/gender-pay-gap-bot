import { TwitterClient } from 'twitter-api-client';
import dotenv from "dotenv"
dotenv.config()

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY as string,
    apiSecret: process.env.TWITTER_API_SECRET as string,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export async function getCompanyDeletedTweets(twitterIds: string[]): Promise<string[]> {
    const listOfListTwitterIds = truncate<string>(twitterIds)
    printMatrix(listOfListTwitterIds);

    const allDeletedStatuses: string[] = []
    for (let index = 0; index < listOfListTwitterIds.length; index++) {
        const listOfTwitterIds = listOfListTwitterIds[index];
        const ids = listOfTwitterIds.join(",")
        const statuses = await twitterClient.tweets.statusesLookup({ id: ids, map: true }) as any
        for (const key in statuses.id) {
            const value = statuses.id[key]
            if (value == null) {
                allDeletedStatuses.push(key)
            }
        }
    }
    return allDeletedStatuses
}

function printMatrix(listOfListTwitterIds: string[][]) {
    for (let index = 0; index < listOfListTwitterIds.length; index++) {
        const l = listOfListTwitterIds[index];
        console.log(l.length);
    }
}

function truncate<T>(list: T[], items = 100): T[][] {
    const matrix: T[][] = []
    let attempts = 0
    while (attempts < 50) {
        attempts++
        if (list.length == 0) {
            break
        }
        matrix.push(list.slice(0, items))
        list.splice(0, items);
    }
    return matrix
}