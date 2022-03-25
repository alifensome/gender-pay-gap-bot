import fs from 'fs'

import csv from 'csv-parser'

export class CsvParser {
    parseFromFile(path: string): Promise<any[]> {
        const results = []
        return new Promise((resolve, reject) => {
            fs.createReadStream(path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on("error", (err) => {
                    console.log(err)
                    return reject(err)
                })
                .on('end', () => {
                    return resolve(results)
                });
        })
    }
}
