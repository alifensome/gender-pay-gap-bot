import { SingleYearCompanyDataItem } from "../parseDataFromCompany";

export interface Company {
  companyName: string;
  companyNumber: string;
  size: string;
  genderPayGap: number;
  medianGenderPayGap: number;
  sicCodes: string;
}

export interface ImportAllYearsDataResult {
  data_2022_2023: SingleYearCompanyDataItem[];
  data_2021_2022: SingleYearCompanyDataItem[];
  data_2020_2021: SingleYearCompanyDataItem[];
  data_2019_2020: SingleYearCompanyDataItem[];
  data_2018_2019: SingleYearCompanyDataItem[];
  data_2017_2018: SingleYearCompanyDataItem[];
}
export interface MultipleYearCompanyArg {
  item_2023: Company | null;
  item_2022: Company | null;
  item_2021: Company | null;
  item_2020: Company | null;
  item_2019: Company | null;
  item_2018: Company | null;
}

export interface BasicCompanyInfo {
  companyName: string;
  companyNumber: string;
}
