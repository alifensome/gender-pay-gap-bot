export function deduplicateList<T>(
  list: T[],
  matcher: (l1: T, l2: T) => boolean
): T[] {
  return list.filter(
    (value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => matcher(t, value))
  );
}
