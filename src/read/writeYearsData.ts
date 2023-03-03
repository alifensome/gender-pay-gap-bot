import { spreadSheetToJson } from "./spreadSheetToJson";

async function write2022_2023_data() {
  await genericWriteData(2022);
}
async function write2021_2022_data() {
  await genericWriteData(2021);
}
async function write2020_2021_data() {
  await genericWriteData(2020);
}
async function write2019_2020_data() {
  await genericWriteData(2019);
}
async function write2018_2019_data() {
  await genericWriteData(2018);
}
async function write2017_2018_data() {
  await genericWriteData(2017);
}

// year is the first calendar year of the snapshot eg 21-22 would be 21
export async function genericWriteData(year: number) {
  const startYear = year;
  const endYear = year + 1;
  const formattedYearGap = `${startYear}_${endYear}`;
  console.log(`Started reading data from ${formattedYearGap}`);
  const filePath = `./data/UK Gender Pay Gap Data - ${startYear} to ${endYear}.csv`;
  const outputFilePath = `./data/gpg_${formattedYearGap}.json`;
  await spreadSheetToJson(filePath, outputFilePath);
  console.log(`Finished reading data from ${formattedYearGap}`);
}

export async function writeAllData() {
  await write2022_2023_data();
  await write2021_2022_data();
  await write2020_2021_data();
  await write2019_2020_data();
  await write2018_2019_data();
  await write2017_2018_data();
}
