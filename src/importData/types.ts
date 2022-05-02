
export interface CompanyDataItem {
    companyName: string
    companyNumber: string | null // Company Number can be null for some government bodies, health and education.
    sicCodes: string
    gpg_2021_2022?: number
    gpg_2020_2021?: number
    gpg_2019_2020?: number
    gpg_2018_2019?: number
    gpg_2017_2018?: number
    medianGpg_2021_2022?: number
    medianGpg_2020_2021?: number
    medianGpg_2019_2020?: number
    medianGpg_2018_2019?: number
    medianGpg_2017_2018?: number
    size: CompanySize
}

export enum CompanySize {
    NotProvided = "Not Provided",
    LessThan250 = "Less than 250",
    From250To499 = "250 to 499",
    From500To999 = "500 to 999",
    From1000To4999 = "1000 to 4999",
    From5000To19999 = "5000 to 19,999",
    Morethan20000 = "20,000 or more"
}

export interface TwitterData {
    twitter_id_str: string;
    twitter_id: number;
    twitter_name: string;
    twitter_screen_name: string;
    companyName: string;
    companyNumber?: string | null;
}

export interface CompanyDataJoinedTweetsItem {
    companyName: string;
    companyNumber?: string;
    gpg_2020_2021?: number;
    gpg_2019_2020?: number;
    gpg_2018_2019?: number;
    gpg_2017_2018?: number;
    hasTwitterData: boolean;
    twitterId?: string;
    twitterScreenName?: string;
}
