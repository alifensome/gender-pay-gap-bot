#!/usr/bin/env bash

# Get source code
git clone https://github.com/alifensome/gender-pay-gap-bot.git
cd gender-pay-gap-bot
git pull

# Get secrets

# Install dependencies and build 
npm i
npm run build

# Start the listener
