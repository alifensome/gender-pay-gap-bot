#!/usr/bin/env bash

set -e

echo "Building project..."
npm run build
npm run test

echo "Uploading deployment..."
aws s3 sync dist s3://alifensome-general-bucket/gpga/dist
aws s3 sync data s3://alifensome-general-bucket/gpga/data
aws s3 sync scripts s3://alifensome-general-bucket/gpga/scripts
aws s3 cp package.json s3://alifensome-general-bucket/gpga/package.json
aws s3 cp package-lock.json s3://alifensome-general-bucket/gpga/package-lock.json

# The listener syncs dist and data on restart start.
echo "Restarting listener ID: $EC2_ID"
source ./private/var.sh 
aws ec2 reboot-instances --instance-ids $EC2_ID
echo "Finished deloyment."

echo "listening for logs..."
aws logs tail /aws/ec2/gpga-listener --follow
