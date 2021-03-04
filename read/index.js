const { getData } = require("./getData");

filePath = './data/UK Gender Pay Gap Data - 2020 to 2021.xlsx'
getData(filePath).then((data) => console.log(data[0]))