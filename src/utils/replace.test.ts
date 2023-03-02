import { replaceAll, replaceMultiple } from "./replace";

describe("replaceAll", () => {
  it("should replace all instances", () => {
    const result = replaceAll("some ra'ndom sen'tence ' '", "'");
    expect(result).toBe("some random sentence  ");
  });
  it("should replace whitespace", () => {
    const result = replaceAll(" ", " ");
    expect(result).toBe("");
  });
});

describe("replaceMultiple", () => {
  it("should replace from list", () => {
    const sentence = "some ra'ndom sen'tence ' '";
    const result = replaceMultiple(sentence, [
      { find: "'", replace: "" },
      { find: "some", replace: "A" },
    ]);
    expect(result).toBe("A random sentence  ");
  });
});
