import { genericWriteData } from "./writeYearsData";

const year = process.argv[2];
const yearInt = parseInt(year);
console.log(`Running for year: ${yearInt}`);

genericWriteData(yearInt);
