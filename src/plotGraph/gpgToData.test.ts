import { CompanySize } from '../importData'
import { gpgToData } from './gpgToData'
describe("gpgToData", () => {
    it("should parse the company to a data item", () => {
        const company = {
            companyName: "companyName",
            sicCodes: "",
            companyNumber: null,
            gpg_2021_2022: 1,
            gpg_2020_2021: 2,
            gpg_2019_2020: 3,
            gpg_2018_2019: 4,
            gpg_2017_2018: 5,
            medianGpg_2021_2022: 6,
            medianGpg_2020_2021: 7,
            medianGpg_2019_2020: 8,
            medianGpg_2018_2019: 9,
            medianGpg_2017_2018: 10,
            size: CompanySize.From250To499
        }
        const result = gpgToData(company)
        const expectedResult = {
            medianData: [{ x: 2017, y: 10 }, { x: 2018, y: 9 }, { x: 2019, y: 8 }, { x: 2020, y: 7 }, { x: 2021, y: 6 }],
            meanData: [{ x: 2017, y: 5 }, { x: 2018, y: 4 }, { x: 2019, y: 3 }, { x: 2020, y: 2 }, { x: 2021, y: 1 }],
        }
        expect(result).toEqual(expectedResult)
    })
    it("should parse not include null years", () => {
        const company = {
            companyName: "companyName",
            sicCodes: "",
            companyNumber: null,
            gpg_2021_2022: 1,
            gpg_2020_2021: 2,
            gpg_2019_2020: 3,
            gpg_2018_2019: null,
            gpg_2017_2018: 5,
            medianGpg_2021_2022: 6,
            medianGpg_2020_2021: null,
            medianGpg_2019_2020: 8,
            medianGpg_2018_2019: 9,
            medianGpg_2017_2018: 10,
            size: CompanySize.From250To499
        }
        const result = gpgToData(company)
        const expectedResult = {
            medianData: [{ x: 2017, y: 10 }, { x: 2018, y: 9 }, { x: 2019, y: 8 }, { x: 2021, y: 6 }],
            meanData: [{ x: 2017, y: 5 }, { x: 2019, y: 3 }, { x: 2020, y: 2 }, { x: 2021, y: 1 }],
        }
        expect(result).toEqual(expectedResult)
    })
    it("should parse the company to a data item even when 0", () => {
        const company = {
            companyName: "companyName",
            sicCodes: "",
            companyNumber: null,
            gpg_2021_2022: 1,
            gpg_2020_2021: 2,
            gpg_2019_2020: 3,
            gpg_2018_2019: 0,
            gpg_2017_2018: 5,
            medianGpg_2021_2022: 0,
            medianGpg_2020_2021: 7,
            medianGpg_2019_2020: 8,
            medianGpg_2018_2019: 9,
            medianGpg_2017_2018: 10,
            size: CompanySize.From250To499
        }
        const result = gpgToData(company)
        const expectedResult = {
            medianData: [{ x: 2017, y: 10 }, { x: 2018, y: 9 }, { x: 2019, y: 8 }, { x: 2020, y: 7 }, { x: 2021, y: 0 }],
            meanData: [{ x: 2017, y: 5 }, { x: 2018, y: 0 }, { x: 2019, y: 3 }, { x: 2020, y: 2 }, { x: 2021, y: 1 }],
        }
        expect(result).toEqual(expectedResult)
    })
})