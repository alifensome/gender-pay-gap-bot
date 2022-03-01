#!/usr/bin/env bash

# Get source code
git clone https://github.com/alifensome/gender-pay-gap-bot.git
cd gender-pay-gap-bot
git pull
 
# AWS cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Get secrets
aws s3 cp s3://alifensome-general-bucket/gpga/.env .env

# Setup NPM 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# Install dependencies and build 
npm i

# Start the listener
npm run start:listener


# Provision the Systemd stuff
# https://tecadmin.net/run-shell-script-as-systemd-service/
sudo nano /lib/systemd/system/shellscript.service 
sudo systemctl daemon-reload 
sudo systemctl enable shellscript.service 
sudo systemctl start shellscript.service 
sudo systemctl status shellscript.service -l
