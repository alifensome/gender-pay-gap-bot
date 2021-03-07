import { createRequire } from "module"; // Bring in the ability to create the 'require' method
import { findUserByName } from "../twitter/findUserIds.js";
import fs from "fs"
import { wait } from "../utils/wait.js"
const require = createRequire(import.meta.url); // construct the require method
const companyData = require("../data/companies_GPG_Data.json") // use the require method

console.log("Starting...")

const isTest = false
const testNumber = 500
let found = 0
let notFound = 0
let percentageDone = 0
let percentageFound = 0
const number = isTest ? testNumber : companyData.length

const foundCompanies = []
const notFoundCompanies = []

let errorsInARow = 0

let startTime = new Date()

try {
    for (let index = 0; index < number; index++) {
        await wait()
        if (errorsInARow > 4) {
            console.log("Too many failures!!!")
            break;
        }
        if (index % 100 == 0) {
            percentageDone = (index / number) * 100
            percentageFound = (found / index) * 100
            console.log(`PercentageDone: ${percentageDone}%\nFound: ${found}\nNotFound: ${notFound}\nPercentageFound: ${percentageFound}%\n`)
        }
        const company = companyData[index];
        let user = null
        try {
            user = await findUserByName(company.companyName)
            errorsInARow = 0
        } catch (error) {
            console.log("Error while finding user for:", company)
            console.log(error)
            errorsInARow++
        }
        if (!user) {
            notFound++
            notFoundCompanies.push(company)
            continue
        }
        found++

        foundCompanies.push({
            twitter_id: user.id,
            twitter_name: user.name,
            twitter_screen_name: user.screen_name,
            ...company
        })
    }

    percentageFound = (found / number) * 100

    console.log(`\nComplete!!!\nFound:${found}\nNotFound:${notFound}\nPercentageFound: ${percentageFound}%\n`)

} catch (error) {
    console.log(`Threw error ${percentageDone}% through. Found: ${found}, Not found: ${notFound} `)
    console.log(error)
}

try {
    const date = new Date()
    const filePath = `./data/twitterAccountData/twitterUserData-${date.toISOString()}.json`
    const stream = fs.createWriteStream(filePath, { flags: 'w' });
    stream.write(JSON.stringify(foundCompanies), () => { console.log(`Wrote file: ${filePath}`) });

    const notFoundFilePath = `./data/twitterAccountData/twitterUserData-notFound-${date.toISOString()}.json`
    const notFoundStream = fs.createWriteStream(notFoundFilePath, { flags: 'w' });
    notFoundStream.write(JSON.stringify(notFoundCompanies), () => { console.log(`Wrote file: ${notFoundFilePath}`) });

    let finishingTime = new Date()
    console.log("Time taken:", (finishingTime - startTime) / (1000 * 60), " Minutes")

} catch (error) {
    console.log(`Threw error while writing fie.`)
    console.log(foundCompanies)
    console.log(error)
}