export function debugPrint(msg: string) {
    if (process.env.DEBUG) {
        console.log({ "message": msg, debug: true, "eventType": "debug" });
    }
}
