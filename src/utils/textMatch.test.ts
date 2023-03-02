import { getTextMatch } from "./textMatch";

describe("getTextMatch", () => {
  it("should return how closely two sentences match", () => {
    const result = getTextMatch("Hello world", "Hello world");
    expect(result).toBe(1);
  });
  it("should not matter what order words are in", () => {
    const result = getTextMatch("Hello world", "world Hello");
    expect(result).toBe(1);
  });
  it("should be case insensitive", () => {
    const result = getTextMatch("Hello world", "WORLD Hello");
    expect(result).toBe(1);
  });
  it("should ignore extra spaces", () => {
    const result = getTextMatch(" Hello   world ", "world Hello");
    expect(result).toBe(1);
  });
  it("should return no match", () => {
    const result = getTextMatch("hi earth", "world Hello");
    expect(result).toBe(0);
  });
  it("should return no match", () => {
    const result = getTextMatch("hello earth", "world Hello");
    expect(result).toBe(0.5);
  });
  it("should return no match", () => {
    const result = getTextMatch("Hi Ali Fensome", "Hi Ali Other");
    expect(result).toBe(2.0 / 3.0);
  });
  it("should not matter which order the args are in", () => {
    const result = getTextMatch("Hi Ali Other", "Hi Ali Fensome");
    expect(result).toBe(2.0 / 3.0);
  });
  it("should show a tenuous match", () => {
    const result = getTextMatch(
      "Hi some other words",
      "Hello other Ali Fensome"
    );
    expect(result).toBe(2.0 / 8.0);
  });
});
