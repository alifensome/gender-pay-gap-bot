
import { createWriteStream } from "fs"
import DataImporter from '../importData'
const dataImporter = new DataImporter()
const require = createRequire(import.meta.url); // construct the require method
const readXlsxFile = require('read-excel-file/node');
const XLSX = require('xlsx');


function getData(filePath) {
    return new Promise((resolve) => {
        const data = [];
        readXlsxFile(filePath).then((rows) => {
            for (let index = 0; index < rows.length; index++) {
                if (index == 0) {
                    continue;
                }
                const row = rows[index];
                companyName = row[0];
                companyNumber = row[2];
                genderPayGap = row[4];
                data.push({ companyName, companyNumber, genderPayGap });
            }
        }).then(() => {
            return resolve(data);
        });
    });
}

function spreadSheetToJson(filePath, outputFileName) {
    return new Promise((resolve) => {
        const workbook = XLSX.read(filePath, { type: 'file' });
        const [firstSheetName] = workbook.SheetNames;
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 'A',
            range: 0,
            blankrows: false,
            defval: null,
            raw: true,
        });

        const stream = createWriteStream(outputFileName, { flags: 'w' });
        stream.write(JSON.stringify(rows), resolve);
    });
}

function parseDataFromJsonXlsx(jsonFile) {
    const data = [];
    for (let index = 0; index < jsonFile.length; index++) {
        if (index == 0) {
            continue;
        }
        const row = jsonFile[index];
        const companyName = row.A;
        let companyNumber = parseCompanyNumber(row.C);
        let genderPayGap = parseGpg(row.E);
        data.push({ companyName, companyNumber, genderPayGap });
    }
    return data
}

// TODO refactor this to be cleaner :P 
function parseCompanyNumber(companyNumber) {
    if (typeof companyNumber == "number") {
        if (companyNumber.toString().length == 7) {
            return `0${companyNumber}`
        }

        if (companyNumber.toString().length == 6) {
            return `00${companyNumber}`
        }


        if (companyNumber.toString().length == 5) {
            return `000${companyNumber}`
        }

        return companyNumber.toString()
    }
    return companyNumber
}

function parseGpg(gpg) {
    if (typeof gpg == "string") {
        return parseFloat(gpg.replace("\t", ""))
    }
    return gpg
}

export { getData, spreadSheetToJson, parseDataFromJsonXlsx };
