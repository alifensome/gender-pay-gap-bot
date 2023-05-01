import { isValidTwitterItem } from "./isValidTwitterItem";

describe("isValidTwitterItem", () => {
  it("should return true for valid twitter items", () => {
    expect(
      isValidTwitterItem({
        twitter_id_str: "twitter_id_str",
        twitter_name: "twitter_name",
        twitter_screen_name: "twitter_screen_name",
        companyName: "companyName",
        companyNumber: null,
      })
    ).toBe(true);
  });
  it("should return false for no id_str twitter items", () => {
    expect(
      isValidTwitterItem({
        twitter_id_str: "",
        twitter_name: "twitter_name",
        twitter_screen_name: "twitter_screen_name",
        companyName: "companyName",
        companyNumber: null,
      })
    ).toBe(false);
  });
  it("should return false for no companyName twitter items", () => {
    expect(
      isValidTwitterItem({
        twitter_id_str: "twitter_id_str",
        twitter_name: "twitter_name",
        twitter_screen_name: "twitter_screen_name",
        companyName: "",
        companyNumber: null,
      })
    ).toBe(false);
  });
  it("should return false for no companyNumber twitter items", () => {
    expect(
      isValidTwitterItem({
        twitter_id_str: "twitter_id_str",
        twitter_id: 1,
        twitter_name: "twitter_name",
        twitter_screen_name: "twitter_screen_name",
        companyName: "companyName",
      } as any)
    ).toBe(false);
  });
  it("should return false for no twitter_screen_name twitter items", () => {
    expect(
      isValidTwitterItem({
        twitter_id_str: "twitter_id_str",
        twitter_name: "twitter_name",
        twitter_screen_name: "",
        companyName: "companyName",
        companyNumber: null,
      })
    ).toBe(false);
  });
});
