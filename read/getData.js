const readXlsxFile = require('read-excel-file/node');
// File path.
function getData(filePath) {
    return new Promise((resolve) => {
        const data = [];
        readXlsxFile(filePath).then((rows) => {
            for (let index = 0; index < rows.length; index++) {
                if(index == 0){
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
exports.getData = getData;
