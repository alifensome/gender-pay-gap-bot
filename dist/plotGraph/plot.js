"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const canvas_1 = require("canvas");
class GraphPlotter {
    constructor(isTest = false) {
        // Docs https://www.npmjs.com/package/chartjs-node-canvas
        // Config documentation https://www.chartjs.org/docs/latest/axes/
        this.width = 600; // px
        this.height = 400; // px
        this.backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
        this.chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width: this.width, height: this.height, backgroundColour: this.backgroundColour });
        this.isTest = isTest;
    }
    generateGraphAsBase64({ medianData, meanData }) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, canvas_1.registerFont)('assets/fonts/DejaVuSans.ttf', { family: 'DejaVu Sans' });
            const configuration = {
                type: "line",
                data: {
                    labels: [2017, 2018, 2019, 2020, 2021],
                    datasets: [{
                            label: "Median Gender Pay Gap",
                            data: medianData,
                            fill: false,
                            borderColor: ['rgb(51, 204, 204)'],
                            borderWidth: 4,
                            xAxisID: 'xAxis1' // Define top or bottom axis ,modifies on scale
                        },
                        {
                            label: "Mean Gender Pay Gap",
                            data: meanData,
                            fill: false,
                            borderColor: ['rgb(255, 102, 255)'],
                            borderWidth: 4,
                            xAxisID: 'xAxis1'
                        },
                        {
                            label: "No gap",
                            pointStyle: "line",
                            data: [{ x: 2017, y: 0 }, { x: 2021, y: 0 }],
                            fill: false,
                            borderDash: [10],
                            borderColor: ['rgb(0, 0, 0)'],
                            borderWidth: 1,
                            xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: ["Gender Pay Gap - Positive indicates men earning more", "%"]
                            },
                            suggestedMin: 0,
                        },
                        xAxis1: {
                            display: true,
                            title: {
                                display: true,
                                text: ["Year"]
                            },
                        }
                    }
                }
            };
            const dataUrl = yield this.chartJSNodeCanvas.renderToDataURL(configuration);
            const base64Image = dataUrl;
            const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
            // TODO remove this once stable.
            if (this.isTest) {
                fs.writeFileSync("out.png", base64Data, 'base64');
            }
            return base64Data;
        });
    }
}
exports.default = GraphPlotter;
//# sourceMappingURL=plot.js.map