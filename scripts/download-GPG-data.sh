#!/usr/bin/env bash

set -e
echo "Downloading 2021 data..."
wget https://gender-pay-gap.service.gov.uk/viewing/download-data/2021 \
-O "./data/UK Gender Pay Gap Data - 2021 to 2022.csv"

echo "Downloading 2022 data..."
wget https://gender-pay-gap.service.gov.uk/viewing/download-data/2022 \
-O "./data/UK Gender Pay Gap Data - 2022 to 2023.csv"