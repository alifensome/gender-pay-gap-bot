import { CompanyDataMultiYearItem, CompanySize } from "../types";
import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import { CopyWriter } from './CopyWriter';

const copyWriter = new CopyWriter();
describe("copyWriter", () => {
  it("should construct", () => {
    new CopyWriter();
  });
  describe("medianGpg", () => {
    it("should say the median pays are equal", () => {
      const copy = copyWriter.medianGpg({
        data2021To2022: { medianGpg: 0 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, men's and women's median hourly pay is equal.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the men's salary is higher", () => {
      const copy = copyWriter.medianGpg({
        data2021To2022: { medianGpg: 12.4 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.4% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the women's salary is higher", () => {
      const copy = copyWriter.medianGpg({
        data2021To2022: { medianGpg: -12.4 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.4% higher than men's.";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe("medianGpgWithDifferenceYearOnYear", () => {
    it("should say the median pays are equal", () => {
      const copy = copyWriter.medianGpgWithDifferenceYearOnYear({
        data2021To2022: { medianGpg: 0 },
        data2020To2021: { medianGpg: 10 },
        companyName: "Company Name LTD",
      } as any);
      const expectedCopy =
        "At Company Name LTD, men's and women's median hourly pay is equal, a decrease of 10 percentage points since the previous year";
      expect(copy).toBe(expectedCopy);
    });
    it("should say mens pay is higher", () => {
      const copy = copyWriter.medianGpgWithDifferenceYearOnYear({
        data2021To2022: { medianGpg: 20 },
        data2020To2021: { medianGpg: 10 },
        companyName: "Company Name LTD",
      } as any);
      const expectedCopy =
        "At Company Name LTD, women's median hourly pay is 20% lower than men's, an increase of 10 percentage points since the previous year";
      expect(copy).toBe(expectedCopy);
    });
    it("should women's pay is higher", () => {
      const copy = copyWriter.medianGpgWithDifferenceYearOnYear({
        data2021To2022: { medianGpg: -20 },
        data2020To2021: { medianGpg: -10 },
        companyName: "Company Name LTD",
      } as any);
      const expectedCopy =
        "At Company Name LTD, women's median hourly pay is 20% higher than men's, an increase of 10 percentage points since the previous year";
      expect(copy).toBe(expectedCopy);
    });

    // it(
    //   "should get the copy for the (mean/median) gpg and show the difference between years"
    //   , () => {
    //     const c = new CopyWriter();
    //     c.getDifferenceCopy(mockCompanyDataItem);
    //   });
    it(
      "should get the copy for the (mean/median) gpg and show the difference between years even with one years data missing",
      () => {
        const companyData: CompanyDataMultiYearItem = {
          companyName: "Company Name LTD",
          companyNumber: null,
          sicCodes: "123,456",
          data2022To2023: null,
          data2021To2022: { meanGpg: 11, medianGpg: 12.1 },
          data2020To2021: { meanGpg: 10, medianGpg: 13.3 },
          data2019To2020: null,
          data2018To2019: null,
          data2017To2018: null,
          size: CompanySize.From1000To4999
        }
        const copy = copyWriter.medianGpgWithDifferenceYearOnYear(companyData);
        const expectedCopy =
          "At Company Name LTD, women's median hourly pay is 12.1% lower than men's, a decrease of 1.2 percentage points since the previous year";
        expect(copy).toBe(expectedCopy);
      }
    );
    it(
      "should get the copy for just the (mean/median) gpg when theres not enough data points",
      () => {
        const companyData: CompanyDataMultiYearItem = {
          companyName: "Company Name LTD",
          companyNumber: null,
          sicCodes: "123,456",
          data2022To2023: null,
          data2021To2022: { meanGpg: 11, medianGpg: 12.1 },
          data2020To2021: null,
          data2019To2020: null,
          data2018To2019: null,
          data2017To2018: null,
          size: CompanySize.From1000To4999
        }
        const copy = copyWriter.medianGpgWithDifferenceYearOnYear(companyData);
        const expectedCopy =
          "At Company Name LTD, women's median hourly pay is 12.1% lower than men's.";
        expect(copy).toBe(expectedCopy);
      }
    );
    test.todo(
      "should get the copy for just the (mean/median) gpg when theres not enough data points returning the latest data regardless of year"
    );
    test.todo(
      "should get the copy for the (mean/median) GPG (and do something else?) when no change year on year"
    );
  })
});
