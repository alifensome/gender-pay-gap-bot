import {
  SQSClient as AwsSqsClient,
  SendMessageCommand,
  SendMessageCommandOutput,
} from "@aws-sdk/client-sqs";
import { Logger } from "tslog";
import { isDebugMode } from "../utils/debug";

export class SqsClient {
  awsSqsClient: AwsSqsClient;
  delay = 600; //  Delay in seconds.
  region = process.env.REGION;
  sqsUrl = process.env.SQS_QUEUE_URL;
  logger: Logger;
  isDebugMode: boolean;

  constructor(sqsUrl?: string) {
    this.awsSqsClient = new AwsSqsClient({ region: this.region });
    this.logger = new Logger();
    this.isDebugMode = isDebugMode();
    this.delay = this.isDebugMode ? 0 : 600;
    if (sqsUrl) {
      this.sqsUrl = sqsUrl;
    }
  }
  async queueMessage(messageBody: any): Promise<SendMessageCommandOutput> {
    const params = {
      DelaySeconds: this.delay,
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: this.sqsUrl,
    };

    try {
      const data = await this.awsSqsClient.send(new SendMessageCommand(params));
      this.logger.info(
        JSON.stringify({
          message: `Success, message sent. MessageID: ${data.MessageId}`,
          messageId: data.MessageId,
          eventType: "successSendingMessage",
        })
      );
      return data; // For unit tests.
    } catch (err: any) {
      this.logger.error(
        JSON.stringify({
          errorMessage: `Error while sending data: ${err.message}`,
          messageBody,
        })
      );
      throw err;
    }
  }
}
