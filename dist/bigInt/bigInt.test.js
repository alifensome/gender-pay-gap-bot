"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bigInt_1 = __importDefault(require("./bigInt"));
test('it should remove one when last number is not zero', () => {
    const b = new bigInt_1.default("123");
    b.minusOne();
    const result = b.toString();
    expect(result).toBe("122");
});
test('it should remove one when last number is zero', () => {
    const b = new bigInt_1.default("100");
    b.minusOne();
    const result = b.toString();
    expect(result).toBe("99");
});
test('it should return 0 from 1', () => {
    const b = new bigInt_1.default("1");
    b.minusOne();
    const result = b.toString();
    expect(result).toBe("0");
});
//# sourceMappingURL=bigInt.test.js.map