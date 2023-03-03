// TODO refactor this to be cleaner :P

import { CompanyNumber } from "../types";

export function parseCompanyNumber(companyNumber: unknown): CompanyNumber {
  if (typeof companyNumber === "number") {
    if (companyNumber.toString().length === 7) {
      return `0${companyNumber}`;
    }

    if (companyNumber.toString().length === 6) {
      return `00${companyNumber}`;
    }

    if (companyNumber.toString().length === 5) {
      return `000${companyNumber}`;
    }

    return companyNumber.toString();
  }
  if (!companyNumber) {
    return null;
  }
  if (typeof companyNumber === "string") {
    return companyNumber;
  }
  return `${companyNumber}`;
}

export function parseGpg(gpg: string | number): number {
  if (typeof gpg === "string") {
    return parseGpg(parseStringNumberWithTab(gpg));
  }
  if (gpg > 1000 || gpg < -1000) {
    throw new Error(`gpg out of bounds: ${gpg}`);
  }
  return gpg;
}

export function parseStringNumberWithTab(gpg: string): number {
  return parseFloat(gpg.replace("\t", ""));
}

export function parseString(s: string | unknown): string {
  if (!s) {
    return "";
  }
  if (typeof s === "string") {
    const result = s.replace(/\n/g, "");
    return result;
  }
  return `${s}`;
}

export function parseNullableNumber(s: string): number | null {
  if (s === "") {
    return null;
  }
  return parseStringNumberWithTab(s);
}
