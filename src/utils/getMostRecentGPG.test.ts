import { CompanyDataItem } from "../importData"
import { getMostRecentGPG, getMostRecentMedianGPG, isNumber } from "./getMostRecentGPG"

describe("isNumber", () => {
    it.each([
        [1, true],
        [0, true],
        [null, false],
        [undefined, false],
        ["0", true],
        [-50, true],
        ["-50", true],
        ["NOT A NUMBER", false]
    ])("should return if is a number or not", (numberOrUndefined, expectedResult) => {
        const result = isNumber(numberOrUndefined)
        expect(result).toBe(expectedResult)
    })
})

describe("getMostRecentMedianGPG", () => {
    it.each([
        [{ medianGpg_2021_2022: 1 }, 1],
        [{ medianGpg_2020_2021: 1 }, 1],
        [{ medianGpg_2019_2020: 1 }, 1],
        [{ medianGpg_2018_2019: 1 }, 1],
        [{ medianGpg_2017_2018: 1 }, 1],
        [{}, null],
        [{ medianGpg_2021_2022: "NOT A NUMBER", medianGpg_2020_2021: 1 }, 1],
    ])("should the most recent median GPG", (company, expectedResult) => {
        const result = getMostRecentMedianGPG(company as CompanyDataItem)
        expect(result).toBe(expectedResult)
    })
})

describe("getMostRecentGPG", () => {
    it.each([
        [{ gpg_2021_2022: 1 }, 1],
        [{ gpg_2020_2021: 1 }, 1],
        [{ gpg_2019_2020: 1 }, 1],
        [{ gpg_2018_2019: 1 }, 1],
        [{ gpg_2017_2018: 1 }, 1],
        [{}, null],
        [{ gpg_2021_2022: "NOT A NUMBER", gpg_2020_2021: 1 }, 1],
    ])("should the most recent  GPG", (company, expectedResult) => {
        const result = getMostRecentGPG(company as CompanyDataItem)
        expect(result).toBe(expectedResult)
    })
})