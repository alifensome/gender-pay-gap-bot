import { Repository } from "../../importData/Repository";

import DataImporter from "../../importData";
import { getMostRecentMedianGPGOrThrow } from '../../utils/getMostRecentGPG';
import { writeJsonFile } from "../../utils/write";
import { CompanyDataMultiYearItem } from "../../types";

const importer = new DataImporter();
const repo = new Repository(importer);
repo.setData();
let notFound = 0;
let found = 0;
const notFoundData: CompanyDataMultiYearItem[] = [];
for (let index = 0; index < repo.companiesGpgData.length; index++) {
  const companyData = repo.companiesGpgData[index];
  const twitterUser = repo.getTwitterUserByCompanyData(
    companyData.companyName,
    companyData.companyNumber
  );
  if (!twitterUser) {
    notFoundData.push(companyData);
    notFound++;
    console.log(`Not found: ${companyData.companyName}`);
  } else {
    console.log(`Found: ${companyData.companyName}`);
    found++;
  }
}

console.log(`Total Found: ${found}.\nNot Found: ${notFound}`);

notFoundData.sort(
  (a: CompanyDataMultiYearItem, b: CompanyDataMultiYearItem) =>
    getMostRecentMedianGPGOrThrow(b) - getMostRecentMedianGPGOrThrow(a)
);
const filePath = "./data/companyDataWithNoTwitterData.json";
writeJsonFile(filePath, notFoundData);
