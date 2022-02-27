
import { createWriteStream } from "fs"
import * as  XLSX from 'xlsx';
import { parseCompanyNumber, parseGpg } from "./parse";

function spreadSheetToJson(filePath, outputFileName): Promise<Error | undefined> {
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
        const medianGenderPayGap = parseGpg(row[headerFields.DiffMedianHourlyPercentField]);
        const sicCodes = parseString(row[headerFields.SicCodesField])

        data.push({ companyName, companyNumber, genderPayGap, medianGenderPayGap, sicCodes });
    }
    return data
}

function parseString(s: string | unknown): string {
    if (!s) {
        return ""
    }
    if (typeof s === "string") {
        const result = s.replace(/\n/g, "")
        return result
    }
    return `${s}`
}

export { spreadSheetToJson, parseDataFromJsonXlsx };

interface Fields {
    EmployerNameField: string;
    CompanyNumberField: string;
    DiffMeanHourlyPercentField: string;
    DiffMedianHourlyPercentField: string;
    SicCodesField: string

}

export function getHeaderFields(headerObject: any): Fields {
    const fields: Fields = {
        EmployerNameField: "",
        CompanyNumberField: "",
        DiffMeanHourlyPercentField: "",
        DiffMedianHourlyPercentField: "",
        SicCodesField: ""
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
            if (value === "DiffMedianHourlyPercent") {
                fields.DiffMedianHourlyPercentField = key
            }
            if (value === "SicCodes") {
                fields.SicCodesField = key
            }
        }
    }
    if (!fields.CompanyNumberField || !fields.DiffMeanHourlyPercentField ||
        !fields.EmployerNameField || !fields.DiffMedianHourlyPercentField
        || !fields.SicCodesField) {
        throw new Error(`Could not find all fields in header, ${headerObject}`)
    }
    return fields
}