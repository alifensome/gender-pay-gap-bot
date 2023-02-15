import DataImporter from '../importData'
import { getMostRecentMeanGPG } from "../utils/getMostRecentGPG";
const dataImporter = new DataImporter()

const donkedData = dataImporter.successfulTweetsWithCompanyData()

console.log("Total Donks:", donkedData.length)

const negativeGpg: any[] = []
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const gpg = getMostRecentMeanGPG(d) as any
    if (typeof gpg == "string" && gpg.includes("-")) {
        negativeGpg.push(d)
    }
}

console.log("Negative Gpg:", negativeGpg.length)

// Most dramatic pay gap
let companyWithHighestGpg = null
let highestGpg = 0
for (let index = 0; index < donkedData.length; index++) {
    const d = donkedData[index];
    const gpg = getMostRecentMeanGPG(d) as any
    if (typeof gpg == "string" && gpg.includes("-")) {
        continue
    }
    if (gpg > highestGpg) {
        companyWithHighestGpg = d
        highestGpg = gpg
    }
}

console.log("HighestGenderPayGap:", JSON.stringify(companyWithHighestGpg))