import { Repository } from "./Repository"

describe("Repository", () => {
    const mockDataImporter = {
        twitterUserDataProd: jest.fn().mockReturnValue([{ twitter_id_str: "123" }, { twitter_id_str: "456" }]),
        companiesGpgData: jest.fn().mockReturnValue([{
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
        },])
    }
    const repo = new Repository(mockDataImporter as any)
    describe("getCompanyByTwitterId", () => {
        it("should get company by twitterId", () => {
            const result = repo.getCompanyByTwitterId("123")
            expect(result).toEqual({ twitter_id_str: "123" })
        })
        it("should return null if they don't exist", () => {
            const result = repo.getCompanyByTwitterId("890")
            expect(result).toEqual(null)
        })
    })
    describe("getGpgForTwitterId", () => {
        it("should get the full company for the twitterId", () => {
            const result = repo.getGpgForTwitterId("123")
        })
    })
})