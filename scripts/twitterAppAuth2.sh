source ../.env

curl --request POST -u$TWITTER_API_KEY:$TWITTER_API_SECRET_KEY \
  --url 'https://api.twitter.com/oauth2/token?grant_type=client_credentials'