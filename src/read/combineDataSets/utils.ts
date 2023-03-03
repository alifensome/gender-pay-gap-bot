import {
  CompanyDataMultiYearItem,
  CompanyDataSingleYearItem,
  CompanySize,
} from "../../types.js";
import { isNumber } from "../../utils/numberUtils";
import { MultipleYearCompanyArg, SingleYearCompanyDataItem } from "./types";

// TODO make this more dynamic or update every year.
export function toCompanyGpgDataItem(
  multipleYearCompanyArg: MultipleYearCompanyArg
): CompanyDataMultiYearItem {
  const latestCompanyObject = getLatestCompanyEntry(multipleYearCompanyArg);
  return {
    companyName: latestCompanyObject.companyName,
    companyNumber: latestCompanyObject.companyNumber,
    size: latestCompanyObject.size as CompanySize, // TODO parse this better!
    sicCodes: latestCompanyObject.sicCodes,
    data2022To2023: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2023
    ),
    data2021To2022: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2022
    ),
    data2020To2021: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2021
    ),
    data2019To2020: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2020
    ),
    data2018To2019: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2019
    ),
    data2017To2018: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2018
    ),
  };
}

function toCompanyDataSingleYearItem(
  company: SingleYearCompanyDataItem | null
): CompanyDataSingleYearItem | null {
  if (
    !company ||
    (!isNumber(company?.genderPayGap) && !isNumber(company?.medianGenderPayGap))
  ) {
    return null;
  }
  if (isNumber(company.genderPayGap) && isNumber(company.medianGenderPayGap)) {
    return {
      meanGpg: company.genderPayGap,
      medianGpg: company.medianGenderPayGap,
      femaleUpperMiddleQuartile: company.femaleUpperMiddleQuartile,
      diffMedianBonusPercent: company.diffMedianBonusPercent,
      femaleLowerMiddleQuartile: company.femaleLowerMiddleQuartile,
      femaleLowerQuartile: company.femaleLowerQuartile,
      femaleTopQuartile: company.femaleTopQuartile,
    };
  }
  throw new Error(`wrong fields present: ${JSON.stringify(company)}`);
}

// TODO make this work more dynamically or remember to update it every year.
function getLatestCompanyEntry(
  multipleYearCompanyArg: MultipleYearCompanyArg
): SingleYearCompanyDataItem {
  const yearsOfCompany = multipleYearsToList(multipleYearCompanyArg);

  for (let index = 0; index < yearsOfCompany.length; index++) {
    const element = yearsOfCompany[index];
    if (element && isValidCompany(element)) {
      return element;
    }
  }
  throw new Error(
    `there are no valid items for: ${JSON.stringify(yearsOfCompany)}`
  );
}

// TODO unit test this.
function multipleYearsToList(multipleYearCompanyArg: MultipleYearCompanyArg) {
  return [
    multipleYearCompanyArg.item_2023,
    multipleYearCompanyArg.item_2022,
    multipleYearCompanyArg.item_2021,
    multipleYearCompanyArg.item_2020,
    multipleYearCompanyArg.item_2019,
    multipleYearCompanyArg.item_2018,
  ];
}

function isValidCompany(
  c: SingleYearCompanyDataItem
): c is SingleYearCompanyDataItem {
  return !!c && !!c.companyName;
}

export function printPercentageComplete(current: number, totalData: number) {
  const complete = percentageComplete(current, totalData);
  console.log("Progress:", complete, "%");
}

function percentageComplete(current: number, totalData: number) {
  return (current / totalData) * 100;
}
