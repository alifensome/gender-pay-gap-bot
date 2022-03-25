import { parseDataFromJson } from "./parseDataFromCompany"

describe("parseDataFromJson", () => {
    it("should parse the spreadsheet data", () => {
        const data = [
            {
                "Address": "Royal Grammar School, High Street, Guildford, Surrey, GU1 3BB",
                "CompanyLinkToGPGInfo": "https://www.rgsg.co.uk",
                "CompanyNumber": "04104101",
                "CurrentName": "1509 GROUP",
                "DateSubmitted": "2022/02/02 11:06:02",
                "DiffMeanBonusPercent": "",
                "DiffMeanHourlyPercent": "18.0",
                "DiffMedianBonusPercent": "",
                "DiffMedianHourlyPercent": "16.0",
                "DueDate": "2022/04/05 00:00:00",
                "EmployerId": "15320",
                "EmployerName": "1509 GROUP",
                "EmployerSize": "Less than 250",
                "FemaleBonusPercent": "0.0",
                "FemaleLowerMiddleQuartile": "64.0",
                "FemaleLowerQuartile": "64.0",
                "FemaleTopQuartile": "29.0",
                "FemaleUpperMiddleQuartile": "50.0",
                "MaleBonusPercent": "0.0",
                "MaleLowerMiddleQuartile": "36.0",
                "MaleLowerQuartile": "36.0",
                "MaleTopQuartile": "71.0",
                "MaleUpperMiddleQuartile": "50.0",
                "PostCode": "GU1 3BB",
                "ResponsiblePerson": "Ann Mortimer (Payroll Manager)",
                "SicCodes": "85200,\n85310",
                "SubmittedAfterTheDeadline": "False",
            },
            {
                "Address": "Ldh House St Ives Business Park, Parsons Green, St. Ives, Cambridgeshire, PE27 4AA",
                "CompanyLinkToGPGInfo": "https://www.1life.co.uk/corporate-information/",
                "CompanyNumber": "02566586",
                "CurrentName": "1LIFE MANAGEMENT SOLUTIONS LIMITED",
                "DateSubmitted": "2022/02/01 12:19:55",
                "DiffMeanBonusPercent": "55.5",
                "DiffMeanHourlyPercent": "6.1",
                "DiffMedianBonusPercent": "-100.0",
                "DiffMedianHourlyPercent": "-35.3",
                "DueDate": "2022/04/05 00:00:00",
                "EmployerId": "687",
                "EmployerName": "1LIFE MANAGEMENT SOLUTIONS LIMITED",
                "EmployerSize": "Less than 250",
                "FemaleBonusPercent": "30.8",
                "FemaleLowerMiddleQuartile": "65.2",
                "FemaleLowerQuartile": "41.7",
                "FemaleTopQuartile": "52.2",
                "FemaleUpperMiddleQuartile": "65.2",
                "MaleBonusPercent": "69.2",
                "MaleLowerMiddleQuartile": "34.8",
                "MaleLowerQuartile": "58.3",
                "MaleTopQuartile": "47.8",
                "MaleUpperMiddleQuartile": "34.8",
                "PostCode": "PE27 4AA",
                "ResponsiblePerson": "Ann Chesher (Head of Employee Services)",
                "SicCodes": "93110,\n93130,\n93290",
                "SubmittedAfterTheDeadline": "False",
            },
        ]
        const result = parseDataFromJson(data)
        const expectedResult = [{
            companyName: "1509 GROUP",
            companyNumber: "04104101",
            genderPayGap: 18,
            medianGenderPayGap: 16,
            sicCodes: "85200,85310",
        },
        {
            companyName: "1LIFE MANAGEMENT SOLUTIONS LIMITED",
            companyNumber: "02566586",
            genderPayGap: 6.1,
            medianGenderPayGap: -35.3,
            sicCodes: "93110,93130,93290",
        },
        ]
        expect(result).toEqual(expectedResult)
    })
    it("should parse nothing to be nothing", () => {
        const result = parseDataFromJson([{}, { someRandomStuff: "" }] as any)
        expect(result).toEqual([])
    })
})
