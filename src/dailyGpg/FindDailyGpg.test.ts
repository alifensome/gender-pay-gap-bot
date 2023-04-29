import {
  daysSinceBeginningOfYear,
  findDailyGpg,
  findPercentageGpgRange,
} from "./FindDailyGpg";
// Not convinced this is right.
const d = new Date(2022, 2, 13, 1, 2, 3);
describe("findDailyGpg", () => {
  it("should get the companies with a GPG for that day", () => {
    findDailyGpg(d);
  });
});

describe("findPercentageGpgRange", () => {
  it("should  find a range of percentages for the last day of the year", () => {
    const endOfYear = new Date(2022, 11, 31);
    const result = findPercentageGpgRange(endOfYear);
    expect(result).toEqual({
      startPercentage: 0,
      endPercentage: 100 / 365,
    });
  });
  it("should  find a range of percentages for the first day of the year", () => {
    const beginningOfYear = new Date(2022, 0, 1);
    const result = findPercentageGpgRange(beginningOfYear);
    expect(result).toEqual({
      startPercentage: 100 - 100 / 365,
      endPercentage: 100,
    });
  });
  it.skip("should find a range of percentages for middle of year", () => {
    const middleOfYear = new Date(2022, 6, 2, 0, 0, 0, 0);
    const result = findPercentageGpgRange(middleOfYear);
    expect(result).toEqual({
      endPercentage: 50.410958904109584,
      startPercentage: 50.13698630136986,
    });
  });
});

describe("daysSinceBeginningOfYear", () => {
  it("should find days since beginning of year", () => {
    const days = daysSinceBeginningOfYear(d);
    expect(days).toBe(72);
  });
  it("should find days since beginning of year", () => {
    const days = daysSinceBeginningOfYear(new Date(2022, 0, 1));
    expect(days).toBe(1);
  });
  it("should find days since beginning of year", () => {
    const days = daysSinceBeginningOfYear(new Date(2022, 11, 31));
    expect(days).toBe(365);
  });
});
