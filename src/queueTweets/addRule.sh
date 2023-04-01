curl -X POST 'https://api.twitter.com/2/tweets/search/stream/rules' \
-H "Content-type: application/json" \
-H "Authorization: Bearer $1" -d \
'{
  "add": [
    {"value": "@PayGapApp", "tag":"tweets at the pay gap app" }
  ]
}'