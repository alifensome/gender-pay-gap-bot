import { CompanySize } from "../types";
import { sortByCompanySize } from "./sortByCompanySize";

describe("sortByCompanySize", () => {
  it("should sort by company size descending", () => {
    const result = sortByCompanySize([
      { size: CompanySize.NotProvided },
      { size: CompanySize.LessThan250 },
      { size: CompanySize.From500To999 },
    ]);
    expect(result).toEqual([
      { size: CompanySize.From500To999 },
      { size: CompanySize.LessThan250 },
      { size: CompanySize.NotProvided },
    ]);
  });
  it("should not break when no size is entered", () => {
    const result = sortByCompanySize([
      { companyName: "1" },
      { companyName: "2" },
      { companyName: "3" },
    ]);
    expect(result).toEqual([
      { companyName: "1" },
      { companyName: "2" },
      { companyName: "3" },
    ]);
  });
});
