import dotEnv from "dotenv";
import DataImporter from "../importData";
import { TwitterData } from "../types";
import { getMostRecentMeanGPGOrThrow } from "../utils/getMostRecentGPG";
import { writeJsonFile } from "../utils/write";
const dataImporter = new DataImporter();

dotEnv.config();

let companyDataProd = dataImporter.twitterUserDataProdLocal();

const theBadOnes: TwitterData[] = [];
for (let index = 0; index < companyDataProd.length; index++) {
  const company = companyDataProd[index];
  const mostRecentGPG = getMostRecentMeanGPGOrThrow(company as any);
  if (typeof mostRecentGPG == "string") {
    continue;
  }

  if (mostRecentGPG > 50) {
    theBadOnes.push(company);
  }
}

theBadOnes.sort((a, b) => {
  const mostRecentGPGA = getMostRecentMeanGPGOrThrow(a as any);
  const mostRecentGPGB = getMostRecentMeanGPGOrThrow(b as any);
  return mostRecentGPGB - mostRecentGPGA;
});

console.log(theBadOnes);
console.log(theBadOnes.length);
writeJsonFile("./data/over-50s.json", theBadOnes);
