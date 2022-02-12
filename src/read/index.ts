import { writeJsonFile } from "../utils/write.js";
import { parseDataFromJsonXlsx } from "./getData"
import DataImporter from "../importData"
import { findCompany } from "../utils/findCompany";
const dataImporter = new DataImporter()

const json2022 = dataImporter.gpg_2021_2022()
const json2021 = dataImporter.gpg_2020_2021()
const json2020 = dataImporter.gpg_2019_2020()
const json2019 = dataImporter.gpg_2018_2019()
const json2018 = dataImporter.gpg_2017_2018()

getAllData().then(() => console.log("Finished!!!"))

async function getAllData() {

    console.log("Started reading data from 2021_2022")
    const data_2021_2022 = await parseDataFromJsonXlsx(json2022)
    console.log("Finished reading data from 2021_2022")

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


    const numberOfItems2022 = data_2021_2022.length;
    const numberOfItems2021 = data_2020_2021.length;
    const numberOfItems2020 = data_2019_2020.length;
    const numberOfItems2019 = data_2018_2019.length;
    const numberOfItems2018 = data_2017_2018.length;

    const totalData = numberOfItems2022 + numberOfItems2021 + numberOfItems2020 + numberOfItems2019 + numberOfItems2018

    console.log("Total Data:", totalData)
    console.log("Number of items:", {
        numberOfItems2022,
        numberOfItems2021,
        numberOfItems2020,
        numberOfItems2019,
        numberOfItems2018,
        totalData,
    })

    if (process.argv[2] === "debug") {
        return
    }

    // 2022 data
    const combinedData = []
    let complete = 0
    printPercentageComplete(complete, totalData);
    for (let index = 0; index < data_2021_2022.length; index++) {
        const company = data_2021_2022[index];
        const item_2021 = findCompany(company.companyName, company.companyNumber, data_2020_2021)
        const item_2020 = findCompany(company.companyName, company.companyNumber, data_2019_2020)
        const item_2019 = findCompany(company.companyName, company.companyNumber, data_2018_2019)
        const item_2018 = findCompany(company.companyName, company.companyNumber, data_2017_2018)

        combinedData.push({
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            gpg_2021_2022: company.genderPayGap,
            gpg_2020_2021: item_2021 ? item_2021.genderPayGap : null,
            gpg_2019_2020: item_2020 ? item_2020.genderPayGap : null,
            gpg_2018_2019: item_2019 ? item_2019.genderPayGap : null,
            gpg_2017_2018: item_2018 ? item_2018.genderPayGap : null,
        })
    }

    complete += numberOfItems2022

    // 2021 data
    printPercentageComplete(complete, totalData)
    for (let index = 0; index < data_2020_2021.length; index++) {
        const company = data_2020_2021[index];
        const isInCombinedData = findCompany(company.companyName, company.companyNumber, combinedData)
        if (isInCombinedData) {
            continue;
        }
        const item_2020 = findCompany(company.companyName, company.companyNumber, data_2019_2020)
        const item_2019 = findCompany(company.companyName, company.companyNumber, data_2018_2019)
        const item_2018 = findCompany(company.companyName, company.companyNumber, data_2017_2018)

        combinedData.push({
            companyName: company.companyName,
            companyNumber: company.companyNumber,
            gpg_2021_2022: null,
            gpg_2020_2021: company.genderPayGap,
            gpg_2019_2020: item_2020 ? item_2020.genderPayGap : null,
            gpg_2018_2019: item_2019 ? item_2019.genderPayGap : null,
            gpg_2017_2018: item_2018 ? item_2018.genderPayGap : null,
        })
    }

    complete += numberOfItems2021
    // 2020 data
    printPercentageComplete(complete, totalData)
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

    complete += numberOfItems2020

    // 2019 data
    printPercentageComplete(complete, totalData)
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

    complete += numberOfItems2019
    // 2018 data
    printPercentageComplete(complete, totalData)
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


function printPercentageComplete(current: number, totalData: number) {
    const complete = percentageComplete(current, totalData);
    console.log("Progress:", complete, "%");
}

function percentageComplete(current: number, totalData: number) {
    return ((current) / totalData) * 100;
}

