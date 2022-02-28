export function debugPrint(msg: string | object) {
    if (isDebugMode()) {
        if (typeof msg === "string") {
            console.log({ "message": msg, debug: true, "eventType": "debug" });
        } else {
            console.log({ ...msg, debug: true, "eventType": "debug" });
        }
    }
}

export function isDebugMode(): boolean {
    return !!process.env.DEBUG || process.argv[2] === "debug" || process.argv[2] === "test" || process.argv[1] === "test";
}
