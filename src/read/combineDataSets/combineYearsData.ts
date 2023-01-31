import { findCompany } from "../../utils/findCompany";
import { CompanyDataMultiYearItem } from "../../types.js";
import { toCompanyGpgDataItem } from "./toCompanyGpgDataItem";
import { BasicCompanyInfo, MultipleYearCompanyArg } from "./types";
import { ImportAllYearsDataResult } from "./types";

export function combineYearsData(
  importAllYearsDataResult: ImportAllYearsDataResult,
  company: BasicCompanyInfo
): CompanyDataMultiYearItem {
  const item_2023 = findCompany(
    company.companyName,
    company.companyNumber,
    importAllYearsDataResult.data_2022_2023
  );

  const item_2022 = findCompany(
    company.companyName,
    company.companyNumber,
    importAllYearsDataResult.data_2021_2022
  );

  const item_2021 = findCompany(
    company.companyName,
    company.companyNumber,
    importAllYearsDataResult.data_2020_2021
  );

  const item_2020 = findCompany(
    company.companyName,
    company.companyNumber,
    importAllYearsDataResult.data_2019_2020
  );
  const item_2019 = findCompany(
    company.companyName,
    company.companyNumber,
    importAllYearsDataResult.data_2018_2019
  );
  const item_2018 = findCompany(
    company.companyName,
    company.companyNumber,
    importAllYearsDataResult.data_2017_2018
  );
  const multiYearData: MultipleYearCompanyArg = {
    item_2023,
    item_2022,
    item_2021,
    item_2020,
    item_2019,
    item_2018,
  };

  return toCompanyGpgDataItem(multiYearData);
}
