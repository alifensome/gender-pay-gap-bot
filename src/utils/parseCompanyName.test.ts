import { parseCompanyName } from "./parseCompanyName";

describe("parseCompanyName", () => {
  it("should parse the company name trimming whitespace preserving case", () => {
    const result = parseCompanyName("A  B c ");
    expect(result).toBe("A B c");
  });
});
