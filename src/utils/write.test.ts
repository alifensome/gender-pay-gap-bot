import { readFileSync, rm } from "fs"
import { writeJsonFile } from "./write"

describe("writeJsonFile", () => {
    it("should wrirte a file with json in it", async () => {
        const path = "./testfile.txt"
        const data = { a: "123", b: 123 }
        await writeJsonFile(path, data)
        const result = await readFileSync(path, { encoding: "utf8" })
        expect(JSON.parse(result)).toEqual(data)
        rm(path, () => { })
    })
})