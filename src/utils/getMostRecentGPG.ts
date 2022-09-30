import { CompanyDataMultiYearItem } from "../types";
import { forCompanyDataMultiYearFindFirstTrue } from "./companyDataMultiYear";

export function getMostRecentGPG(
  data: CompanyDataMultiYearItem
): number | null {
  const mostRecent = forCompanyDataMultiYearFindFirstTrue(data, (item) =>
    isNumber(item.meanGpg)
  );
  if (mostRecent) {
    return mostRecent.meanGpg;
  }
  return null;
}

export function isNumber(n: any): boolean {
  if (n === null || n === undefined || n === "") {
    return false;
  }
  if (typeof n === "string") {
    let parsedStringNumber = parseFloat(n);
    return isNumber(parsedStringNumber);
  }
  if (typeof n === "number" || typeof n === "bigint") {
    if (isSpecialNotANunber(n)) {
      return false;
    }
    return true;
  }
  return false;
}

function isSpecialNotANunber(n: number | bigint) {
  return n != n;
}

export function getMostRecentMedianGPG(data: CompanyDataMultiYearItem) {
  const mostRecent = forCompanyDataMultiYearFindFirstTrue(data, (item) =>
    isNumber(item.medianGpg)
  );
  if (mostRecent) {
    return mostRecent.medianGpg;
  }
  return null;
}
