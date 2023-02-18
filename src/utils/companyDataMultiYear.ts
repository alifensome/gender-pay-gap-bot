import { bool } from "aws-sdk/clients/signer";
import { CompanyDataMultiYearItem, CompanyDataSingleYearItem } from "../types";
import { Company } from "./Company";

const currentYear = new Date().getFullYear();

export function companyDataMultiYearToList(
  company: CompanyDataMultiYearItem
): CompanyDataSingleYearItem[] {
  return new Company(company).companyDataMultiYearToList();
}

type PredicateFn = (item: CompanyDataSingleYearItem) => bool;

export function forCompanyDataMultiYearFindFirstTrue(
  company: CompanyDataMultiYearItem,
  predicate: PredicateFn
): CompanyDataSingleYearItem | null {
  return new Company(company).forCompanyDataMultiYearFindFirstTrue(predicate);
}
