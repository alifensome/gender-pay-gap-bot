import { writeAllData } from "./writeYearsData";

// TODO we could check company addresses to duplicate companies before writing.
// TODO trim company name whitespace at the end.
// TODO replace '  ' with ' ' until only single spaces.
writeAllData().then(() => console.log("Finished!!!"));
