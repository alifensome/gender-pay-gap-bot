import { replaceMultiple } from "../utils/replace";

export function replaceSearchTerms(name: string): string {
  const nameUpper = name.toUpperCase();
  const removedBrackets = nameUpper.replace(/ *\([^)]*\) */g, " "); // remove stuff in brackets.;
  return replaceMultiple(removedBrackets, [
    { find: " LIMITED" },
    { find: " PLC" },
    { find: " LTD" },
    { find: "\\(" },
    { find: "\\)" },
    { find: "\\." },
    { find: "\\," },
    { find: " UK" },
    { find: "  ", replace: " " },
  ]).trimEnd();
}
