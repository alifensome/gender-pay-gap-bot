
export class TwitterCredentialGetter {
    getCredentials(isReadAccount: boolean = false) {
        if (isReadAccount) {
            return {
                consumerKey: process.env.TWITTER_READ_ACCOUNT_API_KEY,
                consumerSecret: process.env.TWITTER_READ_ACCOUNT_API_SECRET,
                accessToken: process.env.TWITTER_READ_ACCOUNT_ACCESS_TOKEN,
                accessTokenSecret: process.env.TWITTER_READ_ACCOUNT_ACCESS_TOKEN_SECRET,
            }

        } else {
            return {
                consumerKey: process.env.TWITTER_API_KEY,
                consumerSecret: process.env.TWITTER_API_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            }

        }
    }
}
