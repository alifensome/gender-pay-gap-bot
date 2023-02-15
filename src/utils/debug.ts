export function debugPrint(msg: string | object) {
    if (isDebugMode()) {
        if (typeof msg === "string") {
            console.log({ "message": msg, debug: true, "eventType": "debug" });
        } else {
            console.log({ ...msg, debug: true, "eventType": "debug" });
        }
    }
}

export function isDebugMode(processOverride?: Partial<NodeJS.Process>): boolean {
    const p = !!processOverride ? processOverride : process
    return Boolean(!!p.env?.DEBUG || p?.argv?.includes("debug") || p?.argv?.includes("test"));
}
