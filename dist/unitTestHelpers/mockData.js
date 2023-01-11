"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockGraphData = exports.mockCompanyDataItem = void 0;
const types_1 = require("../types");
exports.mockCompanyDataItem = {
    companyNumber: "321",
    companyName: "Company Name Ltd 2",
    sicCodes: "123,456",
    data2021To2022: { medianGpg: 52.1, meanGpg: 51.5 },
    data2020To2021: { medianGpg: 42.1, meanGpg: 41.5 },
    data2019To2020: { medianGpg: 32.1, meanGpg: 31.5 },
    data2018To2019: { medianGpg: 22.1, meanGpg: 21.5 },
    data2017To2018: { medianGpg: 11.1, meanGpg: 11.5 },
    size: types_1.CompanySize.From1000To4999,
};
exports.mockGraphData = {
    meanData: [
        {
            x: 2017,
            y: 11.5,
        },
        {
            x: 2018,
            y: 21.5,
        },
        {
            x: 2019,
            y: 31.5,
        },
        {
            x: 2020,
            y: 41.5,
        },
        {
            x: 2021,
            y: 51.5,
        },
    ],
    medianData: [
        {
            x: 2017,
            y: 11.1,
        },
        {
            x: 2018,
            y: 22.1,
        },
        {
            x: 2019,
            y: 32.1,
        },
        {
            x: 2020,
            y: 42.1,
        },
        {
            x: 2021,
            y: 52.1,
        },
    ],
};
//# sourceMappingURL=mockData.js.map