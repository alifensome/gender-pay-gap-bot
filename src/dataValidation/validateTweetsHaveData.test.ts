import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { CompanyDataMultiYearItem, TwitterData } from "../types";
import { isValidTwitterItem } from "../utils/isValidTwitterItem";

const importer = new DataImporter();
const repo = new Repository(importer);

test("All twitter data should be valid", async () => {
  await repo.setData();
  const brokenTwitterCompanyIds: CompanyDataMultiYearItem[] = [];
  const brokenTwitterItems: TwitterData[] = [];
  const duplicateTwitterItems: any[] = [];
  for (let index = 0; index < repo.twitterUserData.length; index++) {
    const twitterUser = repo.twitterUserData[index];
    if (!isValidTwitterItem(twitterUser)) {
      brokenTwitterItems.push(twitterUser);
    }
    const foundByIdUser = await repo.getTwitterUserByTwitterId(
      twitterUser.twitter_id_str
    );
    if (!foundByIdUser) {
      brokenTwitterItems.push(twitterUser);
    }
    if (
      foundByIdUser?.companyName?.toUpperCase() !==
        twitterUser.companyName?.toUpperCase() ||
      foundByIdUser?.companyNumber?.toUpperCase() !==
        twitterUser.companyNumber?.toUpperCase()
    ) {
      duplicateTwitterItems.push({ foundByIdUser, twitterUser });
    }
    const companyData = await repo.getCompany(
      twitterUser.companyName,
      twitterUser.companyNumber
    );
    if (!companyData) {
      console.log(twitterUser.companyName, twitterUser);
      throw new Error("no data for " + JSON.stringify(twitterUser));
    }
    if (companyData.companyNumber !== twitterUser.companyNumber) {
      console.log(companyData.companyName);
      brokenTwitterCompanyIds.push(companyData);
    }
  }
  // There should be no broken twitter-company links!
  const expectedBroken: CompanyDataMultiYearItem[] = [];
  expect(brokenTwitterCompanyIds).toEqual(expectedBroken);
  // Broken twitter items.
  expect(brokenTwitterItems).toEqual([]);
  expect(duplicateTwitterItems).toEqual([]);
});
