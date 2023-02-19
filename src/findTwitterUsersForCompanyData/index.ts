import DataImporter from "../importData";
import { findUserByName, FindUserByNameOutput } from "../twitter/findUserIds";
import { wait } from "../utils/wait";
import { UsersSearch } from "twitter-api-client";
import { Repository } from "../importData/Repository";
import { writeJsonFile } from "../utils/write";
import { sortByCompanySize } from "../utils/sortByCompanySize";

const dataImporter = new DataImporter();
const repository = new Repository(dataImporter);
const companyData = dataImporter.companiesGpgData();

console.log("Starting...");

async function run() {
  const isTest = false;
  const testNumber = 500;
  let found = 0;
  let notFound = 0;
  let percentageDone = 0;
  let percentageFound = 0;
  const number = isTest ? testNumber : companyData.length;

  const foundCompanies: any[] = [];
  const notFoundCompanies: any[] = [];

  let errorsInARow = 0;

  let startTime = new Date();

  try {
    for (let index = 0; index < number; index++) {
      if (errorsInARow > 4) {
        console.log("Too many failures!!!");
        break;
      }
      if (index % 100 == 0) {
        percentageDone = (index / number) * 100;
        percentageFound = (found / index) * 100;
        console.log(
          `PercentageDone: ${percentageDone}%\nFound: ${found}\nNotFound: ${notFound}\nPercentageFound: ${percentageFound}%\n`
        );
      }
      const company = companyData[index];
      const twitterData = repository.getTwitterUserByCompanyData(
        company.companyName,
        company.companyNumber
      );
      if (twitterData) {
        // already has twitter data.
        continue;
      }
      await wait();
      let user: UsersSearch | null = null;
      let findByNameResult: FindUserByNameOutput | null = null;
      try {
        // todo want to output the potential results as files or something.
        findByNameResult = await findUserByName(company.companyName);
        if (findByNameResult.foundType === "exact") {
          user = findByNameResult.user;
        }
        errorsInARow = 0;
      } catch (error) {
        console.log("Error while finding user for:", company);
        console.log(error);
        errorsInARow++;
      }
      if (!user) {
        notFound++;
        notFoundCompanies.push({
          ...company,
          potentialMatches: findByNameResult?.potentialMatches,
        });
        continue;
      }
      found++;

      foundCompanies.push({
        twitter_id: user.id,
        twitter_name: user.name,
        twitter_screen_name: user.screen_name,
        ...company,
      });
    }

    percentageFound = (found / number) * 100;

    console.log(
      `\nComplete!!!\nFound:${found}\nNotFound:${notFound}\nPercentageFound: ${percentageFound}%\n`
    );
  } catch (error) {
    console.log(
      `Threw error ${percentageDone}% through. Found: ${found}, Not found: ${notFound} `
    );
    console.log(error);
  }

  try {
    const date = new Date();
    const isoString = date.toISOString();
    const filePath = `./data/twitterAccountData/twitterUserData-${isoString}.json`;

    const sortedFoundCompanies = sortByCompanySize(foundCompanies);
    await writeJsonFile(filePath, sortedFoundCompanies);

    const notFoundFilePath = `./data/twitterAccountData/twitterUserData-notFound-${isoString}.json`;

    const sortedNotFoundCompanies: any[] = sortByCompanySize(notFoundCompanies);

    await writeJsonFile(notFoundFilePath, sortedNotFoundCompanies);

    let finishingTime = new Date();
    console.log(
      "Time taken:",
      (finishingTime.getTime() - startTime.getTime()) / (1000 * 60),
      " Minutes"
    );
  } catch (error) {
    console.log(`Threw error while writing fie.`);
    console.log(foundCompanies);
    console.log(error);
  }
}

run();
