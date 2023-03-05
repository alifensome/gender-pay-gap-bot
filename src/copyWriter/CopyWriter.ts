import { CompanyDataMultiYearItem, CompanyDataSingleYearItem } from "../types";
import { Company } from "../utils/Company";
import { getMostRecentMedianGPGOrThrow } from "../utils/getMostRecentGPG";
import { isNumber, modulus, roundNumber } from "../utils/numberUtils";

export class CopyWriter {
  medianGpgForThisOrganisationPartialSentence(
    companyData: CompanyDataMultiYearItem
  ): string {
    const mostRecentGPG = getMostRecentMedianGPGOrThrow(companyData);
    const mostRecent = Number(mostRecentGPG.toFixed(1));
    const isPositiveGpg = mostRecent > 0.0;
    if (mostRecent === 0.0) {
      return `In this organisation, men's and women's median hourly pay is equal`;
    }
    if (isPositiveGpg) {
      return `In this organisation, women's median hourly pay is ${mostRecent}% lower than men's`;
    } else {
      return `In this organisation, women's median hourly pay is ${
        -1 * mostRecent
      }% higher than men's`;
    }
  }

  medianGpgForThisOrganisation(companyData: CompanyDataMultiYearItem): string {
    return `${this.medianGpgForThisOrganisationPartialSentence(companyData)}.`;
  }

  medianGpgWithDifferenceYearOnYearForThisOrganisation(
    companyData: CompanyDataMultiYearItem
  ): string {
    const company = new Company(companyData);
    if (company.hasTwoYearsConsecutive()) {
      const previousYears = company.getTwoYearsConsecutive();
      const year = previousYears!.year!;
      const previousYear = previousYears!.previousYear!;
      const differenceCopy = this.getDifferenceCopy(
        year.medianGpg,
        previousYear.medianGpg
      );
      const medianGpgCopy =
        this.medianGpgForThisOrganisationPartialSentence(companyData);
      return `${medianGpgCopy}. ${differenceCopy}`;
    }
    return this.medianGpgForThisOrganisation(companyData);
  }

  getDifferenceCopy(year: number, previousYear: number): string {
    const difference = year - previousYear;
    const yearRounded = roundNumber(year);
    const previousYearRounded = roundNumber(previousYear);

    const roundedDifference = roundNumber(difference);

    const changesDirection = yearRounded * previousYearRounded < 0;

    const gpgIncreased =
      (yearRounded > previousYearRounded &&
        yearRounded >= 0 &&
        previousYearRounded >= 0) ||
      (yearRounded < previousYearRounded &&
        yearRounded <= 0 &&
        previousYearRounded <= 0) ||
      (changesDirection && modulus(yearRounded) > modulus(previousYearRounded));

    const gpgNotChanged = year === previousYear;

    if (roundedDifference === 0.0 || gpgNotChanged) {
      return `The pay gap is the same as the previous year.`;
    }

    if (changesDirection) {
      if (previousYearRounded === 0) {
        return `In the previous year, women's median hourly pay was equal to men's.`;
      }
      if (previousYearRounded > 0) {
        return `In the previous year, women's median hourly pay was ${previousYearRounded}% lower than men's.`;
      } else {
        return `In the previous year, women's median hourly pay was ${
          -1 * previousYearRounded
        }% higher than men's.`;
      }
    }

    const modulatedDifference = modulus(roundedDifference);

    if (gpgIncreased) {
      return `The pay gap is ${modulatedDifference} percentage points wider than the previous year.`;
    } else {
      return `The pay gap is ${modulatedDifference} percentage points smaller than the previous year.`;
    }
  }

  getAtCompanyNameMedianPayCopy(companyName: string, medianGpg: number) {
    const medianPayCopyPart = this.medianPayCopyPart(medianGpg);
    return `At ${companyName}, ${medianPayCopyPart}.`;
  }

  medianPayCopyPart(medianGpg: number) {
    return this.genericCopyPart(medianGpg, "median", "hourly pay", false);
  }
  meanPayCopyPart(gpg: number) {
    return this.genericCopyPart(gpg, "mean", "hourly pay", false);
  }

  payCopyPart(gpg: number, metric: "median" | "mean") {
    const isPositiveGpg = gpg >= 0.0;
    if (gpg === 0.0) {
      return `men's and women's ${metric} hourly pay is equal.`;
    }
    if (isPositiveGpg) {
      return `women's ${metric} hourly pay is ${gpg}% lower than men's.`;
    } else {
      return `women's ${metric} hourly pay is ${-1 * gpg}% higher than men's.`;
    }
  }

  genericCopyPart(
    gpg: number,
    metric: "median" | "mean",
    payType: "hourly pay" | "bonus pay",
    fullStop = true
  ) {
    const isPositiveGpg = gpg >= 0.0;
    const fullStopOrString = fullStop ? "." : "";
    if (gpg === 0.0) {
      return `men's and women's ${metric} ${payType} is equal${fullStopOrString}`;
    }
    if (isPositiveGpg) {
      return `women's ${metric} ${payType} is ${gpg}% lower than men's${fullStopOrString}`;
    } else {
      return `women's ${metric} ${payType} is ${
        -1 * gpg
      }% higher than men's${fullStopOrString}`;
    }
  }

  tweetAtUsMultipleResultsFound(
    screenName: string,
    companies: { companyName: string }[]
  ): string {
    const beginning = `@${screenName} I found ${companies.length} matches for your request. Did you mean:\n\n`;
    const companiesList = companies.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.companyName + "\n",
      ""
    );
    const end =
      "\nReply with 'pay gap for' followed by the company name and I'll fetch the data";
    return beginning + companiesList + end;
  }
  tweetAtUsCouldNotFindResults(screenName: string): string {
    return `@${screenName} I couldn't find a match for your request, or there are too many companies matching that name. Try searching for them here instead: https://gender-pay-gap.service.gov.uk/`;
  }
  medianMeanGpgQuartilesBonusCopy(
    screenName: string,
    companyName: string,
    singleYearData: CompanyDataSingleYearItem
  ): string {
    const medianPayCopyPart = this.capitaliseFirst(
      this.medianPayCopyPart(singleYearData?.medianGpg)
    );

    const meanPayCopyPart = this.capitaliseFirst(
      this.meanPayCopyPart(singleYearData.meanGpg)
    );

    const bonusPayCopyPart = this.capitaliseFirst(
      this.medianBonusPayCopy(singleYearData.diffMedianBonusPercent)
    );

    const fullNameTweet = `@${screenName} At ${companyName}:\n${medianPayCopyPart}\n${meanPayCopyPart}\n${bonusPayCopyPart}\n${this.quartileCopy(
      singleYearData
    )}`;

    const fullNameTweetLength = fullNameTweet.length;
    if (fullNameTweetLength <= 280) {
      return fullNameTweet;
    }
    // Tweet would be too long
    const numberOfExceedingChars = fullNameTweetLength - 280;
    const companyNameLength = companyName.length;
    if (companyNameLength < numberOfExceedingChars) {
      throw new Error(
        "can not trim company name as its shorter than exceeding chars."
      );
    }
    const shortCompanyName =
      companyName.slice(0, companyNameLength - numberOfExceedingChars - 3) +
      "...";
    return this.medianMeanGpgQuartilesBonusCopy(
      screenName,
      shortCompanyName,
      singleYearData
    );
  }

  quartileCopy(singleYearData: CompanyDataSingleYearItem): string {
    return `Percentage of women in each pay quarter:\nUpper: ${singleYearData.femaleTopQuartile}%\nUpper middle: ${singleYearData.femaleUpperMiddleQuartile}%\nLower middle: ${singleYearData.femaleLowerMiddleQuartile}%\nLower: ${singleYearData.femaleLowerQuartile}%`;
  }
  medianBonusPayCopy(bonus: number | null): string {
    if (bonus === null) {
      return "";
    }
    return this.genericCopyPart(bonus, "median", "bonus pay", false) + "\n";
  }

  capitaliseFirst(s: string): string {
    if (!s) {
      return "";
    }
    return s[0].toUpperCase() + s.slice(1);
  }
}
