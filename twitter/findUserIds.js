import { TwitterClient } from 'twitter-api-client';
import dotenv from "dotenv"
import { isUkLocation } from '../utils/isUk.js';
import { getTextMatch } from '../utils/textMatch.js';

dotenv.config()

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function replaceSearchTerms(name) {
    return name.replace(" limited", "").replace(" Limited", "").replace(" LTD", "").replace(" Ltd", "").replace("(", "").replace(")", "").replace(/ *\([^)]*\) */g, "").replace(" uk", "").replace(" UK", "");
}

async function findUserByName(companyName) {
    const searchName = replaceSearchTerms(companyName);
    const users = await twitterClient.accountsAndUsers.usersSearch({ count: 10, q: searchName });
    for (let index = 0; index < users.length; index++) {
        const u = users[index];

        // If less than 30 followers then get rid of them
        if (u.followers_count < 30) {
            continue;
        }

        // if is not UK then continue
        const isUk = isUkLocation(u.location)
        if (!isUk) {
            continue;
        }

        // Check matching
        const wordMatch = getTextMatch(companyName, u.name)
        if (wordMatch < 0.5) {
            continue;
        }

        if (wordMatch > 0.85) {
            return u
        }

        // If verified and OK word match then return
        if (u.verified && wordMatch > 0.6) {
            console.log(`Found : ${u.name} - ${u.id} for ${companyName}.`);
            return u
        }
    }
    // Could not find user
    console.log(`Not found for: ${companyName}.`)
    printPotentialUsers(users)
    return null
}

function printPotentialUsers(users) {
    if (!users.length) {
        console.log("No data")
    }
    for (let index = 0; index < users.length; index++) {
        const u = users[index]
        console.log(`${index} - ${u.name} - ${u.id}`);
    }
}

export { findUserByName }
// const iwdTweets =  await twitterClient.tweets.search({ q : "international women's day ", count:1, })
// console.log(iwdTweets)


// TODO restrict search boundaries
// TODO look through tweets for userId
// TODO if found then tweet otherwise continue
// TODO record the last tweet max_id
// TODO search again
