import { replaceAll } from "./replace";

export function parseCompanyName(companyName: string): string {
  return replaceAll(companyName.trimEnd(), "  ", " ");
}
