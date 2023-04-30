import { findCompany } from "../../utils/findCompany";
import { SingleYearCompanyDataItem } from "./types";
import { BasicCompanyInfo, ImportAllYearsDataResult } from "./types";
import { Presets, SingleBar } from "cli-progress";

export function formDeduplicatedListOfCompanies(
  allYearsDataResult: ImportAllYearsDataResult
): BasicCompanyInfo[] {
  const combinedDeduplicatedData: BasicCompanyInfo[] = [];
  const progressBar = new SingleBar({}, Presets.shades_classic);
  const numberOfYears = Object.keys(allYearsDataResult).length;
  progressBar.start(numberOfYears, 0);
  let progress = 0;
  for (const key of Object.keys(allYearsDataResult)) {
    const singleYearList = allYearsDataResult[
      key as keyof ImportAllYearsDataResult
    ] as SingleYearCompanyDataItem[];
    progressBar.update(progress++);
    for (let index = 0; index < singleYearList.length; index++) {
      const company = singleYearList[index];
      const isInCombinedData = findCompany<BasicCompanyInfo>(
        company.companyName,
        company.companyNumber,
        combinedDeduplicatedData
      );
      if (!isInCombinedData) {
        combinedDeduplicatedData.push({
          companyName: company.companyName,
          companyNumber: company.companyNumber,
        });
      }
    }
  }
  progressBar.update(numberOfYears);
  progressBar.stop();
  return combinedDeduplicatedData;
}
