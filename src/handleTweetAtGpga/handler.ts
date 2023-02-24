import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { TwitterClient } from "../twitter/Client";
import { SqsTweetProcessor } from "./SqsTweetProcessor";

const dataImporter = new DataImporter()
const twitterClient = new TwitterClient()
const repo = new Repository(dataImporter)
const envMinGpg = process.env.MIN_GPG
const minGpg = parseMinGpg(envMinGpg);
const processor = new SqsTweetProcessor(twitterClient, repo, minGpg)


export async function handler(event: any, context: any) {
    for (let index = 0; index < event.Records.length; index++) {
        const record = event.Records[index];
        const { body } = record;
        const parsedBody = JSON.parse(body) as HandleIncomingTweetInput
        const input = { twitterUserId: parsedBody.twitterUserId, tweetId: parsedBody.tweetId, screenName: parsedBody.screenName }
        await processor.process(input)
    }
    return {};
}

function parseMinGpg(minGpgFromEnv: string | undefined): number | null {
    try {
        let parsedMinGpg: number | null = null;
        if (minGpgFromEnv) {
            parsedMinGpg = parseFloat(minGpgFromEnv);
        }
        return parsedMinGpg;
    } catch (error) {
        console.log(error)
        return null
    }
}