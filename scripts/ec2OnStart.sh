#!/bin/bash -ex

echo "Runing boot up sequence!"
touch /home/ec2-user/$(date +"%FT%H%M")
cd /home/ec2-user/gender-pay-gap-bot
#sudo chown -R $USER ./
#git pull
#aws s3 cp s3://alifensome-general-bucket/gpga/.env .env

/home/ec2-user/.nvm/versions/node/v17.6.0/bin/node dist/queueTweets/run.js >> /home/ec2-user/appLogs/logs
