import { parseNullableNumber, parseString } from "./parse";

describe("parseString", () => {
  it("should parse a string removing newlines", () => {
    const result = parseString("hello world \n ");
    expect(result).toBe("hello world  ");
  });
});

describe("parseNullableNumber", () => {
  it("should parse a string to a number", () => {
    const result = parseNullableNumber("10.2");
    expect(result).toBe(10.2);
  });
  it("should parse a negative string to a number", () => {
    const result = parseNullableNumber("  -10.2");
    expect(result).toBe(-10.2);
  });
  it("should parse empty string to null", () => {
    const result = parseNullableNumber("");
    expect(result).toBe(null);
  });
});
