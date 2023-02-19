export function replaceAll(
  str: string,
  find: string,
  replace: string = ""
): string {
  const re = new RegExp(find, "g");
  return str.replace(re, replace);
}

export function replaceMultiple(
  str: string,
  replacements: { find: string; replace?: string }[]
): string {
  let replacedString = str;
  for (let index = 0; index < replacements.length; index++) {
    const item = replacements[index];
    replacedString = replaceAll(replacedString, item.find, item.replace || "");
  }
  return replacedString;
}
