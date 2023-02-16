import fs from "fs";

export function writeJsonFile(filePath: string, data: any): Promise<void> {
    return new Promise((resolve) => {
        const stream = fs.createWriteStream(filePath, { flags: 'w' });
        return stream.write(JSON.stringify(data), () => {
            console.log(`Wrote file: ${filePath}`);
            resolve();
        });
    });
}
