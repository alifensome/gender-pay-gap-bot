import { TwitterData } from "../types";
import { isValidCompanyNumber } from "./isValidCompanyNumber";

export function isValidTwitterItem(twitterUser: TwitterData): boolean {
  return Boolean(
    twitterUser &&
      twitterUser.twitter_id_str &&
      twitterUser.companyName &&
      twitterUser.twitter_screen_name &&
      isValidCompanyNumber(twitterUser.companyNumber)
  );
}
