#!/bin/bash -ex

echo "Runing boot up sequence!"
touch /home/ec2-user/$(date +"%FT%H%M")
cd /home/ec2-user/gender-pay-gap-bot
git pull
aws s3 cp s3://alifensome-general-bucket/gpga/.env .env
npm run start:listener test >> /home/ec2-user/appLogs/logs