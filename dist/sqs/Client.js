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
exports.SqsClient = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const tslog_1 = require("tslog");
const debug_1 = require("../utils/debug");
class SqsClient {
    constructor() {
        this.delay = 600; //  Delay in seconds.
        this.region = process.env.REGION;
        this.sqsUrl = process.env.SQS_QUEUE_URL;
        this.awsSqsClient = new client_sqs_1.SQSClient({ region: this.region });
        this.logger = new tslog_1.Logger();
        this.isDebugMode = (0, debug_1.isDebugMode)();
        this.delay = this.isDebugMode ? 0 : 600;
    }
    queueMessage(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                DelaySeconds: this.delay,
                MessageBody: JSON.stringify(messageBody),
                QueueUrl: this.sqsUrl
            };
            try {
                const data = yield this.awsSqsClient.send(new client_sqs_1.SendMessageCommand(params));
                this.logger.info(JSON.stringify({ message: `Success, message sent. MessageID: ${data.MessageId}`, messageId: data.MessageId, eventType: "successSendingMessage" }));
                return data; // For unit tests.
            }
            catch (err) {
                this.logger.error(JSON.stringify({ errorMessage: `Error while sending data: ${err.message}`, messageBody }));
                throw err;
            }
        });
    }
}
exports.SqsClient = SqsClient;
//# sourceMappingURL=Client.js.map