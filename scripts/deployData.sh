#!/usr/bin/env bash
set -e

aws s3 cp ./data/data/companies_GPG_Data.json s3://gpga/data/companies_GPG_Data.json
aws s3 cp ./data/data/twitterAccountData/twitterUserData-prod.json s3://gpga/data/twitterUserData-prod.json

echo "Finished copying data to bucket."