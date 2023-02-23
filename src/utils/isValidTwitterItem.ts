import { TwitterData } from "../types";
import { isValidCompanyNumber } from "./isValidCompanyNumber";

export function isValidTwitterItem(twitterUser: TwitterData): boolean {
    return Boolean(twitterUser && twitterUser.twitter_id_str && twitterUser.companyName
        && isValidCompanyNumber(twitterUser.companyNumber)
        // TODO fix screen name stuff
        // +     "twitter_name": "abrdn plc",
        // +     "twitter_screen_name": "abrdn_plc",
    )
}
