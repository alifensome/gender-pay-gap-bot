#!/usr/bin/env bash

set -e

npm run build
npm run test

aws s3 sync dist s3://alifensome-general-bucket/gpga/dist
# aws s3 sync node_modules s3://alifensome-general-bucket/gpga/node_modules  // maybe???
aws s3 sync data s3://alifensome-general-bucket/gpga/data
aws s3 sync scripts s3://alifensome-general-bucket/gpga/scripts
aws s3 cp package.json s3://alifensome-general-bucket/gpga/package.json
aws s3 cp package-lock.json s3://alifensome-general-bucket/gpga/package-lock.json

# Todo make the listener sync on start
# restart listener