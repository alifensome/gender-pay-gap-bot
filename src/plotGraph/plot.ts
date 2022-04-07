import * as fs from 'fs'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { registerFont } from 'canvas'
import { BubbleDataPoint, ChartConfiguration, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';

export default class GraphPlotter {
    // Docs https://www.npmjs.com/package/chartjs-node-canvas
    // Config documentation https://www.chartjs.org/docs/latest/axes/
    width = 600; // px
    height = 400; // px
    backgroundColour = 'white' // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
    chartJSNodeCanvas: ChartJSNodeCanvas;
    isTest: boolean;

    constructor(isTest = false) {
        this.chartJSNodeCanvas = new ChartJSNodeCanvas({ width: this.width, height: this.height, backgroundColour: this.backgroundColour });
        this.isTest = isTest
    }

    async generateGraphAsBase64({ medianData, meanData }: GraphData) {
        registerFont('assets/fonts/DejaVuSans.ttf', { family: 'DejaVu Sans' });

        const configuration: ChartConfiguration<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], unknown> = {
            type: "line",// "line",   // for line chart
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
                            text: ["Gender Pay Gap - Positive indicates men earing more", "%"]
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
        }

        const dataUrl = await this.chartJSNodeCanvas.renderToDataURL(configuration);
        const base64Image = dataUrl

        const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

        // TODO remove this once stable.
        if (this.isTest) {
            fs.writeFileSync("out.png", base64Data, 'base64');
        }
        return base64Data
    }

}

export interface GraphDataPoint {
    x: number, y: number
}

export interface GraphData {
    medianData: GraphDataPoint[]
    meanData: GraphDataPoint[]
}