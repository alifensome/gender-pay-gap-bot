import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import {
  companyDataMultiYearToList,
  forCompanyDataMultiYearFindFirstTrue,
} from "./companyDataMultiYear";

describe("companyDataMultiYearToList", () => {
  it("should get all available years from the multiyear item in descending age order", () => {
    const result = companyDataMultiYearToList(mockCompanyDataItem);
    expect(result).toEqual([
      { medianGpg: 52.1, meanGpg: 51.5 },
      { medianGpg: 42.1, meanGpg: 41.5 },
      { medianGpg: 32.1, meanGpg: 31.5 },
      { medianGpg: 22.1, meanGpg: 21.5 },
      { medianGpg: 11.1, meanGpg: 11.5 },
    ]);
  });
});

describe("forCompanyDataMultiYearFindFirstTrue", () => {
  it("should get all available years from the multiyear item in descending age order", () => {
    const result = forCompanyDataMultiYearFindFirstTrue(
      mockCompanyDataItem,
      (item) => item.medianGpg <= 22.1
    );
    expect(result).toEqual({ medianGpg: 22.1, meanGpg: 21.5 });
  });
});
