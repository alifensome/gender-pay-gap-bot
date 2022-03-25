#!/usr/bin/env bash

set -e
wget https://gender-pay-gap.service.gov.uk/viewing/download-data/2021 \
-O "./data/UK Gender Pay Gap Data - 2021 to 2022.csv"
 # TODO build to xlsn file.
 # libreoffice --convert-to xlsx  ./data/UK\ Gender\ Pay\ Gap\ Data\ -\ 2021\ to\ 2022.csv 