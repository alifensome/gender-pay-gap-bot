# gender-pay-gap-bot

![Banner](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/banner.jpeg?raw=true)

A bot to tweet the gender pay gap of a company, at companies who tweet about international women's day.

You can [see the bot in action here](https://twitter.com/PayGapApp) for such gold as this
![Twitter-bot Tweet at UBS](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/ubs.jpeg?raw=true)

### Architecture

As of 2022 this is running on AWS and deployed with serverless
![Architecture](https://github.com/alifensome/gender-pay-gap-bot/blob/main/images/GPGA.drawio.png?raw=true)

## Data

Forming a data set linking [UK Gov gender pay gap data](https://gender-pay-gap.service.gov.uk/viewing/download) with twitter users was by far the hardest part of this hack. The data was downloaded on 2021-03-04 so will be out of date.

### Combined GPG data

The GPG data was combined into one file `data/companies_GPG_Data.json`. This will only be as up to date as the UK Gov GPG data as the deadline is April so more data is submitted then.

### Joining twitter data

Twitter data was join on from an API based on company name and location. We then manually checked those linked were correct and added in some more manually gathered data.

This data set is in `data/twitterAccountData/twitterUserData-prod.json`

## Twitter Matching Improvements

### Problems

- We get duplicate companies sometime with different GPG data but same location.
- Companies house => company website => crawl for twitter url

### Manual Data Gathering

- Search twitter with group: 1
- no twitter profile: 1

## Canvas Lambda Layer

Deploy with this https://github.com/jwerre/node-canvas-lambda

### TODO

- [ ] Potential bug At G4S SECURE SOLUTIONS (UK) LIMITED, women's median hourly pay is 275.9% higher than men's, an increase of 271 percentage points since the previous year https://twitter.com/PayGapApp/status/1534883135967612928/photo/1
