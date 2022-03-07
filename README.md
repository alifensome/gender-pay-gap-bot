# gender-pay-gap-bot

![Banner](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/banner.jpeg?raw=true)

A bot to tweet the gender pay gap of a company, at companies who tweet about international women's day.

You can [see the bot in action here](https://twitter.com/PayGapApp) for such gold as this
![Twitter-bot Tweet at UBS](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/ubs.jpeg?raw=true)

## Disclaimer
This was originally hacked together the weekend before IWD so is very badly written, inefficient,  buggy with some minor data issues. The main focus was on gathering as much data as possible on UK companies with GPG (gender pay gap) data in order to generate the most tweets in one day. I am currently upgrading and fixing these issues.

### Architecture 
As of 2022 this is running on AWS and deployed with serverless
![Architecture](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/GPGA.drawio.png?raw=true)


## Run
 To run:
1. You need twitter developer access 
1. Make a `.env` file
1. run `node ./twitter/streamTweets.js` or in test mode: `node ./twitter/streamTweets.js test`

Output of the programme looks like this 

![Twitter-bot Tweet at UBS](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/terminal.jpeg?raw=true)

## Data
Forming a data set linking [UK Gov gender pay gap data](https://gender-pay-gap.service.gov.uk/viewing/download) with twitter users was by far the hardest part of this hack. The data was downloaded on 2021-03-04 so will be out of date.
### Combined GPG data
The GPG data was combined into one file `data/companies_GPG_Data.json`. This will only be as up to date as the UK Gov GPG data as the deadline is April so more data is submitted then.

### Joining twitter data
Twitter data was join on from an API based on company name and location. We then manually checked those linked were correct and added in some more manually gathered data.

This data set is in `data/twitterAccountData/twitterUserData-prod.json`

### TODO
- [/] Join data on companyId and if company does not exist then on company name to lower
- [ ] Find a more reliable way of finding twitter accounts
- [ ] Clean the rest of the data
- [ ] Write data to a database
- [ ] Collect the twitter Id of the created tweet
- [ ] Check through the tweets for removed attachment_url to see if the company has deleted their tweet
- [ ] Build a backup plan for when we get banned from twitter 😎
- [/] Make a data set with just companies and twitter accounts
- [/] Tidy up and reformat the data