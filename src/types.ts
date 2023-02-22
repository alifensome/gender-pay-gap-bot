export type CompanyNumber = string | null; // Company Number can be null for some government bodies, health and education.

// TODO make this type more dynamic, or remember to update it every year.
export interface CompanyDataMultiYearItem {
  companyName: string;
  companyNumber: CompanyNumber
  sicCodes: string;
  data2022To2023: CompanyDataSingleYearItem | null;
  data2021To2022: CompanyDataSingleYearItem | null;
  data2020To2021: CompanyDataSingleYearItem | null;
  data2019To2020: CompanyDataSingleYearItem | null;
  data2018To2019: CompanyDataSingleYearItem | null;
  data2017To2018: CompanyDataSingleYearItem | null;
  size: CompanySize;
}

export interface CompanyDataSingleYearItem {
  meanGpg: number;
  medianGpg: number;
}

export enum CompanySize {
  NotProvided = "Not Provided",
  LessThan250 = "Less than 250",
  From250To499 = "250 to 499",
  From500To999 = "500 to 999",
  From1000To4999 = "1000 to 4999",
  From5000To19999 = "5000 to 19,999",
  MoreThan20000 = "20,000 or more",
}

export interface TwitterData {
  twitter_id_str: string;
  twitter_id: number; // TODO bin this
  twitter_name: string;
  twitter_screen_name: string;
  companyName: string;
  companyNumber: string | null;
}

// TODO deprecate this and use union type.
export interface CompanyDataJoinedTweetsItem {
  companyName: string;
  companyNumber?: string;
  gpg_2022_2023?: number;
  gpg_2021_2022?: number;
  gpg_2020_2021?: number;
  gpg_2019_2020?: number;
  gpg_2018_2019?: number;
  gpg_2017_2018?: number;
  hasTwitterData: boolean;
  twitterId?: string;
  twitterScreenName?: string;
}
