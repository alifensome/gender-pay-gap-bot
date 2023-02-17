import { CompanyDataMultiYearItem } from "../types";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { isNumber } from "../utils/isNumber";

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

  // used in process.
  medianGpgWithDifferenceYearOnYear(companyData: CompanyDataMultiYearItem): string {
    // has two years consecutive years
    if () {
      // return difference stuff
    }

    // return normal median GPG copy

    if (
      !isNumber(companyData?.data2021To2022?.medianGpg) ||
      !isNumber(companyData?.data2020To2021?.medianGpg)
    ) {
      throw new Error(
        "no median data for required year! This should not have happened!"
      );
    }
    const has2023 = !!companyData.data2022To2023
    const year = has2023 ? companyData.data2022To2023 : companyData.data2021To2022
    const previousYear = has2023 ? companyData.data2021To2022 : companyData.data2020To2021
    if (!year || !previousYear) {
      throw new Error(
        "could not work out the year or previous year data. This should not have happened!"
      );
    }
    const difference =
      year.medianGpg -
      previousYear.medianGpg;
    const roundedDifference = Number(difference.toFixed(1));

    const isPositiveGpg = year.medianGpg >= 0.0;
    const differenceCopy = this.getDifferenceCopy(
      roundedDifference,
      isPositiveGpg
    );
    if (year.medianGpg === 0.0) {
      return `At ${companyData.companyName}, men's and women's median hourly pay is equal, ${differenceCopy}`;
    }
    if (isPositiveGpg) {
      return `At ${companyData.companyName}, women's median hourly pay is ${year.medianGpg}% lower than men's, ${differenceCopy}`;
    } else {
      return `At ${companyData.companyName}, women's median hourly pay is ${-1 * year.medianGpg
        }% higher than men's, ${differenceCopy}`;
    }
  }

  getDifferenceCopy(difference: number, isPositiveGpg: boolean): string {
    if (difference > 0.0) {
      return `an increase of ${difference} percentage points since the previous year`;
    } else if (difference < 0.0) {
      return `${isPositiveGpg ? "a decrease" : "an increase"} of ${-1 * difference
        } percentage points since the previous year`;
    } else if (difference === 0.0) {
      return `this is the same as the previous year`;
    }
    throw new Error('could not determine GPG difference copy.')
  }

}
