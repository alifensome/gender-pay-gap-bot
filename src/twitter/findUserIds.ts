import { TwitterClient, UsersSearch } from "twitter-api-client";
import dotenv from "dotenv";
import { isUkLocation } from "../utils/isUk";
import { getTextMatch } from "../utils/textMatch";
import { replaceSearchTerms } from "./replaceSearchTerms";

dotenv.config();

const twitterClient = new TwitterClient({
  apiKey: process.env.TWITTER_API_KEY as string,
  apiSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export interface FindUserByNameOutput {
  foundType: "exact" | "multiple" | "none";
  user: UsersSearch | null;
  potentialMatches: Partial<UsersSearch>[];
}

export async function findUserByName(
  companyName: string
): Promise<FindUserByNameOutput> {
  const searchName = replaceSearchTerms(companyName);
  const users = await twitterClient.accountsAndUsers.usersSearch({
    count: 10,
    q: searchName,
  });
  // TODO often the first result is actually correct.
  //I should take this into account when returning the result.
  for (let index = 0; index < users.length; index++) {
    const u = users[index];

    // If less than 30 followers then get rid of them
    if (u.followers_count < 30) {
      continue;
    }

    // if is not UK then continue
    const isUk = isUkLocation(u.location);
    if (!isUk) {
      continue;
    }

    // TODO we should match these based off screen_name too.
    // Check matching - this is based off company name and not the search name with the replacements done.
    const wordMatch = getTextMatch(companyName, u.name);
    if (wordMatch < 0.5) {
      continue;
    }

    if (wordMatch > 0.85) {
      return { foundType: "exact", user: u, potentialMatches: [] };
    }

    // If verified and OK word match then return
    if (u.verified && wordMatch > 0.6) {
      console.log(`Found : ${u.name} - ${u.id} for ${companyName}.`);
      return { foundType: "exact", user: u, potentialMatches: [] };
    }
  }
  // Could not find user
  console.log(`Not found for: ${companyName}.`);
  printPotentialUsers(users);

  if (!users.length) {
    return {
      foundType: "none",
      user: null,
      potentialMatches: users.map(userSearchToItem),
    };
  }
  return {
    foundType: "multiple",
    user: null,
    potentialMatches: users.map(userSearchToItem),
  };
}

function printPotentialUsers(users: UsersSearch[]) {
  if (!users.length) {
    console.log("No data");
  }
  for (let index = 0; index < users.length; index++) {
    const u = users[index];
    console.log(
      `${index} - ${u.name} - ${u.screen_name} - ${u.id} - Followers:${u.followers_count}`
    );
  }
}

function userSearchToItem(userSearchResult: UsersSearch) {
  return {
    id: userSearchResult.id,
    id_str: userSearchResult.id_str,
    name: userSearchResult.name,
    screen_name: userSearchResult.screen_name,
    location: userSearchResult.location,
    description: userSearchResult.description,
    followers_count: userSearchResult.followers_count,
    verified: userSearchResult.verified,
    protected: userSearchResult.protected,
  };
}
