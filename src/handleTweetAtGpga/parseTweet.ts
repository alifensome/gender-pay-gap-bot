export enum TweetAtGpgaType {
  Irrelevant,
  RequestingCompanyGpg,
}
export const searchPhrases = [
  "I would like the pay gap for ",
  "what is the data for ",
  "what is the pay gap for ",
  "what is the pay gap at ",
  "what is the pay gap in ",
  "gender pay gap for ",
  " pay gap for ",
  " paygap for ",
  " pay-gap for ",
  "gender pay gap for the ",
  "give me the pay gap for ",
  "get me the pay gap for ",
  "get me the pay gap of ",
  "have the pay gap for ",
  "tell me the pay gap for ",
];

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
