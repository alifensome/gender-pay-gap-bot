import DataImporter from "../importData";
import { findUserByName, FindUserByNameOutput } from "../twitter/findUserIds";
import { wait } from "../utils/wait";
import { UsersSearch } from "twitter-api-client";
import { Repository } from "../importData/Repository";
import { writeJsonFile } from "../utils/write";
import { sortByCompanySize } from "../utils/sortByCompanySize";
import { isDebugMode } from "../utils/debug";

const dataImporter = new DataImporter();
const repository = new Repository(dataImporter);
const companyData = dataImporter.companiesGpgData();

// TODO
// Acronym from the parts of the name.
// get rid of spaces and see if it exact matches.
// bug check some of the name matching.
// Print when fewer then 50 followers discards an option.
// colour code the output
// time estimation.
// order companies by biggest first.
// remove plc
// save needed data to file so we can process locally.

console.log("Starting...");

async function run() {
  const isTest = isDebugMode() || false;
  const testNumber = 50;
  let found = 0;
  let notFound = 0;
  let percentageDone = 0;
  let percentageFound = 0;
  const numberToSearchFor = isTest ? testNumber : companyData.length;
  if (isTest) {
    console.log(
      `Running in  test mode, will search for ${numberToSearchFor} items.`
    );
  }

  const foundCompanies: any[] = [];
  const notFoundCompanies: any[] = [];

  let errorsInARow = 0;

  let startTime = new Date();

  try {
    for (let index = 0; index < numberToSearchFor; index++) {
      if (errorsInARow > 4) {
        console.log("Too many failures!!!");
        break;
      }
      if (index % 100 == 0) {
        percentageDone = (index / numberToSearchFor) * 100;
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
          if (user) {
            found++;
            console.log(
              `Found ${company.companyName}, ${user.name}, ${user.screen_name}.`
            );

            foundCompanies.push({
              twitter_id: user.id,
              twitter_name: user.name,
              twitter_screen_name: user.screen_name,
              companyName: company.companyName,
              companyNumber: company.companyNumber,
              size: company.size,
            });
          }
        }
        errorsInARow = 0;
      } catch (error) {
        console.log("Error while finding user for:", company);
        console.log(error);
        errorsInARow++;
        continue;
      }
      if (!user) {
        notFound++;
        notFoundCompanies.push({
          ...company,
          potentialMatches: findByNameResult?.potentialMatches,
        });
        continue;
      }

      continue;
    }

    percentageFound = (found / numberToSearchFor) * 100;

    console.log(
      `\nComplete!!!\nFound:${found}\nNotFound:${notFound}\nPercentageFound: ${percentageFound}%\n`
    );
  } catch (error) {
    errorsInARow++;
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
    //TODO combine data sets at the end if we want to.
  } catch (error) {
    console.log(`Threw error while writing fie.`);
    console.log(foundCompanies);
    console.log(error);
  }
}

run();
