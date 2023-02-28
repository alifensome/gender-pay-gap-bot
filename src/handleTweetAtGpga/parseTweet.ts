import { TweetAtGpgaType, searchPhrases } from "./parseTweet.test";

interface parseTweetResult {
  type: TweetAtGpgaType;
  companyName?: string;
}
export function parseTweet(tweetText: string): parseTweetResult {
  if (tweetText.length > 100) {
    return { type: TweetAtGpgaType.Irrelevant };
  }

  if (includesAny(tweetText, searchPhrases)) {
    const companyName = parseText(tweetText, searchPhrases);
    return { type: TweetAtGpgaType.RequestingCompanyGpg, companyName };
  }
  return { type: TweetAtGpgaType.Irrelevant };
}
function includesAny(phrase: string, searchTerms: string[]): boolean {
  const lowerCasePhrase = phrase.toLowerCase();
  for (let index = 0; index < searchTerms.length; index++) {
    const term = searchTerms[index].toLocaleLowerCase();
    if (lowerCasePhrase.includes(term)) {
      return true;
    }
  }
  return false;
}
function parseText(phrase: string, searchTerms: string[]): string | undefined {
  const lowerCasePhrase = phrase.toLowerCase();
  for (let index = 0; index < searchTerms.length; index++) {
    const term = searchTerms[index].toLocaleLowerCase();
    if (lowerCasePhrase.includes(term)) {
      const myRegexp = new RegExp(term + "(.*)", "g");
      const matches = myRegexp.exec(lowerCasePhrase);
      if (matches && matches.length >= 1) {
        console.log(matches[1]); // abc
        return matches[1]
          .replace(term, "")
          .replace("@PayGapApp", "")
          .replace("?", "")
          .replace(".", "");
      }
    }
  }
  return undefined;
}
