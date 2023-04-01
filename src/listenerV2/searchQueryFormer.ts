export class SearchQueryFormer {
  characterLimit = 1024;
  toQuery(fromTwitterIds: string[]): string[] {
    const results: string[] = [];
    let currentResult = `from:${fromTwitterIds[0]}`;

    for (let index = 1; index < fromTwitterIds.length; index++) {
      const id = fromTwitterIds[index];
      const nextItem = `%20OR%20from:${id}`;
      if (currentResult.length + nextItem.length > this.characterLimit) {
        // start new result.
        results.push(currentResult);
        currentResult = `from:${id}`;
        continue;
      } else {
        currentResult += nextItem;
        continue;
      }
    }
    results.push(currentResult);
    return results;
  }
}
