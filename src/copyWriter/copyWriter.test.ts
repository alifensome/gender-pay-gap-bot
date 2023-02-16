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
  test.todo(
    "should get the copy for the (mean/median) gpg and show the difference between years"
  );
  test.todo(
    "should get the copy for the (mean/median) gpg and show the difference between years even with one years data missing"
  );
  test.todo(
    "should get the copy for just the (mean/median) gpg when theres not enough data points"
  );
  test.todo(
    "should get the copy for just the (mean/median) gpg when theres not enough data points returning the latest data regardless of year"
  );
});
