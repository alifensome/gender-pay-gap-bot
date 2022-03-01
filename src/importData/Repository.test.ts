import { Repository } from "./Repository"

const twitterDataItem1 = {
    twitter_id_str: "123",
    companyName: "JOHNSON CONTROLS BUILDING EFFICIENCY UK LIMITED",
    companyNumber: "08993483",
}
const twitterDataItem2 = {
    twitter_id_str: "789",
    companyName: "NAME",
    companyNumber: null
}
const companyDataItem1 = {
    "companyName": "JOHNSON CONTROLS BUILDING EFFICIENCY UK LIMITED",
    "companyNumber": "08993483",
    "sicCodes": "43220,81100",
    "gpg_2021_2022": null,
    "gpg_2020_2021": 26.4,
    "gpg_2019_2020": null,
    "gpg_2018_2019": 16.9,
    "gpg_2017_2018": 13.4,
    "medianGpg_2021_2022": null,
    "medianGpg_2020_2021": 28,
    "medianGpg_2019_2020": null,
    "medianGpg_2018_2019": 21.3,
    "medianGpg_2017_2018": 20.5
}
const companyDataItemNoNumber = {
    "companyName": "NAME",
    "companyNumber": null,
    "sicCodes": "companyDataItemNoNumber",
}
const companyDataItemNoName = {
    "companyName": "",
    "companyNumber": "123",
    "sicCodes": "companyDataItemNoName",
}
describe("Repository", () => {
    const mockDataImporter = {
        twitterUserDataProd: jest.fn().mockReturnValue([twitterDataItem1, { twitter_id_str: "456" }, twitterDataItem2]),
        companiesGpgData: jest.fn().mockReturnValue([companyDataItem1, companyDataItemNoNumber, companyDataItemNoName])
    }
    const repo = new Repository(mockDataImporter as any)
    describe("getTwitterUserByTwitterId", () => {
        it("should get company by twitterId", () => {
            const result = repo.getTwitterUserByTwitterId("123")
            expect(result).toEqual(twitterDataItem1)
        })
        it("should return null if they don't exist", () => {
            const result = repo.getTwitterUserByTwitterId("890")
            expect(result).toEqual(null)
        })
    })
    describe("getGpgForTwitterId", () => {
        it("should get the full company for the twitterId", () => {
            const result = repo.getGpgForTwitterId("123")
            expect(result).toEqual({ companyData: companyDataItem1, twitterData: twitterDataItem1 })
        })
        it("should get the full company for the twitterId even with no companyId", () => {
            const result = repo.getGpgForTwitterId("789")
            expect(result).toEqual({ companyData: companyDataItemNoNumber, twitterData: twitterDataItem2 })
        })
    })

    describe("getCompanyByNumber", () => {
        it("should get the company by name", () => {
            const result = repo.getCompany("name", "companyNumber")
            expect(result).toEqual(companyDataItemNoNumber)
        })
        it("should get the company by companyNumber", () => {
            const result = repo.getCompany(null, "123")
            expect(result).toEqual(companyDataItemNoName)
        })
        it("should get nothing for nulls", () => {
            const result = repo.getCompany(null, null)
            expect(result).toEqual(null)
        })
    })
})