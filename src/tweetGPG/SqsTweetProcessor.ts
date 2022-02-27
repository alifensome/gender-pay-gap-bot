import { Logger } from "tslog";
import DataImporter from "../importData";
import { TwitterClient } from "../twitter/Client";

export class SqsTweetProcessor {
    twitterClient: TwitterClient;
    logger: Logger;
    dataImporter: DataImporter;
    constructor(twitterClient: TwitterClient, dataImporter: DataImporter) {
        this.twitterClient = twitterClient
        this.logger = new Logger({ name: "SqsTweetProcessor" })
        this.dataImporter = dataImporter
    }
    async processes(sqsRecord) {
        try {
            this.logger.info({ message: "processing sqs record", eventType: "processingRecord", sqsRecord })

        } catch (error) {
            this.logger.error(error)
        }

    }
}