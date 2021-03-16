import { writeJsonFile } from "../utils/write.js";
import { parseDataFromJsonXlsx } from "./getData.js.js"
import require from "../importData/require"

const json2021 = require("../data/gpg_2020_2021")
const json2020 = require("../data/gpg_2019_2020")
const json2019 = require("../data/gpg_2018_2019")
const json2018 = require("../data/gpg_2017_2018")

getAllData().then(() => console.log("Finished!!!"))

async function getAllData() {
    console.log("Started reading data from 2020_2021")
    const data_2020_2021 = await parseDataFromJsonXlsx(json2021)
    console.log("Finished reading data from 2020_2021")

    console.log("Started reading data from 2019_2020")
    const data_2019_2020 = await parseDataFromJsonXlsx(json2020)
    console.log("Finished reading data from 2019_2020")

    console.log("Started reading data from 2018_2019")
    const data_2018_2019 = await parseDataFromJsonXlsx(json2019)
    console.log("Finished reading data from 2018_2019")

    console.log("Started reading data from 2017_2018")
    const data_2017_2018 = await parseDataFromJsonXlsx(json2018)
    console.log("Finished reading data from 2017_2018")

    const totalData = data_2020_2021.length + data_2019_2020.length + data_2018_2019.length + data_2017_2018.length

    console.log("Total Data:", totalData)
    // 2021 data
    const combinedData = []
    let compete = ((0) / totalData) * 100
    console.log("Progress:", compete, "%")
    for (let index = 0; index < data_2020_2021.length; index++) {
        const company = data_2020_2021[index];
        const item_2020 = findCompany(company.companyName, company.companyNumber, data_2019_2020)
        const item_2019 = findCompany(company.companyName, company.companyNumber, data_2018_2019)
        const item_2018 = findCompany(company.companyName, company.companyNumber, data_2017_2018)

        combinedData.push({
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            gpg_2020_2021: company.genderPayGap,
            gpg_2019_2020: item_2020 ? item_2020.genderPayGap : null,
            gpg_2018_2019: item_2019 ? item_2019.genderPayGap : null,
            gpg_2017_2018: item_2018 ? item_2018.genderPayGap : null,
        })
    }

    console.log("it worked!!!")

    // 2020 data
    compete = ((data_2020_2021.length) / totalData) * 100
    console.log("Progress:", compete, "%")
    for (let index = 0; index < data_2019_2020.length; index++) {
        const company = data_2019_2020[index];
        const isInCombinedData = findCompany(company.companyName, company.companyNumber, combinedData)
        if (isInCombinedData) {
            continue;
        }
        const item_2019 = findCompany(company.companyName, company.companyNumber, data_2018_2019)
        const item_2018 = findCompany(company.companyName, company.companyNumber, data_2017_2018)

        combinedData.push({
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            gpg_2020_2021: null,
            gpg_2019_2020: company.genderPayGap,
            gpg_2018_2019: item_2019 ? item_2019.genderPayGap : null,
            gpg_2017_2018: item_2018 ? item_2018.genderPayGap : null,
        })
    }

    // 2019 data
    compete = ((data_2020_2021.length + data_2019_2020.length) / totalData) * 100
    console.log("Progress:", compete, "%")
    for (let index = 0; index < data_2018_2019.length; index++) {
        const company = data_2018_2019[index];
        const isInCombinedData = findCompany(company.companyName, company.companyNumber, combinedData)
        if (isInCombinedData) {
            continue;
        }
        const item_2018 = findCompany(company.companyName, company.companyNumber, data_2017_2018)

        combinedData.push({
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            gpg_2020_2021: null,
            gpg_2019_2020: null,
            gpg_2018_2019: company.genderPayGap,
            gpg_2017_2018: item_2018 ? item_2018.genderPayGap : null,
        })
    }

    // 2018 data
    compete = ((data_2020_2021.length + data_2019_2020.length + data_2018_2019.length) / totalData) * 100
    console.log("Progress:", compete, "%")
    for (let index = 0; index < data_2017_2018.length; index++) {
        const company = data_2017_2018[index];
        const isInCombinedData = findCompany(company.companyName, company.companyNumber, combinedData)
        if (isInCombinedData) {
            continue;
        }

        combinedData.push({
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            gpg_2020_2021: null,
            gpg_2019_2020: null,
            gpg_2018_2019: null,
            gpg_2017_2018: company.genderPayGap,
        })
    }

    await writeJsonFile('./data/companies_GPG_Data.json', combinedData)
    console.log("Wrote file!")
}

function findCompany(name, companyNumber, list) {
    const upperCaseName = name.toUpperCase()
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (item.companyName.toUpperCase() == upperCaseName || item.companyNumber == companyNumber) {
            return item
        }
    }
    return null
}
