import { Repository } from '../../importData/Repository'

import DataImporter, { CompanyDataItem } from "../../importData";
import { getMostRecentMedianGPG } from '../../utils/getMostRecentGPG';
import { writeJsonFile } from '../../utils/write';

const importer = new DataImporter()
const repo = new Repository(importer)
repo.setData()
let notFound = 0
let found = 0
const notFoundData = []
for (let index = 0; index < repo.companiesGpgData.length; index++) {
    const companyData = repo.companiesGpgData[index];
    const twitterUser = repo.getTwitterUserByCompanyData(companyData.companyName, companyData.companyNumber)
    if (!twitterUser) {
        notFoundData.push(companyData)
        notFound++
        console.log(`Not found: ${companyData.companyName}`)
    } else {
        console.log(`Found: ${companyData.companyName}`)
        found++
    }
}

console.log(`Total Found: ${found}.\nNot Found: ${notFound}`)

notFoundData.sort((a: CompanyDataItem, b: CompanyDataItem) => getMostRecentMedianGPG(b) - getMostRecentMedianGPG(a))
const filePath = "./data/companyDataWithNoTwitterData.json"
writeJsonFile(filePath, notFoundData)