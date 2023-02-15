import { TwitterClient as AlisTwitterClient } from "./Client";
import { TwitterClient } from 'twitter-api-client';
import dotEnv from "dotenv"

dotEnv.config()

const alisTwitterClient = new AlisTwitterClient()

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY as string,
    apiSecret: process.env.TWITTER_API_SECRET as string,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


export async function getUser(userName) {
    const users = await twitterClient.accountsAndUsers.usersSearch({ count: 10, q: userName });
    console.log(users)
}

const cliArg = process.argv[2]
const input = process.argv[3]

console.log(`calling:${cliArg} with: ${input}.`)
switch (cliArg) {
    case "getUser":
        getUser(input)
        break;

    default:
        throw new Error("invalid arg")
}