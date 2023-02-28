export function shouldNeverHappen(type: never) {
  throw new Error(`should never happen ${type}`);
}
