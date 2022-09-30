import { CompanyDataMultiYearItem } from "../types";

export function findDailyGpg(today: Date): CompanyDataMultiYearItem[] {
  const range = findPercentageGpgRange(today);

  return [];
}
export function findPercentageGpgRange(today: Date): {
  startPercentage: number;
  endPercentage: number;
} {
  const days = daysSinceBeginningOfYear(today);
  const daysZeroIndexed = days;
  const fractionOfYear = daysZeroIndexed / 365;
  const percentagePerDay = 100 / 365;
  const startPercentage = 100 - fractionOfYear * 100;
  const endPercentage = startPercentage + percentagePerDay;
  return {
    startPercentage,
    endPercentage,
  };
}

export function daysSinceBeginningOfYear(now: Date): number {
  const nowRounded = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const start = new Date(now.getFullYear(), 0, 0, 0, 0, 0);
  const diff = nowRounded.valueOf() - start.valueOf();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
}
