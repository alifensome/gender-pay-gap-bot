import { formDeduplicatedListOfCompanies } from "./formDeduplicatedListOfCompanies";
import { mockImportedData } from "./testUtils";

describe("formDeduplicatedListOfCompanies", () => {
  it("should Form deduplicated list of companies", () => {
    const result = formDeduplicatedListOfCompanies(mockImportedData);
    expect(result).toStrictEqual([
      { companyName: "abc", companyNumber: "123" },
      { companyName: "def", companyNumber: "789" },
      { companyName: "xyz", companyNumber: "5678" },
    ]);
  });
});
