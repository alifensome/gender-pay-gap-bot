"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const write_1 = require("./write");
describe("writeJsonFile", () => {
    it("should wrirte a file with json in it", () => __awaiter(void 0, void 0, void 0, function* () {
        const path = "./testfile.txt";
        const data = { a: "123", b: 123 };
        yield (0, write_1.writeJsonFile)(path, data);
        const result = yield (0, fs_1.readFileSync)(path, { encoding: "utf8" });
        expect(JSON.parse(result)).toEqual(data);
        (0, fs_1.rm)(path, () => { });
    }));
});
//# sourceMappingURL=write.test.js.map