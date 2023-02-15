import { StatusesUserTimeline, TwitterClient } from 'twitter-api-client';
import dotenv from "dotenv"
import { writeJsonFile } from '../utils/write.js';
import BigInt from "../bigInt/bigInt.js"
dotenv.config()

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY as string,
    apiSecret: process.env.TWITTER_API_SECRET as string,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
async function run() {

    let max_id = "1369758162807586816"
    let allTimeLineTweets: StatusesUserTimeline[] = []
    while (true) {
        const timeLine = await twitterClient.tweets.statusesUserTimeline({ user_id: "1367415164795039747", count: 1000, max_id, trim_user: true })
        if (!timeLine.length) {
            break
        }
        allTimeLineTweets = allTimeLineTweets.concat(timeLine)
        const lastTweetId = timeLine[timeLine.length - 1].id_str
        const bi = new BigInt(lastTweetId)
        bi.minusOne()
        max_id = bi.toString()
    }

    console.log("Count: ", allTimeLineTweets.length)
    await writeJsonFile("./data/tweets/allTimeLineTweets.json", allTimeLineTweets)

    for (let index = 0; index < allTimeLineTweets.length; index++) {
        const post = allTimeLineTweets[index];
        console.log(index, " - ", post?.id_str, " QuotedStatusId:", post.quoted_status_id_str, "\n")
    }
}

run()