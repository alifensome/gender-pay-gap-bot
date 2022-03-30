import DataImporter from "../importData"
import { Repository } from "../importData/Repository"
const importer = new DataImporter()
const repo = new Repository(importer)

const ryanAir = {
    companyName: "Ryanair ltd",
    companyNumber: null,
    sicCodes: "51101",
    gpg_2021_2022: null,
    gpg_2020_2021: 67.8,
    gpg_2019_2020: null,
    gpg_2018_2019: 62.2,
    gpg_2017_2018: 67,
    medianGpg_2021_2022: null,
    medianGpg_2020_2021: 68.6,
    medianGpg_2019_2020: null,
    medianGpg_2018_2019: 64.4,
    medianGpg_2017_2018: 71.8
}
const jamesFisherNuclearLimited = {
    companyName: "JAMES FISHER NUCLEAR LIMITED",
    companyNumber: "SC204768",
    sicCodes: "62090",
    gpg_2021_2022: null,
    gpg_2020_2021: 26.7,
    gpg_2019_2020: null,
    gpg_2018_2019: 32.4,
    gpg_2017_2018: 33,
    medianGpg_2021_2022: null,
    medianGpg_2020_2021: 21.6,
    medianGpg_2019_2020: null,
    medianGpg_2018_2019: 35.3,
    medianGpg_2017_2018: 38.3
}

const dorsetHealthcareNhsFoundationTrust = {
    companyName: "Dorset Healthcare Nhs Foundation Trust",
    companyNumber: null,
    sicCodes: "1,86210",
    gpg_2021_2022: null,
    gpg_2020_2021: 14.1,
    gpg_2019_2020: null,
    gpg_2018_2019: 16.4,
    gpg_2017_2018: 19.1,
    medianGpg_2021_2022: null,
    medianGpg_2020_2021: 8,
    medianGpg_2019_2020: null,
    medianGpg_2018_2019: 6.5,
    medianGpg_2017_2018: 6.6
}

const doncasterMetropolitanBoroughCouncil = {
    companyName: "Doncaster Metropolitan Borough Council",
    companyNumber: null,
    sicCodes: "1,84110",
    gpg_2021_2022: 12.9,
    gpg_2020_2021: 14.1,
    gpg_2019_2020: 14.6,
    gpg_2018_2019: 14.8,
    gpg_2017_2018: 15.7,
    medianGpg_2021_2022: 13.9,
    medianGpg_2020_2021: 16,
    medianGpg_2019_2020: 16.9,
    medianGpg_2018_2019: 16.5,
    medianGpg_2017_2018: 21.1
}

describe("spot check data", () => {
    it.each([
        [ryanAir],
        [jamesFisherNuclearLimited],
        [dorsetHealthcareNhsFoundationTrust],
        [doncasterMetropolitanBoroughCouncil]
    ])("should get and check the company from the data", (company) => {
        const companyFromData = repo.getCompany(company.companyName, company.companyNumber)
        expect(companyFromData).toEqual(company)
    })
})
