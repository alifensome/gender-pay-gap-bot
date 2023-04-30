import { createTestSingleYearCompanyDataItem } from "../../unitTestHelpers/createTestSingleYearCompanyDataItem";
import { toCompanyGpgDataItem } from "./toCompanyGpgDataItem";

describe("toCompanyGpgDataItem", () => {
  it("should parse multiple years of data into one multi year data item", () => {
    const result = toCompanyGpgDataItem({
      item_2024: null,
      item_2023: createTestSingleYearCompanyDataItem(1),
      item_2022: null,
      item_2021: null,
      item_2020: null,
      item_2019: createTestSingleYearCompanyDataItem(2),
      item_2018: null,
    });
    const expectedResult = {
      companyName: "abc",
      companyNumber: "123",
      data2023To2024: null,
      data2017To2018: null,
      data2018To2019: {
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
        femaleUpperMiddleQuartile: 1,
        meanGpg: 2,
        medianGpg: 3,
      },
      data2019To2020: null,
      data2020To2021: null,
      data2021To2022: null,
      data2022To2023: {
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
        femaleUpperMiddleQuartile: 1,
        meanGpg: 1,
        medianGpg: 2,
      },
      sicCodes: "456",
      size: "250 to 499",
    };
    expect(result).toEqual(expectedResult);
  });
});
