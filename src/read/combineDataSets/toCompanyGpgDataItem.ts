import { CompanyDataMultiYearItem, CompanySize } from "../../types";
import { parseCompanyName } from "../../utils/parseCompanyName";
import { MultipleYearCompanyArg } from "./types";
import { getLatestCompanyEntry, toCompanyDataSingleYearItem } from "./utils";

// TODO make this more dynamic or update every year.

export function toCompanyGpgDataItem(
  multipleYearCompanyArg: MultipleYearCompanyArg
): CompanyDataMultiYearItem {
  const latestCompanyObject = getLatestCompanyEntry(multipleYearCompanyArg);
  return {
    companyName: parseCompanyName(latestCompanyObject.companyName),
    companyNumber: latestCompanyObject.companyNumber,
    size: latestCompanyObject.size as CompanySize,
    sicCodes: latestCompanyObject.sicCodes,
    data2023To2024: toCompanyDataSingleYearItem(
      multipleYearCompanyArg.item_2024
    ),
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
