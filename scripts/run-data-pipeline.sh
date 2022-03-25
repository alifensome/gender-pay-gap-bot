#!/usr/bin/env bash

echo "Running data extraction pipeline..."

set -e

echo "Building"
npm run build

echo "Testing"
npm run test

echo "Writing from spreadsheets to JSON..."
node --unhandled-rejections=strict ./dist/read/runWriteAllData.js

echo "Combining compay data..."
node --unhandled-rejections=strict ./dist/read/index.js


echo "Formatting Json"
jq . data/companies_GPG_Data.json > data/companies_GPG_Data_temp.json
cp data/companies_GPG_Data_temp.json data/companies_GPG_Data.json
rm data/companies_GPG_Data_temp.json

echo "combining twitter data and company data..."
node --unhandled-rejections=strict dist/analysis/joinTweetsToCompanyData.js

npm run test

echo "Finished."