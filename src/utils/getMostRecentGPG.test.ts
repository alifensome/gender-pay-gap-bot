import { isNumber } from "./getMostRecentGPG"

describe("isNumber", () => {
    it.each([
        [1, true],
        [0, true],
        [null, false],
        [undefined, false],
        ["0", true],
        [-50, true],
        ["-50", true]
    ])("should return if is a number or not", (numberOrUndefined, expectedResult) => {
        const result = isNumber(numberOrUndefined)
        expect(result).toBe(expectedResult)
    })
})