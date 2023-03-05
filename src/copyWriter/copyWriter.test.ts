import {
  CompanyDataMultiYearItem,
  CompanyDataSingleYearItem,
  CompanySize,
} from "../types";
import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import { CopyWriter } from "./CopyWriter";

const copyWriter = new CopyWriter();
describe("copyWriter", () => {
  it("should construct", () => {
    new CopyWriter();
  });
  describe("medianGpgForThisOrganisation", () => {
    it("should say the median pays are equal", () => {
      const copy = copyWriter.medianGpgForThisOrganisation({
        data2021To2022: { medianGpg: 0 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, men's and women's median hourly pay is equal.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the men's salary is higher", () => {
      const copy = copyWriter.medianGpgForThisOrganisation({
        data2021To2022: { medianGpg: 12.4 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.4% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the women's salary is higher", () => {
      const copy = copyWriter.medianGpgForThisOrganisation({
        data2021To2022: { medianGpg: -12.4 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.4% higher than men's.";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe("medianGpgWithDifferenceYearOnYearForThisOrganisation", () => {
    it("should say the median pays are equal as the gap is lower when -10 change year on year", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 0 },
          data2020To2021: { medianGpg: 10 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, men's and women's median hourly pay is equal. The pay gap is 10 percentage points smaller than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the median pays are equal and the gap is lower when +10 change year on year", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 0 },
          data2020To2021: { medianGpg: -10 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, men's and women's median hourly pay is equal. The pay gap is 10 percentage points smaller than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the median pays are equal and the gap is the same as the previous year", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 0 },
          data2020To2021: { medianGpg: 0 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, men's and women's median hourly pay is equal. The pay gap is the same as the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say mens pay is higher and the gap is increasing", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 20 },
          data2020To2021: { medianGpg: 10 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 20% lower than men's. The pay gap is 10 percentage points wider than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say mens pay is higher and the gap is decreasing", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 10 },
          data2020To2021: { medianGpg: 20 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 10% lower than men's. The pay gap is 10 percentage points smaller than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say mens pay is higher and the gap is the same", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 10 },
          data2020To2021: { medianGpg: 10 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 10% lower than men's. The pay gap is the same as the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that women's pay is higher and the gap is increasing", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: -20 },
          data2020To2021: { medianGpg: -10 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 20% higher than men's. The pay gap is 10 percentage points wider than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that women's pay is higher and the gap is getting lower", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: -20 },
          data2020To2021: { medianGpg: -30 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 20% higher than men's. The pay gap is 10 percentage points smaller than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that women's pay is higher and the gap is the same", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: -20 },
          data2020To2021: { medianGpg: -20 },
          companyName: "Company Name LTD",
        } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 20% higher than men's. The pay gap is the same as the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that women's pay is higher and the gap is increasing when it crosses the 0 mark", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: -2 },
          data2020To2021: { medianGpg: 1 },
          companyName: "Company Name LTD",
        } as any);

      const expectedCopy =
        "In this organisation, women's median hourly pay is 2% higher than men's. In the previous year, women's median hourly pay was 1% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that men's pay is higher and state the previous years data when it crosses the 0 mark", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 1 },
          data2020To2021: { medianGpg: -2 },
          companyName: "Company Name LTD",
        } as any);

      const expectedCopy =
        "In this organisation, women's median hourly pay is 1% lower than men's. In the previous year, women's median hourly pay was 2% higher than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that men's pay is higher and state the previous years data when it crosses the 0 mark by a considerable amount", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: 20 },
          data2020To2021: { medianGpg: -1 },
          companyName: "Company Name LTD",
        } as any);

      const expectedCopy =
        "In this organisation, women's median hourly pay is 20% lower than men's. In the previous year, women's median hourly pay was 1% higher than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say that women's pay is higher and state the previous years data when it crosses the 0 mark by a considerable amount", () => {
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation({
          data2021To2022: { medianGpg: -20 },
          data2020To2021: { medianGpg: 1 },
          companyName: "Company Name LTD",
        } as any);

      const expectedCopy =
        "In this organisation, women's median hourly pay is 20% higher than men's. In the previous year, women's median hourly pay was 1% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should get the copy for the (mean/median) gpg and show the difference between years when theres 2023 data", () => {
      const companyData: CompanyDataMultiYearItem = {
        companyName: "Company Name LTD",
        companyNumber: null,
        sicCodes: "123,456",
        data2022To2023: {
          meanGpg: 11,
          medianGpg: 12.1,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2021To2022: {
          meanGpg: 10,
          medianGpg: 13.3,
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
        size: CompanySize.From1000To4999,
      };
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          companyData
        );
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.1% lower than men's. The pay gap is 1.2 percentage points smaller than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should get the copy for the (mean/median) gpg and show the difference between years even with one years data missing", () => {
      const companyData: CompanyDataMultiYearItem = {
        companyName: "Company Name LTD",
        companyNumber: null,
        sicCodes: "123,456",
        data2022To2023: null,
        data2021To2022: {
          meanGpg: 11,
          medianGpg: 12.1,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2020To2021: {
          meanGpg: 10,
          medianGpg: 13.3,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2019To2020: null,
        data2018To2019: null,
        data2017To2018: null,
        size: CompanySize.From1000To4999,
      };
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          companyData
        );
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.1% lower than men's. The pay gap is 1.2 percentage points smaller than the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should get the copy for just the (mean/median) gpg when theres not enough data points", () => {
      const companyData: CompanyDataMultiYearItem = {
        companyName: "Company Name LTD",
        companyNumber: null,
        sicCodes: "123,456",
        data2022To2023: null,
        data2021To2022: {
          meanGpg: 11,
          medianGpg: 12.1,
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
        size: CompanySize.From1000To4999,
      };
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          companyData
        );
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.1% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should get the copy for just the (mean/median) gpg when theres not enough data points returning the latest data regardless of year", () => {
      const companyData: CompanyDataMultiYearItem = {
        companyName: "Company Name LTD",
        companyNumber: null,
        sicCodes: "123,456",
        data2022To2023: null,
        data2021To2022: null,
        data2020To2021: null,
        data2019To2020: null,
        data2018To2019: null,
        data2017To2018: {
          meanGpg: 11,
          medianGpg: 12.1,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        size: CompanySize.From1000To4999,
      };
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          companyData
        );
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.1% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should get the copy for the median GPG and say there is no change year on year when GPG stays the same", () => {
      const companyData: CompanyDataMultiYearItem = {
        companyName: "Company Name LTD",
        companyNumber: null,
        sicCodes: "123,456",
        data2022To2023: null,
        data2021To2022: {
          meanGpg: 11,
          medianGpg: 13.3,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2020To2021: {
          meanGpg: 12,
          medianGpg: 13.3,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2019To2020: null,
        data2018To2019: null,
        data2017To2018: null,
        size: CompanySize.From1000To4999,
      };
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          companyData
        );
      const expectedCopy =
        "In this organisation, women's median hourly pay is 13.3% lower than men's. The pay gap is the same as the previous year.";
      expect(copy).toBe(expectedCopy);
    });
    it("should fall back on old copy for historic data reported before 2020", () => {
      const companyData: CompanyDataMultiYearItem = {
        companyName: "Shearman & Sterling LLP",
        companyNumber: null,
        size: "Less than 250" as any,
        sicCodes: "69102",
        data2022To2023: null,
        data2021To2022: null,
        data2020To2021: null,
        data2019To2020: {
          meanGpg: 37,
          medianGpg: 52,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2018To2019: {
          meanGpg: 39,
          medianGpg: 54,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
        data2017To2018: {
          meanGpg: 39,
          medianGpg: 54,
          femaleUpperMiddleQuartile: 1,
          diffMedianBonusPercent: 1,
          femaleLowerMiddleQuartile: 2,
          femaleLowerQuartile: 3,
          femaleTopQuartile: 4,
        },
      };
      const copy =
        copyWriter.medianGpgWithDifferenceYearOnYearForThisOrganisation(
          companyData
        );
      const expectedCopy =
        "In this organisation, women's median hourly pay is 52% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe("atCompanyNameMedianPay", () => {
    it("should print men's pay is higher then then women's", () => {
      const copy = copyWriter.getAtCompanyNameMedianPayCopy(
        "company name",
        20.1
      );
      const expectedCopy =
        "At company name, women's median hourly pay is 20.1% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should print women's pay is higher then men's", () => {
      const copy = copyWriter.getAtCompanyNameMedianPayCopy(
        "company name",
        -20.1
      );
      const expectedCopy =
        "At company name, women's median hourly pay is 20.1% higher than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should print women's and men's pay is equal", () => {
      const copy = copyWriter.getAtCompanyNameMedianPayCopy("company name", 0);
      const expectedCopy =
        "At company name, men's and women's median hourly pay is equal.";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe("tweetAtUsMultipleResultsFound", () => {
    it("should say theres multiple results and print the companies", () => {
      const copy = copyWriter.tweetAtUsMultipleResultsFound("user", [
        { companyName: "Barclays Bank PLC Limited" },
        { companyName: "Barclays bank bums" },
        { companyName: "Barclays bank for dog" },
      ]);

      const expectedCopy =
        "@user I found 3 matches for your request. Did you mean:\n\nBarclays Bank PLC Limited\nBarclays bank bums\nBarclays bank for dog\n\nReply with 'pay gap for' followed by the company name and I'll fetch the data";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe("tweetAtUsCouldNotFindResults", () => {
    it("should say theres multiple results and print the companies", () => {
      const copy = copyWriter.tweetAtUsCouldNotFindResults("user");

      const expectedCopy =
        "@user I couldn't find a match for your request, or there are too many companies matching that name. Try searching for them here instead: https://gender-pay-gap.service.gov.uk/";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe("", () => {
    it("should print the quartiles", () => {
      const result = copyWriter.medianMeanGpgQuartilesBonusCopy(
        "user",
        "Company Name",
        mockCompanyDataItem.data2022To2023 as CompanyDataSingleYearItem
      );
      const expectedCopy =
        "@user At Company Name:\nWomen's median hourly pay is 10.1% lower than men's\nWomen's mean hourly pay is 9.5% lower than men's\nWomen's median bonus pay is 1% lower than men's\n\nPercentage of women in each pay quarter:\nUpper: 4%\nUpper middle: 1%\nLower middle: 2%\nLower: 3%";
      expect(result).toBe(expectedCopy);
    });
    it("should allow bonus gap to be null", () => {
      const result = copyWriter.medianMeanGpgQuartilesBonusCopy(
        "user",
        "Company Name",
        {
          ...mockCompanyDataItem.data2022To2023,
          diffMedianBonusPercent: null,
        } as CompanyDataSingleYearItem
      );
      const expectedCopy =
        "@user At Company Name:\nWomen's median hourly pay is 10.1% lower than men's\nWomen's mean hourly pay is 9.5% lower than men's\n\nPercentage of women in each pay quarter:\nUpper: 4%\nUpper middle: 1%\nLower middle: 2%\nLower: 3%";
      expect(result).toBe(expectedCopy);
    });
    it("should not exceed 280 characters less screen name length ~ 10 char", () => {
      const result = copyWriter.medianMeanGpgQuartilesBonusCopy(
        "user",
        "BNP PARIBAS REAL ESTATE ADVISORY & PROPERTY MANAGEMENT UK LIMITED",
        {
          ...mockCompanyDataItem.data2022To2023,
          diffMedianBonusPercent: null,
        } as CompanyDataSingleYearItem
      );
      expect(result.length < 280).toBe(true);
    });

    it("should trim company name when theres not enough chars", () => {
      const result = copyWriter.medianMeanGpgQuartilesBonusCopy(
        "user",
        "BNP PARIBAS REAL ESTATE ADVISORY & PROPERTY MANAGEMENT UK LIMITED More Words",
        {
          ...mockCompanyDataItem.data2022To2023,
          diffMedianBonusPercent: null,
        } as CompanyDataSingleYearItem
      );
      const expectedCopy =
        "@user At BNP PARIBAS REAL ESTATE ADVISORY & PROPERTY MANAGEMENT UK LIMITED More...:\nWomen's median hourly pay is 10.1% lower than men's\nWomen's mean hourly pay is 9.5% lower than men's\n\nPercentage of women in each pay quarter:\nUpper: 4%\nUpper middle: 1%\nLower middle: 2%\nLower: 3%";
      expect(result).toBe(expectedCopy);
    });
  });

  describe("capitaliseFirst", () => {
    it("should capitalise the first letter", () => {
      const result = copyWriter.capitaliseFirst("hello world.");
      expect(result).toBe("Hello world.");
    });
    it("should not throw error if empty string", () => {
      const result = copyWriter.capitaliseFirst("");
      expect(result).toBe("");
    });
  });
});
