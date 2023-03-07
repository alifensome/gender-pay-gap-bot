import { deduplicateList } from "./deduplicateList";

describe("deduplicateList", () => {
  it("should deduplicate", () => {
    expect(deduplicateList([1, 2, 3, 1], (x, y) => x === y)).toEqual([1, 2, 3]);
  });
});
