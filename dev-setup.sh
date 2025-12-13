#!/bin/bash

ACTION=${1:-up}

cd "infra/development" || exit 1

if [ "$ACTION" = "down" ]; then
  docker compose down
elif [ "$ACTION" = "up" ]; then
  docker compose up -d
  echo "Docker Compose services started in detached mode."
else
  echo "Usage: $0 [up|down]"
  exit 1
fi