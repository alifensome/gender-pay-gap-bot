import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import {
  companyDataMultiYearToList,
  forCompanyDataMultiYearFindFirstTrue,
} from "./companyDataMultiYear";

describe("companyDataMultiYearToList", () => {
  it("should get all available years from the multiyear item in descending age order", () => {
    const result = companyDataMultiYearToList(mockCompanyDataItem);
    expect(result).toEqual([
      {
        medianGpg: 10.1,
        meanGpg: 9.5,
        femaleUpperMiddleQuartile: 1,
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
      },
      {
        medianGpg: 52.1,
        meanGpg: 51.5,
        femaleUpperMiddleQuartile: 1,
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
      },
      {
        medianGpg: 42.1,
        meanGpg: 41.5,
        femaleUpperMiddleQuartile: 1,
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
      },
      {
        medianGpg: 32.1,
        meanGpg: 31.5,
        femaleUpperMiddleQuartile: 1,
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
      },
      {
        medianGpg: 22.1,
        meanGpg: 21.5,
        femaleUpperMiddleQuartile: 1,
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
      },
      {
        medianGpg: 11.1,
        meanGpg: 11.5,
        femaleUpperMiddleQuartile: 1,
        diffMedianBonusPercent: 1,
        femaleLowerMiddleQuartile: 2,
        femaleLowerQuartile: 3,
        femaleTopQuartile: 4,
      },
    ]);
  });
});

describe("forCompanyDataMultiYearFindFirstTrue", () => {
  it("should get all available years from the multiyear item in descending age order", () => {
    const result = forCompanyDataMultiYearFindFirstTrue(
      mockCompanyDataItem,
      (item) => item.medianGpg == 22.1
    );
    expect(result).toEqual({
      medianGpg: 22.1,
      meanGpg: 21.5,
      femaleUpperMiddleQuartile: 1,
      diffMedianBonusPercent: 1,
      femaleLowerMiddleQuartile: 2,
      femaleLowerQuartile: 3,
      femaleTopQuartile: 4,
    });
  });
});
