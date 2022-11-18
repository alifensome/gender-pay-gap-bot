"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvParser = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
class CsvParser {
    parseFromFile(path) {
        const results = [];
        return new Promise((resolve, reject) => {
            fs_1.default.createReadStream(path)
                .pipe((0, csv_parser_1.default)())
                .on('data', (data) => results.push(data))
                .on("error", (err) => {
                console.log(err);
                return reject(err);
            })
                .on('end', () => {
                return resolve(results);
            });
        });
    }
}
exports.CsvParser = CsvParser;
//# sourceMappingURL=parseCsv.js.map