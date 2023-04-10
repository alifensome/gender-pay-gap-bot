import { getEnvVar } from "../utils/getEnvVar";

export interface Creds {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export class TwitterCredentialGetter {
  getCredentials(isReadAccount: boolean = false): Creds {
    if (isReadAccount) {
      return {
        consumerKey: getEnvVar("TWITTER_READ_ACCOUNT_API_KEY"),
        consumerSecret: getEnvVar("TWITTER_READ_ACCOUNT_API_SECRET"),
        accessToken: getEnvVar("TWITTER_READ_ACCOUNT_ACCESS_TOKEN"),
        accessTokenSecret: getEnvVar(
          "TWITTER_READ_ACCOUNT_ACCESS_TOKEN_SECRET"
        ),
      };
    } else {
      return {
        consumerKey: getEnvVar("TWITTER_API_KEY"),
        consumerSecret: getEnvVar("TWITTER_API_SECRET"),
        accessToken: getEnvVar("TWITTER_ACCESS_TOKEN"),
        accessTokenSecret: getEnvVar("TWITTER_ACCESS_TOKEN_SECRET"),
      };
    }
  }
}
