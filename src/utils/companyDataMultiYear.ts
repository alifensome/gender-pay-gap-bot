import { bool } from "aws-sdk/clients/signer";
import { CompanyDataMultiYearItem, CompanyDataSingleYearItem } from "../types";

const currentYear = new Date().getFullYear();

export function companyDataMultiYearToList(
  company: CompanyDataMultiYearItem
): CompanyDataSingleYearItem[] {
  const allYears = [];
  const lowestYear = 17;
  let year = currentYear;
  while (year >= lowestYear) {
    const yearData = company[`data${year - 1}To${year}`];
    if (yearData) {
      allYears.push(yearData);
    }
    year--;
  }

  return allYears;
}

type PredicateFn = (item: CompanyDataSingleYearItem) => bool;

export function forCompanyDataMultiYearFindFirstTrue(
  company: CompanyDataMultiYearItem,
  predicate: PredicateFn
): CompanyDataSingleYearItem | null {
  const list = companyDataMultiYearToList(company);
  for (const item of list) {
    if (predicate(item)) {
      return item;
    }
  }
  return null;
}
