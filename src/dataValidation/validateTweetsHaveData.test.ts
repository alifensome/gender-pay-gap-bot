import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { CompanyDataMultiYearItem } from "../types";

const importer = new DataImporter()
const repo = new Repository(importer)
repo.setData()

it("All twitter data should have a valid company", () => {
    const brokenTwitterCompanyIds: CompanyDataMultiYearItem[] = []
    for (let index = 0; index < repo.twitterUserData.length; index++) {
        const twitterUser = repo.twitterUserData[index];
        const companyData = repo.getCompany(twitterUser.companyName, twitterUser.companyNumber)
        if (!companyData) {
            console.log(twitterUser.companyName, twitterUser)
            throw new Error("no data for " + JSON.stringify(twitterUser))
        }
        if (companyData.companyNumber !== twitterUser.companyNumber) {
            console.log(companyData.companyName)
            brokenTwitterCompanyIds.push(companyData)
        }
    }
    // There should be no broken twitter-company links!
    const expectedBroken = []
    expect(brokenTwitterCompanyIds).toEqual(expectedBroken)
})