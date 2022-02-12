import { spreadSheetToJson } from "./getData.js"

async function write2021_2022_data() {
    await genericWriteData(2021)
}

export async function genericWriteData(year: number) {
    const startYear = year
    const endYear = year + 1
    const formattedYearGap = `${startYear}_${endYear}`
    console.log(`Started reading data from ${formattedYearGap}`)
    const filePath = `./data/UK Gender Pay Gap Data - ${startYear} to ${endYear}.xlsx`
    const outputFilePath = `./data/gpg_${formattedYearGap}.json`
    await spreadSheetToJson(filePath, outputFilePath)
    console.log(`Finished reading data from ${formattedYearGap}`)
}

export async function writeAllData() {

    await write2021_2022_data()

    console.log("Started reading data from 2020_2021")
    const filePath_2020_2021 = './data/UK Gender Pay Gap Data - 2020 to 2021.xlsx'
    const outputFilePath_2020_2021 = "./data/gpg_2020_2021.json"
    await spreadSheetToJson(filePath_2020_2021, outputFilePath_2020_2021)
    console.log("Finished reading data from 2020_2021")

    console.log("Started reading data from 2019_2020")
    const filePath_2019_2020 = './data/UK Gender Pay Gap Data - 2019 to 2020.xlsx'
    const outputFilePath_2019_2020 = "./data/gpg_2019_2020.json"
    await spreadSheetToJson(filePath_2019_2020, outputFilePath_2019_2020)
    console.log("Finished reading data from 2019_2020")

    console.log("Started reading data from 2018_2019")
    const filePath_2018_2019 = './data/UK Gender Pay Gap Data - 2018 to 2019.xlsx'
    const outputFilePath_2018_2019 = "./data/gpg_2018_2019.json"
    await spreadSheetToJson(filePath_2018_2019, outputFilePath_2018_2019)
    console.log("Finished reading data from 2018_2019")

    console.log("Started reading data from 2017_2018")
    const filePath_2017_2018 = './data/UK Gender Pay Gap Data - 2017 to 2018.xlsx'
    const outputFilePath_2017_2018 = "./data/gpg_2017_2018.json"
    await spreadSheetToJson(filePath_2017_2018, outputFilePath_2017_2018)
    console.log("Finished reading data from 2017_2018")


}
