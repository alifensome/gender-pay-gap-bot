import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { CompanyDataMultiYearItem, CompanySize } from "../types";
const importer = new DataImporter();
const repo = new Repository(importer);

const ryanAir: CompanyDataMultiYearItem = {
  companyName: "Ryanair ltd",
  companyNumber: null,
  sicCodes: "51101",
  data2022To2023: {
    diffMedianBonusPercent: 4.77,
    femaleLowerMiddleQuartile: 61.77,
    femaleLowerQuartile: 56.77,
    femaleTopQuartile: 2.42,
    femaleUpperMiddleQuartile: 30.65,
    meanGpg: 62.88,
    medianGpg: 62.69,
  },
  data2021To2022: {
    meanGpg: 45.1,
    medianGpg: 42.8,
    diffMedianBonusPercent: 13.2,
    femaleLowerMiddleQuartile: 22.6,
    femaleLowerQuartile: 29,
    femaleTopQuartile: 6.5,
    femaleUpperMiddleQuartile: 19.4,
  },
  data2020To2021: {
    meanGpg: 67.8,
    medianGpg: 68.6,
    diffMedianBonusPercent: 2.9,
    femaleLowerMiddleQuartile: 46.3,
    femaleLowerQuartile: 55.9,
    femaleTopQuartile: 1.3,
    femaleUpperMiddleQuartile: 3.1,
  },
  data2019To2020: null,
  data2018To2019: {
    meanGpg: 62.2,
    medianGpg: 64.4,
    diffMedianBonusPercent: 11,
    femaleLowerMiddleQuartile: 57.1,
    femaleLowerQuartile: 65.7,
    femaleTopQuartile: 0.4,
    femaleUpperMiddleQuartile: 19,
  },
  data2017To2018: {
    meanGpg: 67,
    medianGpg: 71.8,
    diffMedianBonusPercent: 3.4,
    femaleLowerMiddleQuartile: 76,
    femaleLowerQuartile: 57,
    femaleTopQuartile: 3,
    femaleUpperMiddleQuartile: 16,
  },
  size: CompanySize.From1000To4999,
};
const jamesFisherNuclearLimited: CompanyDataMultiYearItem = {
  companyName: "JFN LIMITED",
  companyNumber: "SC204768",
  sicCodes: "62090",
  data2022To2023: {
    diffMedianBonusPercent: 100,
    femaleLowerMiddleQuartile: 21,
    femaleLowerQuartile: 42,
    femaleTopQuartile: 9,
    femaleUpperMiddleQuartile: 11,
    meanGpg: 32.3,
    medianGpg: 29,
  },
  data2021To2022: {
    meanGpg: 34.3,
    medianGpg: 29.7,
    diffMedianBonusPercent: 45.6,
    femaleLowerMiddleQuartile: 20.9,
    femaleLowerQuartile: 37.9,
    femaleTopQuartile: 6,
    femaleUpperMiddleQuartile: 10.4,
  },
  data2020To2021: {
    meanGpg: 26.7,
    medianGpg: 21.6,
    diffMedianBonusPercent: 100,
    femaleLowerMiddleQuartile: 24,
    femaleLowerQuartile: 40,
    femaleTopQuartile: 9,
    femaleUpperMiddleQuartile: 9,
  },
  data2019To2020: null,
  data2018To2019: {
    meanGpg: 32.4,
    medianGpg: 35.3,
    diffMedianBonusPercent: 72,
    femaleLowerMiddleQuartile: 18,
    femaleLowerQuartile: 45,
    femaleTopQuartile: 8,
    femaleUpperMiddleQuartile: 10,
  },
  data2017To2018: {
    diffMedianBonusPercent: 53.9,
    femaleLowerMiddleQuartile: 14.5,
    femaleLowerQuartile: 43.5,
    femaleTopQuartile: 7.2,
    femaleUpperMiddleQuartile: 10.1,
    meanGpg: 33,
    medianGpg: 38.3,
  },
  size: CompanySize.From250To499,
};

const dorsetHealthcareNhsFoundationTrust: CompanyDataMultiYearItem = {
  companyName: "Dorset Healthcare Nhs Foundation Trust",
  companyNumber: null,
  sicCodes: "1,86210",
  data2022To2023: {
    diffMedianBonusPercent: 9.02,
    femaleLowerMiddleQuartile: 82,
    femaleLowerQuartile: 85.9,
    femaleTopQuartile: 77.8,
    femaleUpperMiddleQuartile: 85.6,
    meanGpg: 13.79,
    medianGpg: 6.28,
  },
  data2021To2022: {
    meanGpg: 14.8,
    medianGpg: 8.7,
    diffMedianBonusPercent: 19.3,
    femaleLowerMiddleQuartile: 80.3,
    femaleLowerQuartile: 87.2,
    femaleTopQuartile: 77.3,
    femaleUpperMiddleQuartile: 84.8,
  },
  data2020To2021: {
    meanGpg: 14.1,
    medianGpg: 8,
    diffMedianBonusPercent: 42.9,
    femaleLowerMiddleQuartile: 82.1,
    femaleLowerQuartile: 85.2,
    femaleTopQuartile: 76.8,
    femaleUpperMiddleQuartile: 86.3,
  },
  data2019To2020: null,
  data2018To2019: {
    meanGpg: 16.4,
    medianGpg: 6.5,
    diffMedianBonusPercent: 50,
    femaleLowerMiddleQuartile: 82.6,
    femaleLowerQuartile: 85.9,
    femaleTopQuartile: 77.6,
    femaleUpperMiddleQuartile: 84.9,
  },
  data2017To2018: {
    meanGpg: 19.1,
    medianGpg: 6.6,
    diffMedianBonusPercent: 45.1,
    femaleLowerMiddleQuartile: 82.2,
    femaleLowerQuartile: 86.7,
    femaleTopQuartile: 77.4,
    femaleUpperMiddleQuartile: 84.8,
  },
  size: CompanySize.From5000To19999,
};

const doncasterMetropolitanBoroughCouncil: CompanyDataMultiYearItem = {
  companyName: "Doncaster Metropolitan Borough Council",
  companyNumber: null,
  sicCodes: "1,84110",
  data2022To2023: {
    diffMedianBonusPercent: null,
    femaleLowerMiddleQuartile: 65,
    femaleLowerQuartile: 85,
    femaleTopQuartile: 57,
    femaleUpperMiddleQuartile: 66,
    meanGpg: 12.54,
    medianGpg: 12.56,
  },
  data2021To2022: {
    meanGpg: 12.9,
    medianGpg: 13.9,
    diffMedianBonusPercent: null,
    femaleLowerMiddleQuartile: 64,
    femaleLowerQuartile: 85,
    femaleTopQuartile: 55,
    femaleUpperMiddleQuartile: 69,
  },
  data2020To2021: {
    meanGpg: 14.1,
    medianGpg: 16,
    diffMedianBonusPercent: null,
    femaleLowerMiddleQuartile: 68,
    femaleLowerQuartile: 85,
    femaleTopQuartile: 55,
    femaleUpperMiddleQuartile: 68,
  },
  data2019To2020: {
    meanGpg: 14.6,
    medianGpg: 16.9,
    diffMedianBonusPercent: null,
    femaleLowerMiddleQuartile: 66,
    femaleLowerQuartile: 85,
    femaleTopQuartile: 53,
    femaleUpperMiddleQuartile: 70,
  },
  data2018To2019: {
    meanGpg: 14.8,
    medianGpg: 16.5,
    diffMedianBonusPercent: 0,
    femaleLowerMiddleQuartile: 68,
    femaleLowerQuartile: 86,
    femaleTopQuartile: 53,
    femaleUpperMiddleQuartile: 69,
  },
  data2017To2018: {
    meanGpg: 15.7,
    medianGpg: 21.1,
    diffMedianBonusPercent: 0,
    femaleLowerMiddleQuartile: 69,
    femaleLowerQuartile: 88,
    femaleTopQuartile: 54,
    femaleUpperMiddleQuartile: 67,
  },
  size: CompanySize.From1000To4999,
};

describe("spot check data", () => {
  it.each([
    [ryanAir],
    [jamesFisherNuclearLimited],
    [dorsetHealthcareNhsFoundationTrust],
    [doncasterMetropolitanBoroughCouncil],
  ])("should get and check the company from the data", (company) => {
    const companyFromData = repo.getCompany(
      company.companyName,
      company.companyNumber
    );
    expect(companyFromData).toEqual(company);
  });
});
