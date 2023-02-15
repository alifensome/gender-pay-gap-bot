import { CompanyDataMultiYearItem } from "../types";
import { forCompanyDataMultiYearFindFirstTrue } from "./companyDataMultiYear";
import { isNumber } from "./isNumber";

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

export function isSpecialNotANumber(n: number | bigint) {
  return n != n;
}

export function getMostRecentMedianGPG(data: CompanyDataMultiYearItem): number | null {
  const mostRecent = forCompanyDataMultiYearFindFirstTrue(data, (item) =>
    isNumber(item.medianGpg)
  );
  if (mostRecent) {
    return mostRecent.medianGpg;
  }
  return null;
}

export function getMostRecentMedianGPGOrThrow(data: CompanyDataMultiYearItem): number {
  const mostRecent = getMostRecentMedianGPG(data)
  if (mostRecent !== null) {
    return mostRecent
  }
  throw new Error('could not find most recent GPG with getMostRecentMedianGPG')
}
