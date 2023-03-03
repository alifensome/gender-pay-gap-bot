import { CompanyNumber } from "../../types";

export interface ImportAllYearsDataResult {
  data_2022_2023: SingleYearCompanyDataItem[];
  data_2021_2022: SingleYearCompanyDataItem[];
  data_2020_2021: SingleYearCompanyDataItem[];
  data_2019_2020: SingleYearCompanyDataItem[];
  data_2018_2019: SingleYearCompanyDataItem[];
  data_2017_2018: SingleYearCompanyDataItem[];
}
export interface MultipleYearCompanyArg {
  item_2023: SingleYearCompanyDataItem | null;
  item_2022: SingleYearCompanyDataItem | null;
  item_2021: SingleYearCompanyDataItem | null;
  item_2020: SingleYearCompanyDataItem | null;
  item_2019: SingleYearCompanyDataItem | null;
  item_2018: SingleYearCompanyDataItem | null;
}

export interface BasicCompanyInfo {
  companyName: string;
  companyNumber: CompanyNumber;
}

export interface SingleYearCompanyDataItem {
  companyName: string;
  companyNumber: CompanyNumber; // Company Number can be null for some government bodies, health and education.
  size: string;
  sicCodes: string;
  genderPayGap: number;
  medianGenderPayGap: number;
  diffMedianBonusPercent: number | null;
  femaleLowerQuartile: number;
  femaleLowerMiddleQuartile: number;
  femaleUpperMiddleQuartile: number;
  femaleTopQuartile: number;
}

export interface CompanyDataCsvItem {
  EmployerName: string;
  EmployerId: string;
  Address: string;
  PostCode: string;
  CompanyNumber: string;
  SicCodes: string;
  DiffMeanHourlyPercent: string;
  DiffMedianHourlyPercent: string;
  DiffMeanBonusPercent: string;
  DiffMedianBonusPercent: string;
  MaleBonusPercent: string;
  FemaleBonusPercent: string;
  MaleLowerQuartile: string;
  FemaleLowerQuartile: string;
  MaleLowerMiddleQuartile: string;
  FemaleLowerMiddleQuartile: string;
  MaleUpperMiddleQuartile: string;
  FemaleUpperMiddleQuartile: string;
  MaleTopQuartile: string;
  FemaleTopQuartile: string;
  CompanyLinkToGPGInfo: string;
  ResponsiblePerson: string;
  EmployerSize: string;
  CurrentName: string;
  SubmittedAfterTheDeadline: string;
  DueDate: string;
  DateSubmitted: string;
}
