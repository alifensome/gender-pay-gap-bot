export interface LogEventBase {
    eventType: string
    message: string
    twitterUserId?: string
    tweetId?: string
    screenName?: string
    data?: any,
    successfullySentTweet?: number
}

export class LambdaLogger {
    constructor(private componentName: string) { }

    logEvent(event: LogEventBase): void {
        const eventWithData = this.enrichData(event)
        console.info(JSON.stringify(eventWithData))
    }

    private enrichData(event: LogEventBase) {
        return { ...event, componentName: this.componentName, [event.eventType]: 1 }
    }
}