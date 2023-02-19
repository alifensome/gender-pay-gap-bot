import { CompanyDataMultiYearItem } from "../types";
import { isNumber } from "../utils/numberUtils";
import { GraphData, GraphDataPoint } from "./plot";

export function gpgToData(companyData: CompanyDataMultiYearItem): GraphData {
  const medianData = [
    { x: 2017, y: companyData.data2017To2018?.medianGpg },
    { x: 2018, y: companyData.data2018To2019?.medianGpg },
    { x: 2019, y: companyData.data2019To2020?.medianGpg },
    { x: 2020, y: companyData.data2020To2021?.medianGpg },
    { x: 2021, y: companyData.data2021To2022?.medianGpg },
    { x: 2022, y: companyData.data2022To2023?.medianGpg },
  ].filter((item) => isNumber(item.y)) as GraphDataPoint[];

  const meanData = [
    { x: 2017, y: companyData.data2017To2018?.meanGpg },
    { x: 2018, y: companyData.data2018To2019?.meanGpg },
    { x: 2019, y: companyData.data2019To2020?.meanGpg },
    { x: 2020, y: companyData.data2020To2021?.meanGpg },
    { x: 2021, y: companyData.data2021To2022?.meanGpg },
    { x: 2022, y: companyData.data2022To2023?.meanGpg },
  ].filter((item) => isNumber(item.y)) as GraphDataPoint[];
  return {
    medianData,
    meanData,
  };
}
