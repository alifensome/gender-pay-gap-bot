import { isDebugMode } from "./debug"


describe("isDebugMode", () => {
    const backupProcess = { ...process }
    beforeEach(() => {
        jest.resetModules() // Most important - it clears the cache
        process = { ...backupProcess }
    })

    afterAll(() => {
        process = { ...backupProcess }; // Restore old environment
    });
    it("should tell if debug is enabled", () => {
        const isDebug = isDebugMode()
        expect(isDebug).toBe(false)
    })
    it("should tell if debug is enabled via DEBUG env var", () => {
        const process = {
            env: {
                DEBUG: "true"
            },
            argv: []
        }
        const isDebug = isDebugMode(process)
        expect(isDebug).toBe(true)
    })
    it("should tell if debug is enabled via argv", () => {
        const process = {
            env: {
            },
            argv: ["test"]
        }
        const isDebug = isDebugMode(process)
        expect(isDebug).toBe(true)
    })
    it("should tell if debug is enabled via DEBUG env var", () => {
        const process = {
            env: {
            },
            argv: ["debug"]
        }
        const isDebug = isDebugMode(process)
        expect(isDebug).toBe(true)
    })
})