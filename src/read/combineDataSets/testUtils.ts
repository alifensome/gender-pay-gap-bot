import { BasicCompanyInfo, ImportAllYearsDataResult } from "./types";
import { SingleYearCompanyDataItem } from "./types";
import { CompanySize } from "../../types";

export const mockImportedData: ImportAllYearsDataResult = {
  data_2022_2023: [
    createTestSingleYearCompanyDataItem(1),
    createTestSingleYearCompanyDataItem(1, {
      companyName: "def",
      companyNumber: "789",
    }),
    createTestSingleYearCompanyDataItem(1, {
      companyName: "xyz",
      companyNumber: "5678",
    }),
  ],
  data_2021_2022: [
    createTestSingleYearCompanyDataItem(2),
    createTestSingleYearCompanyDataItem(2, {
      companyName: "def",
      companyNumber: "789",
    }),
  ],
  data_2020_2021: [
    createTestSingleYearCompanyDataItem(3),
    createTestSingleYearCompanyDataItem(3, {
      companyName: "def",
      companyNumber: "789",
    }),
  ],
  data_2019_2020: [
    createTestSingleYearCompanyDataItem(4),
    createTestSingleYearCompanyDataItem(4, {
      companyName: "def",
      companyNumber: "789",
    }),
  ],
  data_2018_2019: [
    createTestSingleYearCompanyDataItem(5),
    createTestSingleYearCompanyDataItem(5, {
      companyName: "def",
      companyNumber: "789",
    }),
  ],
  data_2017_2018: [
    createTestSingleYearCompanyDataItem(6),
    createTestSingleYearCompanyDataItem(6, {
      companyName: "def",
      companyNumber: "789",
    }),
  ],
};

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
  };
}
