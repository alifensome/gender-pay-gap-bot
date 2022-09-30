import { CompanyDataMultiYearItem } from "../types";
import {
  getMostRecentGPG,
  getMostRecentMedianGPG,
  isNumber,
} from "./getMostRecentGPG";

describe("isNumber", () => {
  it.each([
    [1, true],
    [0, true],
    [null, false],
    [undefined, false],
    ["0", true],
    [-50, true],
    ["-50", true],
    ["NOT A NUMBER", false],
  ])(
    "should return if is a number or not",
    (numberOrUndefined, expectedResult) => {
      const result = isNumber(numberOrUndefined);
      expect(result).toBe(expectedResult);
    }
  );
});

describe("getMostRecentMedianGPG", () => {
  it.each([
    [{ data2021To2022: { medianGpg: 1 } }, 1],
    [{ data2020To2021: { medianGpg: 2 } }, 2],
    [{ data2019To2020: { medianGpg: 3 } }, 3],
    [{ data2018To2019: { medianGpg: 4 } }, 4],
    [{ data2017To2018: { medianGpg: 5 } }, 5],
    [{}, null],
    [
      {
        data2021To2022: { medianGpg: "NOT A NUMBER" },
        data2020To2021: { medianGpg: 1 },
      },
      1,
    ],
  ])("should the most recent median GPG", (company, expectedResult) => {
    const result = getMostRecentMedianGPG(company as CompanyDataMultiYearItem);
    expect(result).toBe(expectedResult);
  });
});

describe("getMostRecentGPG", () => {
  it.each([
    [{ data2021To2022: { meanGpg: 1 } }, 1],
    [{ data2020To2021: { meanGpg: 2 } }, 2],
    [{ data2019To2020: { meanGpg: 3 } }, 3],
    [{ data2018To2019: { meanGpg: 4 } }, 4],
    [{ data2017To2018: { meanGpg: 5 } }, 5],
    [{}, null],
    [
      {
        data2021To2022: { meanGpg: "NOT A NUMBER" },
        data2020To2021: { meanGpg: 1 },
      },
      1,
    ],
  ])("should get the most recent  GPG", (company, expectedResult) => {
    const result = getMostRecentGPG(company as CompanyDataMultiYearItem);
    expect(result).toBe(expectedResult);
  });
});
