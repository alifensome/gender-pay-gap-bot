
const fs = require('fs');
const XLSX = require('xlsx');
const readXlsxFile = require('read-excel-file/node');
// File path.
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

        const stream = fs.createWriteStream(outputFileName, { flags: 'w' });
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
        companyName = row.A;
        companyNumber = row.C;
        genderPayGap = row.E;
        data.push({ companyName, companyNumber, genderPayGap });
    }
    return data
}

module.exports = { getData, spreadSheetToJson,parseDataFromJsonXlsx };
