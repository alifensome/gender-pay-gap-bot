import { findCompany } from "../../utils/findCompany";
import { SingleYearCompanyDataItem } from "../parseDataFromCompany";
import { BasicCompanyInfo, ImportAllYearsDataResult } from "./types";

export function formDeduplicatedListOfCompanies(
  allYearsDataResult: ImportAllYearsDataResult
): BasicCompanyInfo[] {
  const combinedDeuplicatedData: BasicCompanyInfo[] = [];
  for (const key of Object.keys(allYearsDataResult)) {
    const singleYearList = allYearsDataResult[
      key
    ] as SingleYearCompanyDataItem[];
    for (let index = 0; index < singleYearList.length; index++) {
      const company = singleYearList[index];
      const isInCombinedData = findCompany<BasicCompanyInfo>(
        company.companyName,
        company.companyNumber,
        combinedDeuplicatedData
      );
      if (!isInCombinedData) {
        combinedDeuplicatedData.push({
          companyName: company.companyName,
          companyNumber: company.companyNumber,
        });
      }
    }
  }
  return combinedDeuplicatedData;
}
