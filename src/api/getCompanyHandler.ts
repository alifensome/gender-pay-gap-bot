import DataImporter from "../importData"
import { response } from "./response";

const d = new DataImporter()

const getCompanyByCompanyId = async (event: any) => {
  const id = event.pathParameters.id
  const tweets = d.companyDataJoinedTweets()
  const company = tweets.find((c) => c.companyNumber === id)
  return response(company)
};

const getCompanyByTwitterId = async (event: any) => {
  const id = event.pathParameters.id
  const tweets = d.companyDataJoinedTweets()
  const company = tweets.find((c) => c.twitterId === id)
  return response(company)
};

const getCompanyByTwitterHandle = async (event: any) => {
  const handle = event.pathParameters.handle
  const tweets = d.companyDataJoinedTweets()
  const company = tweets.find((c) => c?.twitterScreenName?.toLocaleUpperCase() === handle?.toLocaleUpperCase())
  return response(company)
};

const getDataAnalysis = async (event: any) => {
  const data = {}
  return response(data)
}
export { getCompanyByCompanyId, getCompanyByTwitterId, getCompanyByTwitterHandle }