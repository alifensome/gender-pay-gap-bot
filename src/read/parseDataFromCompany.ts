import { parseCompanyNumber, parseGpg } from "./parse";
import { CsvParser } from "./parseCsv/parseCsv";
import { writeJsonFile } from "../utils/write";
import {
  CompanyDataCsvItem,
  SingleYearCompanyDataItem,
} from "./combineDataSets/types";

export async function spreadSheetToJson(
  filePath: string,
  outputFileName: string
): Promise<void> {
  const csvParser = new CsvParser();
  const rows = await csvParser.parseFromFile(filePath);
  await writeJsonFile(outputFileName, rows);
}

export function parseDataFromJson(
  jsonFile: CompanyDataCsvItem[]
): SingleYearCompanyDataItem[] {
  const data: SingleYearCompanyDataItem[] = [];
  for (let index = 0; index < jsonFile.length; index++) {
    const row = jsonFile[index];
    if (!row || !Object.keys(row).length) {
      continue;
    }
    const companyName = row.EmployerName;
    const companyNumber = parseCompanyNumber(row.CompanyNumber);
    const genderPayGap = parseGpg(row.DiffMeanHourlyPercent);
    const medianGenderPayGap = parseGpg(row.DiffMedianHourlyPercent);
    const sicCodes = parseString(row.SicCodes);
    if (!companyName && !companyNumber) {
      continue;
    }
    const size = row.EmployerSize;
    const singleYearItem: SingleYearCompanyDataItem = {
      companyName,
      companyNumber,
      genderPayGap,
      medianGenderPayGap,
      sicCodes,
      size,
    };
    data.push(singleYearItem);
  }
  return data;
}

function parseString(s: string | unknown): string {
  if (!s) {
    return "";
  }
  if (typeof s === "string") {
    const result = s.replace(/\n/g, "");
    return result;
  }
  return `${s}`;
}
