import DataImporter from "../../importData";
import { Repository } from "../../importData/Repository";
import { writeJsonFile } from "../../utils/write";
import Analyser from "../analyser";

const dataImporter = new DataImporter();

const analyser = new Analyser();
const repo = new Repository(dataImporter);
const notFound: any[] = [];
async function run() {
  repo.checkSetData();
  const successfulTweetData = await dataImporter.readFile(
    "data/analysis/2022-successful-tweets.json"
  );
  for (let index = 0; index < successfulTweetData.length; index++) {
    const successfulTweet = successfulTweetData[index];
    const company = repo.getCompany(successfulTweet.companyName, "NOT_PRESENT");
    successfulTweet.company = company;
    if (!company) {
      notFound.push(successfulTweet);
    }
  }
  await writeJsonFile(
    "data/analysis/2022-successful-tweets-with-company.json",
    successfulTweetData
  );
  console.log(`Found: ${successfulTweetData.length}.`);
  console.log(`Not Found: ${notFound.length}.`);
  console.log(notFound);

  const successfulTweetDataDeduplicated = successfulTweetData.filter(
    (value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.companyName === value.companyName)
  );
  console.log(
    `successfulTweetDataDeduplicated: ${successfulTweetDataDeduplicated.length}`
  );
  const gpgList = [];
  for (let index = 0; index < successfulTweetDataDeduplicated.length; index++) {
    const item = successfulTweetDataDeduplicated[index];
    const company = item.company;
    if (company) {
      if (company.data2021To2022) {
        gpgList.push(company.data2021To2022.medianGpg);
        continue;
      }
      if (company.data2020To2021) {
        gpgList.push(company.data2020To2021.medianGpg);
        continue;
      }
      if (company.data2019To2020) {
        gpgList.push(company.data2019To2020.medianGpg);
        continue;
      }
      if (company.data2018To2019) {
        gpgList.push(company.data2018To2019.medianGpg);
        continue;
      }
      if (company.data2017To2018) {
        gpgList.push(company.data2017To2018.medianGpg);
        continue;
      }
    }
  }
  console.log(`GpgList: ${gpgList.length}`);
  const average = analyser.average(gpgList);
  console.log(`average: ${average}`);
  const modAverage = analyser.average(gpgList.map((x) => (x > 0 ? x : -x)));
  console.log(`modAverage: ${modAverage}`);
  const std = getStandardDeviation(gpgList);
  console.log(`std: ${std}`);
}

function getStandardDeviation(array: number[]) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

run();
