import { writeAllData } from "./writeYearsData";

// TODO we could check company addresses to duplicate companies before writing.
writeAllData().then(() => console.log("Finished!!!"))