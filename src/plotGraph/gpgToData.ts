import { CompanyDataMultiYearItem } from "../types";
import { GraphData } from "./plot";

export function gpgToData(companyData: CompanyDataMultiYearItem): GraphData {
  return {
    medianData: [
      { x: 2017, y: companyData.data2017To2018.medianGpg },
      { x: 2018, y: companyData.data2018To2019.medianGpg },
      { x: 2019, y: companyData.data2019To2020.medianGpg },
      { x: 2020, y: companyData.data2020To2021.medianGpg },
      { x: 2021, y: companyData.data2021To2022.medianGpg },
    ].filter((item) => item.y !== null),
    meanData: [
      { x: 2017, y: companyData.data2017To2018.meanGpg },
      { x: 2018, y: companyData.data2018To2019.meanGpg },
      { x: 2019, y: companyData.data2019To2020.meanGpg },
      { x: 2020, y: companyData.data2020To2021.meanGpg },
      { x: 2021, y: companyData.data2021To2022.meanGpg },
    ].filter((item) => item.y !== null),
  };
}
