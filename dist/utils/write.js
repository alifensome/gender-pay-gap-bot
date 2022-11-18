"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = void 0;
const fs_1 = __importDefault(require("fs"));
function writeJsonFile(filePath, data) {
    return new Promise((resolve) => {
        const stream = fs_1.default.createWriteStream(filePath, { flags: 'w' });
        return stream.write(JSON.stringify(data), () => {
            console.log(`Wrote file: ${filePath}`);
            resolve();
        });
    });
}
exports.writeJsonFile = writeJsonFile;
//# sourceMappingURL=write.js.map