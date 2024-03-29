import { CompanyDataMultiYearItem, CompanyDataSingleYearItem } from "../types";
import { isNumber } from "./numberUtils";

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

  /**
   * Gets a list of years which there should be data for starting from 2017.
   */
  getExpectedYearsOfData(): number[] {
    const allYears: number[] = [];
    const lowestYear = 17;
    let year = this.currentYear + 1;
    while (year >= lowestYear) {
      allYears.push(year);
      year--;
    }

    return allYears;
  }

  companyDataMultiYearToList(): CompanyDataSingleYearItem[] {
    const allYears: CompanyDataSingleYearItem[] = [];
    const expectedYears = this.getExpectedYearsOfData();
    for (let index = 0; index < expectedYears.length; index++) {
      const year = expectedYears[index];
      const yearData = this.companyData[
        `data${year - 1}To${year}` as keyof CompanyDataMultiYearItem
      ] as CompanyDataSingleYearItem;
      if (yearData) {
        allYears.push(yearData);
      }
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
