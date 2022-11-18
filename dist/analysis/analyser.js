"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
class Analyser {
    constructor() {
        this.dataImporter = new importData_1.default();
    }
    getAverageForYears() {
        return 1;
    }
    average(list) {
        let total = 0;
        for (const item of list) {
            total += item;
        }
        return total / list.length;
    }
}
exports.default = Analyser;
//# sourceMappingURL=analyser.js.map