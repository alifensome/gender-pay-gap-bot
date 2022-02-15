echo "Running data extraction pipeline..."

set -e

echo "Building"
npm run build

echo "Testing"
npm run test

echo "Writing from spreadsheets to JSON..."
node ./dist/read/runWriteAllData.js

echo "Combining compay data..."
node ./dist/read/index.js


echo "Formatting Json"
jq . data/companies_GPG_Data.json > data/companies_GPG_Data_temp.json
cp data/companies_GPG_Data_temp.json data/companies_GPG_Data.json
rm data/companies_GPG_Data_temp.json

echo "Finished."