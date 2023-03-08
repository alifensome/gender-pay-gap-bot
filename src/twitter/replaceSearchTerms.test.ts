import { replaceMultiple } from "../utils/replace";
import { replaceSearchTerms } from "./replaceSearchTerms";

describe("replaceSearchTerms", () => {
  it("should replace stuff in brackets", () => {
    const result = replaceSearchTerms("University of stirling(The)");
    expect(result).toBe("UNIVERSITY OF STIRLING");
  });
  it("should replace dots", () => {
    const result = replaceSearchTerms("University of s.tirling");
    expect(result).toBe("UNIVERSITY OF STIRLING");
  });
  it("should replace plc", () => {
    const result = replaceSearchTerms("University plc of stirling");
    expect(result).toBe("UNIVERSITY OF STIRLING");
  });
  it("should replace plc", () => {
    const result = replaceSearchTerms("University LIMITED of stirling");
    expect(result).toBe("UNIVERSITY OF STIRLING");
  });
  it("should replace brackets in the middle of a word", () => {
    const result = replaceSearchTerms("ACCENTURE (UK) LIMITED");
    expect(result).toBe("ACCENTURE");
  });
  it("should be case insensitive", () => {
    const result = replaceSearchTerms("a b c uk uK (UK) LIMITED . plC , ");
    expect(result).toBe("A B C");
  });
});
