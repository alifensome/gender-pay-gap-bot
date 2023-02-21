import { CompanyDataMultiYearItem, CompanySize } from "../types";
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
        data2022To2023: { meanGpg: 11, medianGpg: 12.1 },
        data2021To2022: { meanGpg: 10, medianGpg: 13.3 },
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
        data2021To2022: { meanGpg: 11, medianGpg: 12.1 },
        data2020To2021: { meanGpg: 10, medianGpg: 13.3 },
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
        data2021To2022: { meanGpg: 11, medianGpg: 12.1 },
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
        data2017To2018: { meanGpg: 11, medianGpg: 12.1 },
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
        data2021To2022: { meanGpg: 11, medianGpg: 13.3 },
        data2020To2021: { meanGpg: 12, medianGpg: 13.3 },
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
  });
});
