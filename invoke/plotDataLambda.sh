aws lambda invoke \
    --function-name gender-pay-gap-bot-2-dev-plotGpg5YearGraph \
        --cli-binary-format raw-in-base64-out \
    --payload file://invoke/plotGraph.json \
    ./invoke/response.json

