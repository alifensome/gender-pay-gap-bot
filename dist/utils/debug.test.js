"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("./debug");
describe("isDebugMode", () => {
    const backupProcess = Object.assign({}, process);
    beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process = Object.assign({}, backupProcess);
    });
    afterAll(() => {
        process = Object.assign({}, backupProcess); // Restore old environment
    });
    it("should tell if debug is enabled", () => {
        const isDebug = (0, debug_1.isDebugMode)();
        expect(isDebug).toBe(false);
    });
    it("should tell if debug is enabled via DEBUG env var", () => {
        const process = {
            env: {
                DEBUG: "true"
            },
            argv: []
        };
        const isDebug = (0, debug_1.isDebugMode)(process);
        expect(isDebug).toBe(true);
    });
    it("should tell if debug is enabled via argv", () => {
        const process = {
            env: {},
            argv: ["test"]
        };
        const isDebug = (0, debug_1.isDebugMode)(process);
        expect(isDebug).toBe(true);
    });
    it("should tell if debug is enabled via DEBUG env var", () => {
        const process = {
            env: {},
            argv: ["debug"]
        };
        const isDebug = (0, debug_1.isDebugMode)(process);
        expect(isDebug).toBe(true);
    });
});
//# sourceMappingURL=debug.test.js.map