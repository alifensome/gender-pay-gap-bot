# https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent

curl --location 'https://api.twitter.com/2/tweets/search/recent?query=from:TwitterDev%20OR%20from:PayGapApp&tweet.fields=id,text&expansions=author_id&user.fields=id,name,username' --header "Authorization: Bearer $1"

