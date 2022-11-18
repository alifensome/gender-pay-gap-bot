"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writeYearsData_1 = require("./writeYearsData");
const year = process.argv[2];
const yearInt = parseInt(year);
console.log(`Running for year: ${yearInt}`);
(0, writeYearsData_1.genericWriteData)(yearInt);
//# sourceMappingURL=writeDataByYearCLT.js.map