import Analyser from "./analyser"

describe("analyser", () => {
    const analyser = new Analyser()
    it("should average a list", () => {
        const list = [1, 2, 3]
        const av = analyser.average(list)
        expect(av).toBe(2)
    })
})