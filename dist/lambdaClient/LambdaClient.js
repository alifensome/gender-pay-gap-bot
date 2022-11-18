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
exports.LambdaClient = void 0;
const aws_sdk_1 = require("aws-sdk");
const tslog_1 = require("tslog");
class LambdaClient {
    constructor(region) {
        this.awsLambda = new aws_sdk_1.Lambda({ region });
        this.logger = new tslog_1.Logger({ name: "LambdaClient" });
    }
    trigger({ functionName, payload }) {
        return new Promise((resolve, reject) => {
            const params = {
                FunctionName: functionName,
                InvocationType: 'RequestResponse',
                LogType: 'Tail',
                Payload: JSON.stringify(payload)
            };
            this.awsLambda.invoke(params, (err, data) => {
                if (err) {
                    this.logger.error({ message: "error while triggering lambda", errorMessage: err.message });
                    return reject(err);
                }
                if (data.StatusCode !== 200 && data.StatusCode !== 201) {
                    this.logger.error({ message: "expected status code 200 or 201", statusCode: data.StatusCode, logs: base64ToString(data.LogResult) });
                    return reject(data);
                }
                const responsePayload = data.Payload;
                return resolve(JSON.parse(responsePayload.toString()));
            });
        });
    }
    triggerPlot5YearGraph(graphData) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = "gender-pay-gap-bot-2-dev-plotGpg5YearGraph";
            const result = yield this.trigger({ functionName, payload: { input: { data: graphData } } });
            return result.imageBase64;
        });
    }
}
exports.LambdaClient = LambdaClient;
function base64ToString(logs) {
    try {
        return Buffer.from(logs, 'base64').toString('ascii');
    }
    catch (_a) {
        return "Could not convert.";
    }
}
//# sourceMappingURL=LambdaClient.js.map