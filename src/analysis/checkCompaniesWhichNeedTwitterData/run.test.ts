import { Repository } from "../../importData/Repository";

import DataImporter from "../../importData";

const importer = new DataImporter();
const repo = new Repository(importer);
repo.setData();

it("should have valid data, a company for each twitter Id", async () => {
  for (let index = 0; index < repo.twitterUserData.length; index++) {
    const twitterUser = repo.twitterUserData[index];
    const companyData = await repo.getTwitterUserByCompanyData(
      twitterUser.companyName,
      twitterUser.companyNumber
    );
    if (!companyData) {
      console.log(twitterUser.companyName, twitterUser);
      throw new Error("no data for " + JSON.stringify(twitterUser));
    }
    if (companyData.companyNumber !== twitterUser.companyNumber) {
      console.log(companyData.companyName);
    }
    expect(companyData.companyNumber).toEqual(twitterUser.companyNumber);
  }
});
