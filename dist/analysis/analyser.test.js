"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyser_1 = __importDefault(require("./analyser"));
describe("analyser", () => {
    const analyser = new analyser_1.default();
    it("should average a list", () => {
        const list = [1, 2, 3];
        const av = analyser.average(list);
        expect(av).toBe(2);
    });
});
//# sourceMappingURL=analyser.test.js.map