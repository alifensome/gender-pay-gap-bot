import { CompanyDataMultiYearItem } from "../types";
import { Company } from "../utils/Company";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { isNumber } from "../utils/isNumber";

export class CopyWriter {
  medianGpgForThisOrganisationPartialSentence(
    companyData: CompanyDataMultiYearItem
  ): string {
    const mostRecentGPG = getMostRecentMedianGPGOrThrow(companyData);
    let mostRecent = 0;

    if (typeof mostRecentGPG === "string") {
      mostRecent = parseFloat(mostRecentGPG);
    } else {
      mostRecent = mostRecentGPG;
    }
    const isPositiveGpg = mostRecent > 0.0;
    if (mostRecent === 0.0) {
      return `In this organisation, men's and women's median hourly pay is equal`;
    }
    if (isPositiveGpg) {
      return `In this organisation, women's median hourly pay is ${mostRecent}% lower than men's`;
    } else {
      return `In this organisation, women's median hourly pay is ${
        -1 * mostRecent
      }% higher than men's`;
    }
  }
  medianGpgForThisOrganisation(companyData: CompanyDataMultiYearItem): string {
    return `${this.medianGpgForThisOrganisationPartialSentence(companyData)}.`;
  }

  // used in process.
  medianGpgWithDifferenceYearOnYearForThisOrganisation(
    companyData: CompanyDataMultiYearItem
  ): string {
    // has two years consecutive years
    const company = new Company(companyData);
    if (company.hasTwoYearsConsecutive()) {
      const previousYears = company.getTwoYearsConsecutive();
      // return difference stuff
      const year = previousYears!.year!;
      const previousYear = previousYears!.previousYear!;

      const difference = year.medianGpg - previousYear.medianGpg;
      const roundedDifference = Number(difference.toFixed(1));

      const isPositiveGpg = year.medianGpg >= 0.0;
      const differenceCopy = this.getDifferenceCopy(
        roundedDifference,
        isPositiveGpg
      );
      const medianGpgCopy =
        this.medianGpgForThisOrganisationPartialSentence(companyData);
      return `${medianGpgCopy}, ${differenceCopy}`;
    }
    return this.medianGpgForThisOrganisation(companyData);
  }

  getDifferenceCopy(difference: number, isPositiveGpg: boolean): string {
    if (difference > 0.0) {
      return `an increase of ${difference} percentage points since the previous year`;
    } else if (difference < 0.0) {
      return `${isPositiveGpg ? "a decrease" : "an increase"} of ${
        -1 * difference
      } percentage points since the previous year`;
    } else if (difference === 0.0) {
      return `this is the same as the previous year`;
    }
    throw new Error("could not determine GPG difference copy.");
  }
}
