import DataImporter from "../../importData";
import { parseDataFromJson } from "../parseDataFromCompanyJson";
import { ImportAllYearsDataResult } from "./types";

export function importAllYearsData(): ImportAllYearsDataResult {
  const dataImporter = new DataImporter();

  const json2024 = dataImporter.gpg_2023_2024();
  const json2023 = dataImporter.gpg_2022_2023();
  const json2022 = dataImporter.gpg_2021_2022();
  const json2021 = dataImporter.gpg_2020_2021();
  const json2020 = dataImporter.gpg_2019_2020();
  const json2019 = dataImporter.gpg_2018_2019();
  const json2018 = dataImporter.gpg_2017_2018();

  console.log("Started reading data from 2023_2024");
  const data_2023_2024 = parseDataFromJson(json2024);
  console.log("Finished reading data from 2023_2024");

  console.log("Started reading data from 2022_2023");
  const data_2022_2023 = parseDataFromJson(json2023);
  console.log("Finished reading data from 2022_2023");

  console.log("Started reading data from 2021_2022");
  const data_2021_2022 = parseDataFromJson(json2022);
  console.log("Finished reading data from 2021_2022");

  console.log("Started reading data from 2020_2021");
  const data_2020_2021 = parseDataFromJson(json2021);
  console.log("Finished reading data from 2020_2021");

  console.log("Started reading data from 2019_2020");
  const data_2019_2020 = parseDataFromJson(json2020);
  console.log("Finished reading data from 2019_2020");

  console.log("Started reading data from 2018_2019");
  const data_2018_2019 = parseDataFromJson(json2019);
  console.log("Finished reading data from 2018_2019");

  console.log("Started reading data from 2017_2018");
  const data_2017_2018 = parseDataFromJson(json2018);
  console.log("Finished reading data from 2017_2018");

  return {
    data_2023_2024,
    data_2022_2023,
    data_2021_2022,
    data_2020_2021,
    data_2019_2020,
    data_2018_2019,
    data_2017_2018,
  };
}
