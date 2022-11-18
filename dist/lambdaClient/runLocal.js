"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LambdaClient_1 = require("./LambdaClient");
const payload = {
    input: {
        data: {
            "meanData": [
                {
                    "x": 2017,
                    "y": 11.5
                },
                {
                    "x": 2018,
                    "y": 21.5
                },
                {
                    "x": 2019,
                    "y": 31.5
                },
                {
                    "x": 2020,
                    "y": 25.5
                },
                {
                    "x": 2021,
                    "y": 20.5
                }
            ],
            "medianData": [
                {
                    "x": 2017,
                    "y": 11.1
                },
                {
                    "x": 2018,
                    "y": 15.1
                },
                {
                    "x": 2019,
                    "y": 20.1
                },
                {
                    "x": 2020,
                    "y": 12.1
                },
                {
                    "x": 2021,
                    "y": 10.1
                }
            ]
        }
    }
};
console.log("starting...");
const lc = new LambdaClient_1.LambdaClient("eu-west-2");
lc.trigger({ functionName: "gender-pay-gap-bot-2-dev-plotGpg5YearGraph", payload }).then(console.log);
//# sourceMappingURL=runLocal.js.map