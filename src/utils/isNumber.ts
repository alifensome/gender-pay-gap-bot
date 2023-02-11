import { isSpecialNotANumber } from "./getMostRecentGPG";

export function isNumber(n: any): boolean {
  if (n === null || n === undefined || n === "") {
    return false;
  }
  if (typeof n === "string") {
    let parsedStringNumber = parseFloat(n);
    return isNumber(parsedStringNumber);
  }
  if (typeof n === "number" || typeof n === "bigint") {
    if (isSpecialNotANumber(n)) {
      return false;
    }
    return true;
  }
  return false;
}
