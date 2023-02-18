import { CompanyDataMultiYearItem, CompanyDataSingleYearItem } from "../types";
import { isNumber } from "./isNumber";

type PredicateFn = (item: CompanyDataSingleYearItem) => boolean;

export class Company {
  currentYear = new Date().getFullYear();
  constructor(private companyData: CompanyDataMultiYearItem) {}

  hasTwoYearsConsecutive(): boolean {
    const years = this.getTwoYearsConsecutive();
    return !!years.year && !!years.previousYear;
  }
  getTwoYearsConsecutive(): {
    year: CompanyDataSingleYearItem | null;
    previousYear: CompanyDataSingleYearItem | null;
  } {
    if (this.companyData.data2022To2023 && this.companyData.data2021To2022) {
      return {
        previousYear: this.companyData.data2021To2022,
        year: this.companyData.data2022To2023,
      };
    }
    if (this.companyData.data2021To2022 && this.companyData.data2020To2021) {
      return {
        previousYear: this.companyData.data2020To2021,
        year: this.companyData.data2021To2022,
      };
    }

    return {
      previousYear: null,
      year: null,
    };
  }
  getMostRecentItem(): CompanyDataSingleYearItem | null {
    const mostRecent = this.forCompanyDataMultiYearFindFirstTrue(
      (item) => isNumber(item?.meanGpg) && isNumber(item?.medianGpg)
    );
    if (mostRecent) {
      return mostRecent;
    }
    return null;
  }

  companyDataMultiYearToList(): CompanyDataSingleYearItem[] {
    const allYears: CompanyDataSingleYearItem[] = [];
    const lowestYear = 17;
    let year = this.currentYear + 1;
    while (year >= lowestYear) {
      const yearData = this.companyData[
        `data${year - 1}To${year}` as keyof CompanyDataMultiYearItem
      ] as CompanyDataSingleYearItem;
      if (yearData) {
        allYears.push(yearData);
      }
      year--;
    }

    return allYears;
  }

  forCompanyDataMultiYearFindFirstTrue(
    predicate: PredicateFn
  ): CompanyDataSingleYearItem | null {
    const list = this.companyDataMultiYearToList();
    for (const item of list) {
      if (predicate(item)) {
        return item;
      }
    }
    return null;
  }
}
