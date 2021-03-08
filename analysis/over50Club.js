import dotEnv from "dotenv"
import { createRequire } from "module";
import { getMostRecentGPG } from "../utils.js"
import { writeJsonFile } from "../utils/write.js";



dotEnv.config()

const require = createRequire(import.meta.url); // construct the require method
let companyDataProd = require("../data/twitterAccountData/twitterUserData-prod.json")

const theBadOnes = []
for (let index = 0; index < companyDataProd.length; index++) {
    const company = companyDataProd[index];
    const mostRecentGPG = getMostRecentGPG(company)
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