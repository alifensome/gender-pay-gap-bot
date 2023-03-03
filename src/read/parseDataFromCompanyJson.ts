import {
  parseCompanyNumber,
  parseGpg,
  parseNullableNumber,
  parseStringNumberWithTab,
} from "./parse";
import {
  CompanyDataCsvItem,
  SingleYearCompanyDataItem,
} from "./combineDataSets/types";
import { parseString } from "./parse";

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
    const femaleUpperMiddleQuartile = parseStringNumberWithTab(
      row.FemaleUpperMiddleQuartile
    );
    const diffMedianBonusPercent = parseNullableNumber(
      row.DiffMedianBonusPercent
    );
    const femaleLowerMiddleQuartile = parseStringNumberWithTab(
      row.FemaleLowerMiddleQuartile
    );
    const femaleLowerQuartile = parseStringNumberWithTab(
      row.FemaleLowerQuartile
    );
    const femaleTopQuartile = parseStringNumberWithTab(row.FemaleTopQuartile);
    const singleYearItem: SingleYearCompanyDataItem = {
      companyName,
      companyNumber,
      genderPayGap,
      medianGenderPayGap,
      sicCodes,
      size,
      femaleUpperMiddleQuartile,
      diffMedianBonusPercent,
      femaleLowerMiddleQuartile,
      femaleLowerQuartile,
      femaleTopQuartile,
    };
    data.push(singleYearItem);
  }
  return data;
}
