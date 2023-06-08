import DataImporter from "../importData";
import { CompanySize } from "../types";
import { companySizeCategoryToMinSize } from "./companySizeUtils";

describe("companySizeCategoryToMinSize", () => {
  it("should convert the company size to min size", () => {
    const result = companySizeCategoryToMinSize(CompanySize.From1000To4999);
    expect(result).toBe(1000);
  });
  it("should throw an error if size is invalid", () => {
    expect(() => companySizeCategoryToMinSize("hi" as any)).toThrowError(
      "no company size for hi"
    );
  });
  it("should be able to pass all the companies in the data set", async () => {
    const dataImporter = new DataImporter();
    const companies = await dataImporter.companiesGpgData();
    for (let index = 0; index < companies.length; index++) {
      const c = companies[index];
      const result = companySizeCategoryToMinSize(c.size);
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(-1);
    }
  });
});
