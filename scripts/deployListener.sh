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

# The listener syncs dist and data on restart start.
echo "Restarting listener ID: $EC2_ID"
source ./private/var.sh 
aws ec2 reboot-instances --instance-ids $EC2_ID
