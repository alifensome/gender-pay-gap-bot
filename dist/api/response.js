"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
function response(data) {
    if (!data) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Not Found" }, null, 2),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data, null, 2),
    };
}
exports.response = response;
//# sourceMappingURL=response.js.map