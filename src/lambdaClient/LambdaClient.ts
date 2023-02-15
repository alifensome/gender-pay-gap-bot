import { AWSError, Lambda } from 'aws-sdk'
import { Logger } from 'tslog';
import { GraphData } from '../plotGraph/plot';

export class LambdaClient {
    awsLambda: Lambda;
    logger: Logger;
    constructor(region: string) {
        this.awsLambda = new Lambda({ region })
        this.logger = new Logger({ name: "LambdaClient" })
    }

    trigger({ functionName, payload }): Promise<any> {
        return new Promise(
            (resolve, reject) => {
                const params = {
                    FunctionName: functionName,
                    InvocationType: 'RequestResponse',
                    LogType: 'Tail',
                    Payload: JSON.stringify(payload)
                };
                this.awsLambda.invoke(params, (err: AWSError, data: Lambda.InvocationResponse) => {
                    if (err) {
                        this.logger.error({ message: "error while triggering lambda", errorMessage: err.message })
                        return reject(err)
                    }
                    if (data.StatusCode !== 200 && data.StatusCode !== 201) {
                        this.logger.error({ message: "expected status code 200 or 201", statusCode: data.StatusCode, logs: base64ToString(data.LogResult) })
                        return reject(data)
                    }
                    const responsePayload = data.Payload
                    if (responsePayload) {
                        return resolve(JSON.parse(responsePayload?.toString()))
                    }
                    return resolve({ message: 'success invoking but no response.' })
                })

            }
        )
    }

    async triggerPlot5YearGraph(graphData: GraphData): Promise<string> {
        const functionName = "gender-pay-gap-bot-2-dev-plotGpg5YearGraph"
        const result = await this.trigger({ functionName, payload: { input: { data: graphData } } })
        return result.imageBase64
    }
}


function base64ToString(logs: string | undefined) {
    const defaultMsg = "Could not convert."
    try {
        if (!logs) {
            return defaultMsg
        }
        return Buffer.from(logs, 'base64').toString('ascii');
    } catch {
        return defaultMsg
    }
}
