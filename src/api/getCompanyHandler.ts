import DataImporter from "../importData"
import { response } from "./response";

const d = new DataImporter()

const getCompanyByCompanyId = async (event) => {
  const id = event.pathParameters.id
  const tweets = d.companyDataJoinedTweets()
  const company = tweets.find((c) => c.companyNumber == id)
  return response(company)
};

const getCompanyByTwitterId = async (event) => {
  const id = event.pathParameters.id
  const tweets = d.companyDataJoinedTweets()
  const company = tweets.find((c) => c.twitterId == id)
  return response(company)
};

const getCompanyByTwitterHandle = async (event) => {
  const handle = event.pathParameters.handle
  const tweets = d.companyDataJoinedTweets()
  const company = tweets.find((c) => c?.twitterScreenName?.toLocaleUpperCase() == handle?.toLocaleUpperCase())
  return response(company)
};

export { getCompanyByCompanyId, getCompanyByTwitterId, getCompanyByTwitterHandle }