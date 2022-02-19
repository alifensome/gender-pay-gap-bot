import { SQSClient as AwsSqsClient, SendMessageCommand, SendMessageCommandOutput } from "@aws-sdk/client-sqs";
import { Logger } from "tslog";

export class SqsClient {
    awsSqsClient: AwsSqsClient
    delay = 600; //  Delay in seconds.
    region = process.env.REGION;
    sqsUrl = process.env.SQS_QUEUE_URL
    logger: Logger

    constructor() {
        this.awsSqsClient = new AwsSqsClient({ region: this.region })
        this.logger = new Logger()
    }
    async queueMessage(messageBody: any): Promise<SendMessageCommandOutput> {
        const params = {
            DelaySeconds: this.delay,
            MessageBody: JSON.stringify(messageBody),
            QueueUrl: this.sqsUrl
        };

        try {
            const data = await this.awsSqsClient.send(new SendMessageCommand(params));
            this.logger.info({ message: `Success, message sent. MessageID: ${data.MessageId}`, messageId: data.MessageId, eventType: "errorSendingMessage" });
            return data; // For unit tests.
        } catch (err) {
            this.logger.error({ err, errorMessage: `Error while sending data: ${err.message}`, messageBody });
            throw err
        }
    }
}
