import { BasicCompanyInfo } from "../read/combineDataSets/types";
import { SingleYearCompanyDataItem } from "../read/combineDataSets/types";
import { CompanySize } from "../types";

export function createTestSingleYearCompanyDataItem(
  gap: number,
  company: BasicCompanyInfo = { companyName: "abc", companyNumber: "123" }
): SingleYearCompanyDataItem {
  return {
    ...company,
    size: CompanySize.From250To499,
    sicCodes: "456",
    genderPayGap: gap,
    medianGenderPayGap: gap + 1,
    femaleUpperMiddleQuartile: 1,
    diffMedianBonusPercent: 1,
    femaleLowerMiddleQuartile: 2,
    femaleLowerQuartile: 3,
    femaleTopQuartile: 4,
  };
}
