import Twit from "twit"
import dotEnv from "dotenv"
dotEnv.config()

var T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
var stream = T.stream('statuses/filter', { follow:  ['1367415164795039747'] });

stream.on('tweet', function (tweet) {
    console.log('@' + tweet.user.screen_name + ':::' + tweet.text);
});

