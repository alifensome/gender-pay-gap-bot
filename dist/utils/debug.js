"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebugMode = exports.debugPrint = void 0;
function debugPrint(msg) {
    if (isDebugMode()) {
        if (typeof msg === "string") {
            console.log({ "message": msg, debug: true, "eventType": "debug" });
        }
        else {
            console.log(Object.assign(Object.assign({}, msg), { debug: true, "eventType": "debug" }));
        }
    }
}
exports.debugPrint = debugPrint;
function isDebugMode(processOverride) {
    const p = !!processOverride ? processOverride : process;
    return !!p.env.DEBUG || p.argv.includes("debug") || p.argv.includes("test");
}
exports.isDebugMode = isDebugMode;
//# sourceMappingURL=debug.js.map