#!/usr/bin/env bash
set -Eeuo pipefail

echo "=== DEPLOY START ==="
date

BASE_DIR="/home/ubuntu/workeezy-backend"
JAR_PATH="$BASE_DIR/workeezy/build/libs/workeezy-0.0.1-SNAPSHOT.jar"
LOG_FILE="$BASE_DIR/app.log"
PROFILE="prod"
PORT=8080

cd "$BASE_DIR"

echo "[1] Write application-prod.yml"
if [[ -z "${APPLICATION_PROPERTIES:-}" ]]; then
  echo "ERROR: APPLICATION_PROPERTIES is not set"
  exit 1
fi
printf "%s" "$APPLICATION_PROPERTIES" > application-prod.yml
ls -l application-prod.yml

echo "[2] Kill old process (port $PORT)"
PID=$(lsof -ti :$PORT || true)
if [[ -n "$PID" ]]; then
  echo "Killing PID=$PID"
  kill -15 $PID
  sleep 2
else
  echo "No process on port $PORT"
fi

echo "[3] Start Spring Boot"
nohup java -jar "$JAR_PATH" \
  --spring.profiles.active="$PROFILE" \
  --spring.config.location=file:/home/ubuntu/workeezy-backend/application-prod.yml \
  > "$LOG_FILE" 2>&1 &

sleep 3

echo "[4] Check process"
pgrep -af java || echo "Spring not running"

echo "[5] Check log"
ls -l "$LOG_FILE" || true

echo "=== DEPLOY END ==="