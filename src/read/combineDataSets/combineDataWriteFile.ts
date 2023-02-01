import { writeJsonFile } from "../../utils/write";
import { printPercentageComplete } from "./utils";
import { importAllYearsData } from "./importAllYearsData";
import { formDeduplicatedListOfCompanies } from "./formDeduplicatedListOfCompanies";
import { combineYearsData } from "./combineYearsData";

export async function combineDataWriteFile(debug: boolean) {
  const allYearsData = importAllYearsData();

  console.log("Deduplicating...");
  const deduplicatedListOfCompanies =
    formDeduplicatedListOfCompanies(allYearsData);

  const totalNumber = deduplicatedListOfCompanies.length;
  console.log(`Deduplicated down to ${totalNumber} items`);

  console.log("combining data...");
  const combinedData = [];
  for (let index = 0; index < deduplicatedListOfCompanies.length; index++) {
    if (index % 100 === 0) {
      printPercentageComplete(index, totalNumber);
    }
    const company = deduplicatedListOfCompanies[index];
    const combinedCompanyData = combineYearsData(allYearsData, company);
    combinedData.push(combinedCompanyData);
  }

  console.log(`Combined data to: ${combinedData.length} items.`);

  if (debug) {
    console.log("Debug so skipping writing file.");
    return;
  }

  await writeJsonFile("./data/companies_GPG_Data.json", combinedData);
  console.log("Finished.");
}
