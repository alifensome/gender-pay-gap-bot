import { companySizeCategoryToMinSize } from "./companySizeUtils";

export function sortByCompanySize(notFoundCompanies: any[]): any[] {
  return notFoundCompanies.sort((c1, c2) => {
    if (c1.size === undefined && c2.size === undefined) {
      return 0;
    }
    if (
      companySizeCategoryToMinSize(c1.size) >
      companySizeCategoryToMinSize(c2.size)
    ) {
      return -1;
    }

    if (
      companySizeCategoryToMinSize(c1.size) <
      companySizeCategoryToMinSize(c2.size)
    ) {
      return 1;
    }
    return 0;
  });
}
