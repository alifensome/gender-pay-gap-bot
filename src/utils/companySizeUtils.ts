import { CompanySize } from "../types";

export function companySizeCategoryToMinSize(companySize: CompanySize): number {
  switch (companySize) {
    case CompanySize.NotProvided:
      return 0;
    case CompanySize.LessThan250:
      return 1;
    case CompanySize.From250To499:
      return 250;
    case CompanySize.From500To999:
      return 500;
    case CompanySize.From1000To4999:
      return 1000;
    case CompanySize.From5000To19999:
      return 5000;
    case CompanySize.MoreThan20000:
      return 20000;
    default:
      throw new Error(`no company size for ${companySize}`);
  }
}
