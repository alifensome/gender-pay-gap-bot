import { CompanyDataMultiYearItem } from "../types";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";

export class CopyWriter {


  medianGpg(companyData: CompanyDataMultiYearItem): string {
    const mostRecentGPG = getMostRecentMedianGPGOrThrow(companyData);
    let mostRecent = 0;

    if (typeof mostRecentGPG === "string") {
      mostRecent = parseFloat(mostRecentGPG);
    } else {
      mostRecent = mostRecentGPG;
    }
    const isPositiveGpg = mostRecent > 0.0;
    if (mostRecent === 0.0) {
      return `In this organisation, men's and women's median hourly pay is equal.`;
    }
    if (isPositiveGpg) {
      return `In this organisation, women's median hourly pay is ${mostRecent}% lower than men's.`;
    } else {
      return `In this organisation, women's median hourly pay is ${-1 * mostRecent
        }% higher than men's.`;
    }
  }
  getDifferenceCopy(
    companyDataMultiYearItem: CompanyDataMultiYearItem
  ): string {
    return "";
  }
}
