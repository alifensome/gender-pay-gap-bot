import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import { CopyWriter } from "./CopyWriter";

describe("copyWriter", () => {
  it("should construct", () => {
    const c = new CopyWriter();
  });
  it("it should get the difference copy for a company", () => {
    const c = new CopyWriter();
    c.getDifferenceCopy(mockCompanyDataItem);
  });
});
