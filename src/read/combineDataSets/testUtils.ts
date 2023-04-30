import { ImportAllYearsDataResult } from "./types";
import { createTestSingleYearCompanyDataItem } from "../../unitTestHelpers/createTestSingleYearCompanyDataItem";

export const mockImportedData: ImportAllYearsDataResult = {
  data_2023_2024: [
    createTestSingleYearCompanyDataItem(7),
    createTestSingleYearCompanyDataItem(7, {
      companyName: "def",
      companyNumber: "789",
    }),
    createTestSingleYearCompanyDataItem(7, {
      companyName: "xyz",
      companyNumber: "5678",
    }),
  ],
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
