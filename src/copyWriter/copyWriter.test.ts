import { mockCompanyDataItem } from "../unitTestHelpers/mockData";
import { CopyWriter } from './CopyWriter';

const copyWriter = new CopyWriter();
describe("copyWriter", () => {
  it("should construct", () => {
    new CopyWriter();
  });
  describe("medianGpg", () => {
    it("should say the median pays are equal", () => {
      const copy = copyWriter.medianGpg({
        data2021To2022: { medianGpg: 0 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, men's and women's median hourly pay is equal.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the men's salary is higher", () => {
      const copy = copyWriter.medianGpg({
        data2021To2022: { medianGpg: 12.4 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.4% lower than men's.";
      expect(copy).toBe(expectedCopy);
    });
    it("should say the women's salary is higher", () => {
      const copy = copyWriter.medianGpg({
        data2021To2022: { medianGpg: -12.4 },
        data2017To2018: { medianGpg: 10 },
      } as any);
      const expectedCopy =
        "In this organisation, women's median hourly pay is 12.4% higher than men's.";
      expect(copy).toBe(expectedCopy);
    });
  });

  describe('meanGpgWithDifferenceYearOnYear', () => {

    // it(
    //   "should get the copy for the (mean/median) gpg and show the difference between years"
    //   , () => {
    //     const c = new CopyWriter();
    //     c.getDifferenceCopy(mockCompanyDataItem);
    //   });
    test.todo(
      "should get the copy for the (mean/median) gpg and show the difference between years even with one years data missing"
    );
    test.todo(
      "should get the copy for just the (mean/median) gpg when theres not enough data points"
    );
    test.todo(
      "should get the copy for just the (mean/median) gpg when theres not enough data points returning the latest data regardless of year"
    );
    test.todo(
      "should get the copy for the (mean/median) GPG (and do something else?) when no change year on year"
    );
  })
});
