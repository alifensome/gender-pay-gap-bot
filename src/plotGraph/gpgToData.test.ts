import { CompanyDataMultiYearItem, CompanySize } from "../types";
import { gpgToData } from "./gpgToData";
describe("gpgToData", () => {
  it("should parse the company to a data item", () => {
    const company: CompanyDataMultiYearItem = {
      companyName: "companyName",
      sicCodes: "",
      companyNumber: null,
      data2022To2023: {
        medianGpg: 11,
        meanGpg: 10,
      },
      data2021To2022: {
        medianGpg: 6,
        meanGpg: 1,
      },
      data2020To2021: {
        meanGpg: 2,
        medianGpg: 7,
      },
      data2019To2020: {
        medianGpg: 8,
        meanGpg: 3,
      },
      data2018To2019: {
        meanGpg: 4,
        medianGpg: 9,
      },
      data2017To2018: {
        meanGpg: 5,
        medianGpg: 10,
      },
      size: CompanySize.From250To499,
    };
    const result = gpgToData(company);
    const expectedResult = {
      medianData: [
        { x: 2017, y: 10 },
        { x: 2018, y: 9 },
        { x: 2019, y: 8 },
        { x: 2020, y: 7 },
        { x: 2021, y: 6 },
        { x: 2022, y: 11 },
      ],
      meanData: [
        { x: 2017, y: 5 },
        { x: 2018, y: 4 },
        { x: 2019, y: 3 },
        { x: 2020, y: 2 },
        { x: 2021, y: 1 },
        { x: 2022, y: 10 },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
  it("should parse not include null years with a null value for medianGpg", () => {
    const company: CompanyDataMultiYearItem = {
      companyName: "companyName",
      sicCodes: "",
      companyNumber: null,
      data2022To2023: null,
      data2021To2022: {
        medianGpg: 6,
        meanGpg: 1,
      },
      data2020To2021: {
        meanGpg: 2,
        medianGpg: null as any,
      },
      data2019To2020: {
        medianGpg: 8,
        meanGpg: 3,
      },
      data2018To2019: {
        meanGpg: null as any,
        medianGpg: 9,
      },
      data2017To2018: {
        meanGpg: 5,
        medianGpg: 10,
      },
      size: CompanySize.From250To499,
    };
    const result = gpgToData(company);
    const expectedResult = {
      medianData: [
        { x: 2017, y: 10 },
        { x: 2018, y: 9 },
        { x: 2019, y: 8 },
        { x: 2021, y: 6 },
      ],
      meanData: [
        { x: 2017, y: 5 },
        { x: 2019, y: 3 },
        { x: 2020, y: 2 },
        { x: 2021, y: 1 },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
  it("should parse not include null years", () => {
    const company: CompanyDataMultiYearItem = {
      companyName: "companyName",
      sicCodes: "",
      companyNumber: null,
      data2022To2023: null,
      data2021To2022: {
        medianGpg: 6,
        meanGpg: 1,
      },
      data2020To2021: null,
      data2019To2020: {
        medianGpg: 8,
        meanGpg: 3,
      },
      data2018To2019: null,
      data2017To2018: {
        meanGpg: 5,
        medianGpg: 10,
      },
      size: CompanySize.From250To499,
    };
    const result = gpgToData(company);
    const expectedResult = {
      medianData: [
        { x: 2017, y: 10 },
        { x: 2019, y: 8 },
        { x: 2021, y: 6 },
      ],
      meanData: [
        { x: 2017, y: 5 },
        { x: 2019, y: 3 },
        { x: 2021, y: 1 },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
  it("should parse the company to a data item even when 0", () => {
    const company: CompanyDataMultiYearItem = {
      companyName: "companyName",
      sicCodes: "",
      companyNumber: null,
      data2022To2023: null,
      data2021To2022: {
        medianGpg: 0,
        meanGpg: 1,
      },
      data2020To2021: {
        meanGpg: 2,
        medianGpg: 7,
      },
      data2019To2020: {
        medianGpg: 8,
        meanGpg: 3,
      },
      data2018To2019: {
        meanGpg: 0,
        medianGpg: 9,
      },
      data2017To2018: {
        meanGpg: 5,
        medianGpg: 10,
      },
      size: CompanySize.From250To499,
    };
    const result = gpgToData(company);
    const expectedResult = {
      medianData: [
        { x: 2017, y: 10 },
        { x: 2018, y: 9 },
        { x: 2019, y: 8 },
        { x: 2020, y: 7 },
        { x: 2021, y: 0 },
      ],
      meanData: [
        { x: 2017, y: 5 },
        { x: 2018, y: 0 },
        { x: 2019, y: 3 },
        { x: 2020, y: 2 },
        { x: 2021, y: 1 },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
});
