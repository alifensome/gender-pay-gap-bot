
import { createWriteStream } from "fs"
import * as  XLSX from 'xlsx';

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

function parseDataFromJsonXlsx(jsonFile: any[]): any[] {
    const data = [];
    const headerFields = getHeaderFields(jsonFile[0])
    for (let index = 0; index < jsonFile.length; index++) {
        const row = jsonFile[index];
        if (index === 0) {
            continue;
        }
        const companyName = row[headerFields.EmployerNameField];
        const companyNumber = parseCompanyNumber(row[headerFields.CompanyNumberField]);
        const genderPayGap = parseGpg(row[headerFields.DiffMeanHourlyPercentField]);
        data.push({ companyName, companyNumber, genderPayGap });
    }
    return data
}

// TODO refactor this to be cleaner :P
function parseCompanyNumber(companyNumber) {
    if (typeof companyNumber === "number") {
        if (companyNumber.toString().length === 7) {
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
    if (gpg > 1000 || gpg < -1000) {
        throw new Error(`gpg out of bounds: ${gpg}`)
    }
    return gpg
}

export { spreadSheetToJson, parseDataFromJsonXlsx };

interface Fields { EmployerNameField: string, CompanyNumberField: string, DiffMeanHourlyPercentField: string }
export function getHeaderFields(headerObject: any): Fields {
    const fields: Fields = {
        EmployerNameField: "",
        CompanyNumberField: "",
        DiffMeanHourlyPercentField: ""
    }
    for (const key in headerObject) {
        if (headerObject.hasOwnProperty(key)) {
            const value = headerObject[key]
            if (value === "EmployerName") {
                fields.EmployerNameField = key
            }
            if (value === "CompanyNumber") {
                fields.CompanyNumberField = key
            }
            if (value === "DiffMeanHourlyPercent") {
                fields.DiffMeanHourlyPercentField = key
            }
        }
    }
    if (!fields.CompanyNumberField || !fields.DiffMeanHourlyPercentField || !fields.EmployerNameField) {
        throw new Error(`Could not find all fields in header, ${headerObject}`)
    }
    return fields
}