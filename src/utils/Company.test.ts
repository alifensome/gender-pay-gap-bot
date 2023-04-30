import { CompanyDataMultiYearItem, CompanySize } from "../types";
import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import { Company } from "./Company";

describe("Company", () => {
  it("should construct with a companyDataItem", () => {
    new Company(mockCompanyDataItem);
  });

  describe("hasTwoYearsConsecutive", () => {
    it("should return true if it has two consecutive years from this year", () => {
      const companyDataMultiYear: CompanyDataMultiYearItem = {
        companyName: "",
        companyNumber: null,
        sicCodes: "",
        data2023To2024: null,
        data2022To2023: {
          meanGpg: 1,
          medianGpg: 2,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2021To2022: {
          meanGpg: 3,
          medianGpg: 4,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2020To2021: null,
        data2019To2020: null,
        data2018To2019: null,
        data2017To2018: null,
        size: CompanySize.NotProvided,
      };
      const company = new Company(companyDataMultiYear);
      const result = company.getTwoYearsConsecutive();
      expect(result).toEqual({
        previousYear: {
          meanGpg: 3,
          medianGpg: 4,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        year: {
          meanGpg: 1,
          medianGpg: 2,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
      });
    });
    it("should return true if it has two consecutive years from this year", () => {
      const companyDataMultiYear: CompanyDataMultiYearItem = {
        companyName: "",
        companyNumber: null,
        sicCodes: "",
        data2023To2024: null,
        data2021To2022: {
          meanGpg: 1,
          medianGpg: 2,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2020To2021: {
          meanGpg: 3,
          medianGpg: 4,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2022To2023: null,
        data2019To2020: null,
        data2018To2019: null,
        data2017To2018: null,
        size: CompanySize.NotProvided,
      };
      const company = new Company(companyDataMultiYear);
      const result = company.getTwoYearsConsecutive();
      expect(result).toEqual({
        previousYear: {
          meanGpg: 3,
          medianGpg: 4,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        year: {
          meanGpg: 1,
          medianGpg: 2,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
      });
    });
    it("should return null if it does not have two consecutive years", () => {
      const companyDataMultiYear: CompanyDataMultiYearItem = {
        companyName: "",
        companyNumber: null,
        sicCodes: "",
        data2023To2024: null,
        data2022To2023: {
          meanGpg: 1,
          medianGpg: 2,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2021To2022: null,
        data2020To2021: {
          meanGpg: 3,
          medianGpg: 4,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2019To2020: null,
        data2018To2019: null,
        data2017To2018: null,
        size: CompanySize.NotProvided,
      };
      const company = new Company(companyDataMultiYear);
      const result = company.getTwoYearsConsecutive();
      expect(result).toEqual({
        previousYear: null,
        year: null,
      });
    });
  });
});
