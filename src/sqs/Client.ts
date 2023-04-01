import {
  SQSClient as AwsSqsClient,
  SendMessageCommand,
  SendMessageCommandOutput,
} from "@aws-sdk/client-sqs";
import { Logger } from "tslog";
import { HandleIncomingTweetInput } from "../queueTweets/IncomingTweetListenerQueuer";
import { isDebugMode } from "../utils/debug";

export class SqsClient {
  awsSqsClient: AwsSqsClient;
  region = process.env.REGION;
  sqsUrl = process.env.SQS_QUEUE_URL;
  logger: Logger;
  isDebugMode: boolean;

  constructor(sqsUrl?: string) {
    this.awsSqsClient = new AwsSqsClient({ region: this.region });
    this.logger = new Logger();
    this.isDebugMode = isDebugMode();
    if (sqsUrl) {
      this.sqsUrl = sqsUrl;
    }
  }
  async queueMessage(
    messageBody: HandleIncomingTweetInput,
    delay = 600
  ): Promise<SendMessageCommandOutput> {
    const params = {
      DelaySeconds: delay,
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
      console.log(err);
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
