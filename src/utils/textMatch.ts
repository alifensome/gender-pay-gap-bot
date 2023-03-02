import { replaceAll } from "./replace";

export function getTextMatch(t1: string, t2: string) {
  const t1Cleaned = replaceAll(t1, "  ", " ").toLowerCase();
  const t2Cleaned = replaceAll(t2, "  ", " ").toLowerCase();

  const t1Parts = t1Cleaned
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => replaceAll(x, " "));

  const t2Parts = t2Cleaned
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => replaceAll(x, " "));

  const t2NumberOfParts = t2Parts.length;
  let includesCount = 0;
  for (let index = 0; index < t2NumberOfParts; index++) {
    const part = t2Parts[index];
    if (t1Parts.includes(part)) {
      includesCount++;
    }
  }
  const t1NumberOfParts = t1Parts.length;
  for (let index = 0; index < t1NumberOfParts; index++) {
    const part = t1Parts[index];
    if (t2Parts.includes(part)) {
      includesCount++;
    }
  }
  return includesCount / (t2NumberOfParts + t1NumberOfParts);
}
