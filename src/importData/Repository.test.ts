import { companySizeCategoryToMinSize } from "../utils/companySizeUtils";
import { Repository } from "./Repository";
import { CompanyDataMultiYearItem, CompanySize } from "../types";

const twitterDataItem1 = {
  twitter_id_str: "123",
  companyName: "JOHNSON CONTROLS BUILDING EFFICIENCY UK LIMITED",
  companyNumber: "08993483",
};
const twitterDataItem2 = {
  twitter_id_str: "789",
  companyName: "NAME",
  companyNumber: null,
};
const johnsonBuildingCompany = {
  companyName: "JOHNSON CONTROLS BUILDING EFFICIENCY UK LIMITED",
  companyNumber: "08993483",
  sicCodes: "43220,81100",
  data2021To2022: { meanGpg: null, medianGpg: null },
  data2020To2021: { meanGpg: 26.4, medianGpg: 28 },
  data2019To2020: { meanGpg: null, medianGpg: null },
  data2018To2019: { meanGpg: 16.9, medianGpg: 21.3 },
  data2017To2018: { meanGpg: 13.4, medianGpg: 20.5 },
};
const aliBuildingCompanyDataItem = {
  companyName: "Ali CONTROLS BUILDING EFFICIENCY UK LIMITED",
  companyNumber: "08993483",
  sicCodes: "43220,81100",
  data2021To2022: { meanGpg: null, medianGpg: null },
  data2020To2021: { meanGpg: 26.4, medianGpg: 28 },
  data2019To2020: { meanGpg: null, medianGpg: null },
  data2018To2019: { meanGpg: 16.9, medianGpg: 21.3 },
  data2017To2018: { meanGpg: 13.4, medianGpg: 20.5 },
};
const accenture = {
  companyName: "ACCENTURE (UK) LIMITED",
  companyNumber: "04757301",
  size: "5000 to 19,999",
  sicCodes: "70229",
  data2022To2023: null,
  data2021To2022: {
    meanGpg: 20.2,
    medianGpg: 16.1,
  },
  data2020To2021: {
    meanGpg: 17.4,
    medianGpg: 12.1,
  },
  data2019To2020: {
    meanGpg: 16.6,
    medianGpg: 9.8,
  },
  data2018To2019: {
    meanGpg: 16.7,
    medianGpg: 10.6,
  },
  data2017To2018: {
    meanGpg: 16.7,
    medianGpg: 10.2,
  },
};

const hsbcPlc = {
  companyName: "HSBC plc",
} as any;
const hsbcBank = {
  companyName: "HSBC bank",
} as any;
const hsbcBankUk = {
  companyName: "HSBC Bank uk",
} as any;

const companyDataItemNoNumber = {
  companyName: "NAME",
  companyNumber: null,
  sicCodes: "companyDataItemNoNumber",
};
const companyDataItemNoName = {
  companyName: "",
  companyNumber: "123",
  sicCodes: "companyDataItemNoName",
};
describe("Repository", () => {
  const mockDataImporter = {
    twitterUserDataProd: jest
      .fn()
      .mockReturnValue([
        twitterDataItem1,
        { twitter_id_str: "456" },
        twitterDataItem2,
      ]),
    companiesGpgData: jest
      .fn()
      .mockReturnValue([
        johnsonBuildingCompany,
        companyDataItemNoNumber,
        companyDataItemNoName,
        aliBuildingCompanyDataItem,
        accenture,
        hsbcBankUk,
        hsbcPlc,
        hsbcBank,
      ]),
  };
  const repo = new Repository(mockDataImporter as any);
  describe("getTwitterUserByTwitterId", () => {
    it("should get company by twitterId", () => {
      const result = repo.getTwitterUserByTwitterId("123");
      expect(result).toEqual(twitterDataItem1);
    });
    it("should return null if they don't exist", () => {
      const result = repo.getTwitterUserByTwitterId("890");
      expect(result).toEqual(null);
    });
  });
  describe("getGpgForTwitterId", () => {
    it("should get the full company for the twitterId", () => {
      const result = repo.getGpgForTwitterId("123");
      expect(result).toEqual({
        companyData: johnsonBuildingCompany,
        twitterData: twitterDataItem1,
      });
    });
    it("should get the full company for the twitterId even with no companyId", () => {
      const result = repo.getGpgForTwitterId("789");
      expect(result).toEqual({
        companyData: companyDataItemNoNumber,
        twitterData: twitterDataItem2,
      });
    });
  });

  describe("getCompanyByNumber", () => {
    it("should get the company by name", () => {
      const result = repo.getCompany("name", "companyNumber");
      expect(result).toEqual(companyDataItemNoNumber);
    });
    it("should get the company by companyNumber", () => {
      const result = repo.getCompany("", "123");
      expect(result).toEqual(companyDataItemNoName);
    });
    it("should return null for nulls", () => {
      const result = repo.getCompany(null as any, null);
      expect(result).toEqual(null);
    });
    it("should return null nothing for empty string and null", () => {
      const result = repo.getCompany("", null);
      expect(result).toEqual(null);
    });
  });

  describe("getNextCompanyWithData", () => {
    const getNextCompanyWithDataMockDataImporter = {
      twitterUserDataProd: jest
        .fn()
        .mockReturnValue([
          twitterDataItem1,
          { twitter_id_str: "456" },
          twitterDataItem2,
        ]),
      companiesGpgData: jest.fn().mockReturnValue([
        {
          companyName: "A",
          companyNumber: "01",
          data2021To2022: { meanGpg: 1, medianGpg: 1.5 },
          data2020To2021: { meanGpg: 26.4, medianGpg: 28 },
        },
        {
          companyName: "B",
          companyNumber: "02",
          data2021To2022: { meanGpg: 2, medianGpg: 2.5 },
          data2020To2021: { meanGpg: 2.1, medianGpg: 2.4 },
        },
        {
          companyName: "C",
          companyNumber: "03",
          data2021To2022: { meanGpg: null, medianGpg: null },
          data2020To2021: { meanGpg: 2.1, medianGpg: 2.4 },
        },
        {
          companyName: "D",
          companyNumber: "04",
          data2021To2022: { medianGpg: 4.5, meanGpg: 4 },
          data2020To2021: { medianGpg: 4.4, meanGpg: 4.1 },
        },
      ]),
    };
    const getNextCompanyWithDataRepo = new Repository(
      getNextCompanyWithDataMockDataImporter as any
    );
    it("should Get next company with data", () => {
      const result = getNextCompanyWithDataRepo.getNextCompanyWithData(
        "B",
        "02"
      );
      expect(result).toEqual({
        companyName: "D",
        companyNumber: "04",
        data2021To2022: { meanGpg: 4, medianGpg: 4.5 },
        data2020To2021: { meanGpg: 4.1, medianGpg: 4.4 },
      });
    });

    describe("getNextMatchingCompanyWithData", () => {
      const mockDataImporter = {
        twitterUserDataProd: jest
          .fn()
          .mockReturnValue([
            twitterDataItem1,
            { twitter_id_str: "456" },
            twitterDataItem2,
          ]),
        companiesGpgData: jest.fn().mockReturnValue([
          {
            companyName: "A",
            companyNumber: "01",
            data2021To2022: { meanGpg: 1, medianGpg: 1.5 },
            data2020To2021: { meanGpg: 26.4, medianGpg: 28 },
            size: CompanySize.From250To499,
          },
          {
            companyName: "B",
            companyNumber: "02",
            data2021To2022: { meanGpg: 2, medianGpg: 2.5 },
            data2020To2021: { meanGpg: 2.1, medianGpg: 2.4 },
            size: CompanySize.From250To499,
          },
          {
            companyName: "C",
            companyNumber: "03",
            data2021To2022: { meanGpg: null, medianGpg: null },
            data2020To2021: { meanGpg: 2.1, medianGpg: 2.4 },
            size: CompanySize.From250To499,
          },
          {
            companyName: "D",
            companyNumber: "04",
            data2021To2022: { meanGpg: 4, medianGpg: 4.5 },
            data2020To2021: { meanGpg: 4.1, medianGpg: 4.4 },
            size: CompanySize.From1000To4999,
          },
        ]),
      };
      const getNextMatchingCompanyWithDataRepo = new Repository(
        mockDataImporter as any
      );

      it("should match a company", () => {
        const matcher = (c: CompanyDataMultiYearItem) => {
          return companySizeCategoryToMinSize(c.size) >= 1000;
        };
        const result =
          getNextMatchingCompanyWithDataRepo.getNextMatchingCompanyWithData(
            "B",
            "02",
            matcher
          );
        const expectedResult = {
          companyName: "D",
          companyNumber: "04",
          data2021To2022: { meanGpg: 4, medianGpg: 4.5 },
          data2020To2021: { meanGpg: 4.1, medianGpg: 4.4 },
          size: CompanySize.From1000To4999,
        };
        expect(result).toEqual(expectedResult);
      });
      it("should return null if theres no matches", () => {
        const matcher = (c: CompanyDataMultiYearItem) => {
          return companySizeCategoryToMinSize(c.size) >= 100000;
        };
        const result =
          getNextMatchingCompanyWithDataRepo.getNextMatchingCompanyWithData(
            "B",
            "02",
            matcher
          );
        expect(result).toBe(null);
      });
    });
  });

  describe("fuzzyFindCompanyByName", () => {
    it("should find by exact match", () => {
      const result = repo.fuzzyFindCompanyByName(
        johnsonBuildingCompany.companyName
      );
      expect(result).toEqual({
        exactMatch: johnsonBuildingCompany,
        closeMatches: [],
      });
    });
    it("should find partial match", () => {
      const result = repo.fuzzyFindCompanyByName(
        "Ali CONTROLS BUILDING EFFICIENCY"
      );
      expect(result).toEqual({
        exactMatch: null,
        closeMatches: [aliBuildingCompanyDataItem],
      });
    });
    it("should find partial match with case insensitivity", () => {
      const result = repo.fuzzyFindCompanyByName(
        "Ali CONTROLS BUILDing EFFICIENCY"
      );
      expect(result).toEqual({
        exactMatch: null,
        closeMatches: [aliBuildingCompanyDataItem],
      });
    });
    it("should find partial match with weird brackets", () => {
      const result = repo.fuzzyFindCompanyByName("ACCENTURE (UK) LIMITED");
      expect(result).toEqual({
        exactMatch: accenture,
        closeMatches: [],
      });
    });
    it("should handle single word requests", () => {
      const result = repo.fuzzyFindCompanyByName("ACCENTURE");
      expect(result).toEqual({
        exactMatch: null,
        closeMatches: [accenture],
      });
    });
    it("should find difference between similar names", () => {
      const result = repo.fuzzyFindCompanyByName("HSBC");
      expect(result).toEqual({
        exactMatch: null,
        closeMatches: [hsbcPlc, hsbcBank, hsbcBankUk],
      });
    });
    it("should order potential matches by how close that are", () => {
      const result = repo.fuzzyFindCompanyByName("Ali CONTROLS BUILDING");
      expect(result).toEqual({
        exactMatch: null,
        closeMatches: [aliBuildingCompanyDataItem],
      });
    });
  });
});
