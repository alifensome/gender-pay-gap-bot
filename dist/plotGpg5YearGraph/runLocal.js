"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const handler_1 = require("./handler");
(0, handler_1.handler)({ input: { data: { medianData: [{ x: 2017, y: 7 }, { x: 2021, y: 12 }], meanData: [{ x: 2017, y: 4 }, { x: 2021, y: 7 }] } } }, {}).then(console.log);
//# sourceMappingURL=runLocal.js.map