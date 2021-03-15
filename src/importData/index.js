import require from "./require.js";

class Data {
    companiesGpgData() {
        return require("../../data/companies_GPG_Data.json")
    }
    successfulTweets() {
        return require("../../data/tweets/successful-tweets.json")
    }
    twitterUserDataProd() {
        return require("../../data/twitterAccountData/twitterUserData-prod.json")
    }
    allTimeLineTweets() {
        return require("../../data/tweets/allTimeLineTweets.json")
    }
    successfulTweetsWithCompanyData() {
        return require("../../data/tweets/successfulTweetsWithCompanyData.json")
    }
    twitterUserDataTest() {
        return require("../../data/twitterAccountData/twitterUserData-test.json")
    }
    unsuccessfulTweets() {
        return require("../../data/tweets/unsuccessful-tweets.json")
    }
}

export default Data