"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replace_1 = require("./replace");
describe("replaceAll", () => {
    it("should replace all instances", () => {
        const result = (0, replace_1.replaceAll)("some ra'ndom sen'tence ' '", "'");
        expect(result).toBe("some random sentence  ");
    });
});
describe("replaceMultiple", () => {
    it("should replace from list", () => {
        const sentence = "some ra'ndom sen'tence ' '";
        const result = (0, replace_1.replaceMultiple)(sentence, [{ find: "'", replace: "" }, { find: "some", replace: "A" }]);
        expect(result).toBe("A random sentence  ");
    });
});
//# sourceMappingURL=replace.test.js.map