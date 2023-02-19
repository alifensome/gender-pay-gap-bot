import { modulus } from "./numberUtils";

describe("modulus", () => {
  it("should return a positive number", () => {
    expect(modulus(-1)).toBe(1);
    expect(modulus(1)).toBe(1);
    expect(modulus(0)).toBe(0);
  });
});
