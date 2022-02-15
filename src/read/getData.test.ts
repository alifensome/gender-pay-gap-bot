import { getHeaderFields, parseDataFromJsonXlsx } from "./getData"

describe("parseDataFromJsonXlsx", () => {
    it("should parse the spreadsheet data", () => {
        const data = [
            { A: "EmployerName", B: "Address", C: "CompanyNumber", D: "SicCodes", E: "DiffMeanHourlyPercent", F: "DiffMedianHourlyPercent", G: "DiffMeanBonusPercent", H: "DiffMedianBonusPercent", I: "MaleBonusPercent", J: "FemaleBonusPercent", K: "MaleLowerQuartile", L: "FemaleLowerQuartile", M: "MaleLowerMiddleQuartile", N: "FemaleLowerMiddleQuartile", O: "MaleUpperMiddleQuartile", P: "FemaleUpperMiddleQuartile", Q: "MaleTopQuartile", R: "FemaleTopQuartile", S: "CompanyLinkToGPGInfo" },
            { A: "1825 FINANCIAL PLANNING AND ADVICE LIMITED", B: "Bow Bells House, 1 Bread Street, London, United Kingdom, EC4M 9HH", C: 1447544, D: "64999, 66190", E: 44.5, F: 42.6 }

        ]
        const result = parseDataFromJsonXlsx(data)
        const expectedResult = [{
            companyName: "1825 FINANCIAL PLANNING AND ADVICE LIMITED",
            companyNumber: "01447544",
            genderPayGap: 44.5,
            sicCodes: "64999, 66190",
            medianGenderPayGap: 42.6,
        }]
        expect(result).toEqual(expectedResult)
    })
    it("should parse the spreadsheet data regardless of header order", () => {
        const data = [
            { B: "EmployerName", A: "Address", C: "CompanyNumber", D: "SicCodes", E: "DiffMeanHourlyPercent", F: "DiffMedianHourlyPercent", G: "DiffMeanBonusPercent", H: "DiffMedianBonusPercent", I: "MaleBonusPercent", J: "FemaleBonusPercent", K: "MaleLowerQuartile", L: "FemaleLowerQuartile", M: "MaleLowerMiddleQuartile", N: "FemaleLowerMiddleQuartile", O: "MaleUpperMiddleQuartile", P: "FemaleUpperMiddleQuartile", Q: "MaleTopQuartile", R: "FemaleTopQuartile", S: "CompanyLinkToGPGInfo" },
            { B: "1825 FINANCIAL PLANNING AND ADVICE LIMITED", A: "Bow Bells House, 1 Bread Street, London, United Kingdom, EC4M 9HH", C: 1447544, D: "64999, 66190", E: 44.5, F: 42.6 }

        ]
        const result = parseDataFromJsonXlsx(data)
        const expectedResult = [{
            "companyName": "1825 FINANCIAL PLANNING AND ADVICE LIMITED",
            "companyNumber": "01447544",
            "genderPayGap": 44.5,
            "medianGenderPayGap": 42.6,
            "sicCodes": "64999, 66190",
        }]
        expect(result).toEqual(expectedResult)
    })
})

describe("getHeaderFields", () => {
    it("should get the header fields by name", () => {
        const headers = { B: "EmployerName", A: "Address", C: "CompanyNumber", D: "SicCodes", E: "DiffMeanHourlyPercent", F: "DiffMedianHourlyPercent", G: "DiffMeanBonusPercent", H: "DiffMedianBonusPercent", I: "MaleBonusPercent", J: "FemaleBonusPercent", K: "MaleLowerQuartile", L: "FemaleLowerQuartile", M: "MaleLowerMiddleQuartile", N: "FemaleLowerMiddleQuartile", O: "MaleUpperMiddleQuartile", P: "FemaleUpperMiddleQuartile", Q: "MaleTopQuartile", R: "FemaleTopQuartile", S: "CompanyLinkToGPGInfo" }

        const result = getHeaderFields(headers)
        const expectedResult = { "EmployerNameField": "B", "CompanyNumberField": "C", DiffMeanHourlyPercentField: "E", "DiffMedianHourlyPercentField": "F", "SicCodesField": "D", }
        expect(result).toEqual(expectedResult)
    })
})