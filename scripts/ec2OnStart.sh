#!/bin/bash -ex

echo "Runing boot up sequence!"
echo "Starting..." >> /home/ec2-user/appLogs/logs
touch /home/ec2-user/$(date +"%FT%H%M")
cd /home/ec2-user/gender-pay-gap-bot

/usr/local/bin/aws configure list

#sudo chown -R $USER ./
# sudo chown -R USERID.USERID *
#git pull
#aws s3 cp s3://alifensome-general-bucket/gpga/.env .env

# aws s3 sync s3://alifensome-general-bucket/gpga/ .

/usr/local/bin/aws s3 sync s3://alifensome-general-bucket/gpga/data data >> /home/ec2-user/appLogs/logs
#/usr/local/bin/aws s3 sync s3://alifensome-general-bucket/gpga/scripts scripts >> /home/ec2-user/appLogs/logs
/usr/local/bin/aws s3 sync s3://alifensome-general-bucket/gpga/dist dist >> /home/ec2-user/appLogs/logs


/home/ec2-user/.nvm/versions/node/v17.6.0/bin/node dist/queueTweets/run.js >> /home/ec2-user/appLogs/logs
