import { Repository } from '../../importData/Repository'

import DataImporter from "../../importData";

const importer = new DataImporter()
const repo = new Repository(importer)
repo.setData()

for (let index = 0; index < repo.companiesGpgData.length; index++) {
    const twitterUser = repo.twitterUserData[index];
    const companyData = repo.getTwitterUserByCompanyData(twitterUser.companyName, twitterUser.companyNumber)
    if (!companyData) {
        console.log(twitterUser.companyName, twitterUser)
        throw new Error("no data for " + JSON.stringify(twitterUser))
    }
    if (companyData.companyNumber !== twitterUser.companyNumber) {
        console.log(companyData.companyName)
    }
    // expect(companyData.companyName.toUpperCase()).toEqual(twitterUser.companyName.toUpperCase())
    expect(companyData.companyNumber).toEqual(twitterUser.companyNumber)
}