import DataImporter from "../importData"

export default class Analyser {
    dataImporter: DataImporter
    constructor() {
        this.dataImporter = new DataImporter()
    }
    getAverageForYears() {

        return 1
    }
    average(list: number[]) {
        let total = 0
        for (const item of list) {
            total += item
        }
        return total / list.length
    }
}