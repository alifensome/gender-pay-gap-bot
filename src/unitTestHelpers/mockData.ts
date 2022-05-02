import { CompanyDataItem, CompanySize } from "../importData";
import { GraphData } from "../plotGraph/plot";

export const mockCompanyDataItem: CompanyDataItem = {
    companyNumber: "321",
    companyName: "Company Name Ltd 2",
    sicCodes: "123,456",
    medianGpg_2021_2022: 52.1,
    medianGpg_2020_2021: 42.1,
    medianGpg_2019_2020: 32.1,
    medianGpg_2018_2019: 22.1,
    medianGpg_2017_2018: 11.1,
    gpg_2021_2022: 51.5,
    gpg_2020_2021: 41.5,
    gpg_2019_2020: 31.5,
    gpg_2018_2019: 21.5,
    gpg_2017_2018: 11.5,
    size: CompanySize.From1000To4999
}

export const mockGraphData: GraphData = {
    meanData: [
        {
            x: 2017,
            y: 11.5,
        },
        {
            x: 2018,
            y: 21.5,
        },
        {
            x: 2019,
            y: 31.5,
        },
        {
            x: 2020,
            y: 41.5,
        },
        {
            x: 2021,
            y: 51.5,
        },
    ],
    medianData: [
        {
            x: 2017,
            y: 11.1,
        },
        {
            x: 2018,
            y: 22.1,
        },
        {
            x: 2019,
            y: 32.1,
        },
        {
            x: 2020,
            y: 42.1,
        },
        {
            x: 2021,
            y: 52.1,
        },
    ],
}