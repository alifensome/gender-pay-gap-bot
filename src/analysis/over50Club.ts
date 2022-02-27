import dotEnv from "dotenv"
import DataImporter from '../importData'
import { getMostRecentGPG } from "../utils/getMostRecentGPG"
import { writeJsonFile } from "../utils/write";
const dataImporter = new DataImporter()



dotEnv.config()

let companyDataProd = dataImporter.twitterUserDataProd()

const theBadOnes = []
for (let index = 0; index < companyDataProd.length; index++) {
    const company = companyDataProd[index];
    const mostRecentGPG = getMostRecentGPG(company as any)
    if (typeof mostRecentGPG == "string") {
        continue
    }

    if (mostRecentGPG > 50) {
        theBadOnes.push(company)
    }
}

theBadOnes.sort((a, b) => {
    const mostRecentGPGA = getMostRecentGPG(a)
    const mostRecentGPGB = getMostRecentGPG(b)
    return mostRecentGPGB - mostRecentGPGA
})

console.log(theBadOnes)
console.log(theBadOnes.length)
writeJsonFile("./data/over-50s.json", theBadOnes)