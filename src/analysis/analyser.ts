import { isNumber } from "../utils/numberUtils";

export default class Analyser {
  average(list: number[]) {
    let total = 0;
    for (const item of list) {
      if (!isNumber(item)) {
        throw new Error(`Not a number: ${item}`);
      }
      total += item;
    }
    return total / list.length;
  }
}
