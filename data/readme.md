# Process
Run the data pipeline 
```
./scripts/run-data-pipeline.sh
```

# Cloudwatch insights queries
```
filter @message like /successfullySentTweet/ 
    | stats count(*) as sentCount
```