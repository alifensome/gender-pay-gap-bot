import Twit from "twit"
import dotEnv from "dotenv"
dotEnv.config()


var T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
var stream = T.stream('statuses/filter', { follow: ['1367415164795039747'] });

stream.on('tweet', function (tweet) {
    console.log('@' + tweet.user.screen_name + ':::' + tweet.text);
    // console.log(tweet)
    quoteTweet(T, "One day of action is not enough.", tweet).then(() => {
        console.log("Successful tweet @", tweet.user.name)
        process.exit(0)
    }).catch((err) => {
        console.log("Error while tweeting @", tweet.user.name)
        console.log(err)
        process.exit(-1)
    })

});

function postTweet(T, tweet) {
    return new Promise((resolve, reject) => {

        T.post('statuses/update', { status: tweet }, (err) => {
            if (err) { return reject(err) }
            return resolve({ status: 'Tweet sent' })
        })
    })
}
// https://stackoverflow.com/questions/31373259/how-to-find-all-retweet-with-comments-for-a-particular-tweet-using-api
function quoteTweet(T, tweet, quoted_status) {
    return new Promise((resolve, reject) => {

        T.post('statuses/retweet/' + quoted_status.id_str, { status: tweet, quoted_status, quoted_status_id: quoted_status.id_str }, (err) => {
            if (err) { return reject(err) }
            return resolve({ status: 'Tweet sent' })
        })
    })
}

function reTweet(T, tweetId, tweet, quoted_status) {
    return new Promise((resolve, reject) => {

        T.post('statuses/retweet/' + tweetId, { status: tweet, quoted_status }, (err) => {
            if (err) { return reject(err) }
            return resolve({ status: 'Tweet sent' })
        })
    })
}


