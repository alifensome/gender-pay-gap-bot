export default class BigInt {
    Parts: number[]
    Str: string
    constructor(intString: string) {
        this.Str = intString
        this.Parts = []
        for (let index = 0; index < intString.length; index++) {
            const int = intString[index];
            this.Parts.push(Number(int))
        }
    }
    minusOne() {
        const lastIndex = this.Parts.length - 1
        const firstNumber = this.Parts[lastIndex]
        if (firstNumber == 0) {
            this.minusOneFromHigherOrder(lastIndex - 1)
            this.Parts[lastIndex] = 9
        } else {
            this.Parts[lastIndex] = (this.Parts[lastIndex] - 1)
        }
    }
    minusOneFromHigherOrder(index: number) {
        if (index == -1) {
            return
        }
        const firstNumber = this.Parts[index]
        if (firstNumber == 1 && index == 0) {
            this.Parts.shift()
            return
        }
        if (firstNumber == 0) {
            this.minusOneFromHigherOrder(index - 1)
            this.Parts[index] = 9
        } else {
            this.Parts[index] = (this.Parts[index] - 1)
        }
        if (this.Parts[0] == 0) {
            this.Parts.shift()
        }
    }
    toString() {
        return this.Parts.join("")
    }
}