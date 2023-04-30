import { CompanyDataSingleYearItem } from "../../types.js";
import { Company } from "../../utils/Company";
import { isNumber } from "../../utils/numberUtils";
import { MultipleYearCompanyArg, SingleYearCompanyDataItem } from "./types";

export function toCompanyDataSingleYearItem(
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
export function getLatestCompanyEntry(
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
function multipleYearsToList(
  multipleYearCompanyArg: MultipleYearCompanyArg
): SingleYearCompanyDataItem[] {
  const allYearsDataArray = [];
  const c = new Company(null as any);
  const expectedYears = c.getExpectedYearsOfData();
  for (let index = 0; index < expectedYears.length; index++) {
    const year = expectedYears[index];
    const dataForYear =
      multipleYearCompanyArg[
        `item_${year + 1}` as keyof MultipleYearCompanyArg
      ];
    if (dataForYear) {
      allYearsDataArray.push(dataForYear);
    }
  }
  return allYearsDataArray;
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
