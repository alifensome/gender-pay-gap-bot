#!/usr/bin/env bash

set -e
echo "Downloading data..."
wget https://gender-pay-gap.service.gov.uk/viewing/download-data/2021 \
-O "./data/UK Gender Pay Gap Data - 2021 to 2022.csv"
