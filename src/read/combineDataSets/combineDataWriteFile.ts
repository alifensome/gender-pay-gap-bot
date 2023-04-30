import { writeJsonFile } from "../../utils/write";
import { printPercentageComplete } from "./utils";
import { importAllYearsData } from "./importAllYearsData";
import { formDeduplicatedListOfCompanies } from "./formDeduplicatedListOfCompanies";
import { combineYearsData } from "./combineYearsData";
import { CompanyDataMultiYearItem } from "../../types";
import { Presets, SingleBar } from "cli-progress";
export async function combineDataWriteFile(debug: boolean) {
  const allYearsData = importAllYearsData();

  console.log("Deduplicating...");
  const deduplicatedListOfCompanies =
    formDeduplicatedListOfCompanies(allYearsData);

  const totalNumber = deduplicatedListOfCompanies.length;
  console.log(`Deduplicated down to ${totalNumber} items`);

  console.log("combining data...");
  const combineDataProgressBar = new SingleBar({}, Presets.shades_classic);
  combineDataProgressBar.start(totalNumber, 0);

  const combinedData: CompanyDataMultiYearItem[] = [];
  for (let index = 0; index < deduplicatedListOfCompanies.length; index++) {
    if (index % 100 === 0) {
      combineDataProgressBar.update(index);
    }
    const company = deduplicatedListOfCompanies[index];
    const combinedCompanyData = combineYearsData(allYearsData, company);
    combinedData.push(combinedCompanyData);
  }
  combineDataProgressBar.update(totalNumber);
  combineDataProgressBar.stop();

  console.log(`Combined data to: ${combinedData.length} items.`);

  if (debug) {
    console.log("Debug so skipping writing file.");
    return;
  }

  await writeJsonFile("./data/companies_GPG_Data.json", combinedData);
  console.log("Finished.");
}
