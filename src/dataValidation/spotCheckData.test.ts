import DataImporter from "../importData"
import { Repository } from "../importData/Repository"

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
const importer = new DataImporter()
const repo = new Repository(importer)
describe("spot check data", () => {
    it("should check a few data points", () => {
        const ryanAreFromData = repo.getCompany(ryanAir.companyName, ryanAir.companyNumber)
        expect(ryanAreFromData).toEqual(ryanAir)
    })
})