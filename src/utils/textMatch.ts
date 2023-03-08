import { replaceAll } from "./replace";

export function stringSplitByWords(s: string): string[] {
  const sCleaned = replaceAll(s, "  ", " ").toLowerCase();

  const sParts = sCleaned
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => replaceAll(x, " "));
  return sParts;
}

export function toAcronym(word: string) {
  return stringSplitByWords(word)
    .reduce((acc, value) => acc + value[0], "")
    .toUpperCase();
}

export function getTextMatch(t1: string, t2: string) {
  const t1Parts = stringSplitByWords(t1);

  const t2Parts = stringSplitByWords(t2);

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
