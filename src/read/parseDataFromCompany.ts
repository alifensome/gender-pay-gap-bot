
import { parseCompanyNumber, parseGpg } from "./parse";
import { CsvParser } from "./parseCsv/parseCsv";
import { writeJsonFile } from '../utils/write';

export async function spreadSheetToJson(filePath, outputFileName): Promise<void> {
    const csvParser = new CsvParser()
    const rows = await csvParser.parseFromFile(filePath)
    await writeJsonFile(outputFileName, rows)
}

export function parseDataFromJson(jsonFile: CompanyDataCsvItem[]): SingleYearCompanyDataItem[] {
    const data = [];
    for (let index = 0; index < jsonFile.length; index++) {
        const row = jsonFile[index];
        if (!row || !Object.keys(row).length) {
            continue
        }
        const companyName = row.EmployerName;
        const companyNumber = parseCompanyNumber(row.CompanyNumber);
        const genderPayGap = parseGpg(row.DiffMeanHourlyPercent);
        const medianGenderPayGap = parseGpg(row.DiffMedianHourlyPercent);
        const sicCodes = parseString(row.SicCodes)
        if (!companyName && !companyNumber) {
            continue
        }
        const size = row.EmployerSize
        data.push({ companyName, companyNumber, genderPayGap, medianGenderPayGap, sicCodes, size });
    }
    return data
}

export interface SingleYearCompanyDataItem {
    companyName: string
    companyNumber: string | null // Company Number can be null for some government bodies, health and education.
    size: string
    sicCodes: string
    genderPayGap: number
    medianGenderPayGap: number
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


interface Fields {
    EmployerNameField: string;
    CompanyNumberField: string;
    DiffMeanHourlyPercentField: string;
    DiffMedianHourlyPercentField: string;
    SicCodesField: string
}

export interface CompanyDataCsvItem {
    EmployerName: string;
    EmployerId: string;
    Address: string;
    PostCode: string;
    CompanyNumber: string;
    SicCodes: string;
    DiffMeanHourlyPercent: string;
    DiffMedianHourlyPercent: string;
    DiffMeanBonusPercent: string;
    DiffMedianBonusPercent: string;
    MaleBonusPercent: string;
    FemaleBonusPercent: string;
    MaleLowerQuartile: string;
    FemaleLowerQuartile: string;
    MaleLowerMiddleQuartile: string;
    FemaleLowerMiddleQuartile: string;
    MaleUpperMiddleQuartile: string;
    FemaleUpperMiddleQuartile: string;
    MaleTopQuartile: string;
    FemaleTopQuartile: string;
    CompanyLinkToGPGInfo: string;
    ResponsiblePerson: string;
    EmployerSize: string;
    CurrentName: string;
    SubmittedAfterTheDeadline: string;
    DueDate: string;
    DateSubmitted: string
}