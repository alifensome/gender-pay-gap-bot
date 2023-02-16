import { bool } from "aws-sdk/clients/signer";
import { CompanyDataMultiYearItem, CompanyDataSingleYearItem } from "../types";

const currentYear = new Date().getFullYear();

export function companyDataMultiYearToList(
  company: CompanyDataMultiYearItem
): CompanyDataSingleYearItem[] {
  const allYears: CompanyDataSingleYearItem[] = [];
  const lowestYear = 17;
  let year = currentYear + 1;
  while (year >= lowestYear) {
    const yearData = (company[`data${year - 1}To${year}` as keyof CompanyDataMultiYearItem]) as CompanyDataSingleYearItem;
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
