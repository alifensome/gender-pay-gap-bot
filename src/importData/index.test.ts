import DataImporter from "."

describe("dataImporter", () => {
    const dataImporter = new DataImporter()
    dataImporter.readFile = jest.fn()
    it.each([
        [() => dataImporter.companiesGpgData(), "./data/companies_GPG_Data.json"],
        [() => dataImporter.allTimeLineTweets(), "./data/companies_GPG_Data.json"],
        [() => dataImporter.companiesGpgDataTest(), "./data/companies_GPG_Data-test.json"],
        [() => dataImporter.successfulTweets(), "./data/tweets/successful-tweets.json"],
        [() => dataImporter.twitterUserDataProd(), "./data/twitterAccountData/twitterUserData-prod.json"],
        [() => dataImporter.twitterUserDataTest(), "./data/twitterAccountData/twitterUserData-test.json"],
        [() => dataImporter.allTimeLineTweets(), "./data/tweets/allTimeLineTweets.json"],
        [() => dataImporter.successfulTweetsWithCompanyData(), "./data/tweets/successfulTweetsWithCompanyData.json"],
        [() => dataImporter.unsuccessfulTweets(), "./data/tweets/unsuccessful-tweets.json"],
        [() => dataImporter.gpg_2021_2022(), "./data/gpg_2021_2022.json"],
        [() => dataImporter.gpg_2020_2021(), "./data/gpg_2020_2021.json"],
        [() => dataImporter.gpg_2019_2020(), "./data/gpg_2019_2020.json"],
        [() => dataImporter.gpg_2018_2019(), "./data/gpg_2018_2019.json"],
        [() => dataImporter.gpg_2017_2018(), "./data/gpg_2017_2018.json"],
        [() => dataImporter.companyDataJoinedTweets(), "./data/companyDataJoinedWithTweets.json"],
    ])("should import the correct file", (f, expectedFilePath) => {
        f()
        expect(dataImporter.readFile).toBeCalledWith(expectedFilePath)
    })
})