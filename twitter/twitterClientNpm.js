import { TwitterClient } from 'twitter-api-client';
import dotenv from "dotenv"
dotenv.config()

const twitterClient = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// // Search for a user
// const data = await twitterClient.accountsAndUsers.usersSearch({ q: 'twitterDev' });
// console.log(data)
// // Get message event by Id
//  data = await twitterClient.directMessages.directMessagesEventsShow({ id: '1234' });
//  console.log(data)

// // Get most recent 25 retweets of a tweet
//  data = await twitterClient.tweets.statusesRetweetsById({ id: '12345', count: 25 });
//  console.log(data)

// // Get local trends
//  data = await twitterClient.trends.trendsAvailable();

//  console.log(data)

const user = await twitterClient.accountsAndUsers.usersLookup({user_id:"1367415164795039747"})
console.log(user) 

// const iwdTweets =  await twitterClient.tweets.search({ q : "international women's day ", count:1, })
// console.log(iwdTweets)


// TODO restrict search boundaries
// TODO look through tweets for userId
// TODO if found then tweet otherwise continue
// TODO record the last tweet max_id
// TODO search again
