#!/usr/bin/env bash

set -e

echo "Running pre commit..."
npm run build
npm run test