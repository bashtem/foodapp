#!/bin/bash

# Navigate to the infra folder and run docker compose
cd "$(dirname "$0")/infra/_dev" || exit 1

docker compose up -d