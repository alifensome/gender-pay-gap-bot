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
});
