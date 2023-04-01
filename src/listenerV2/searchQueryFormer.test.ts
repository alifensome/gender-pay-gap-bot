import { SearchQueryFormer } from "./searchQueryFormer";

describe("SearchQueryFormer", () => {
  const searchQueryFormer = new SearchQueryFormer();
  it("should form a from query", () => {
    const result = searchQueryFormer.toQuery(["a", "b"]);
    expect(result).toEqual(["from:a%20OR%20from:b"]);
  });
  it("should enforce a character limit", () => {
    const searchQueryFormer = new SearchQueryFormer();
    searchQueryFormer.characterLimit = 25;
    const result = searchQueryFormer.toQuery(["a", "b", "c", "d"]);
    expect(result).toEqual(["from:a%20OR%20from:b", "from:c%20OR%20from:d"]);
  });
});
