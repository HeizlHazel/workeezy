#!/bin/bash
set -e

APP_DIR=/home/ubuntu/workeezy-backend
REGION=ap-northeast-2
ECR_REGISTRY=002177417362.dkr.ecr.ap-northeast-2.amazonaws.com

echo "Move to app directory"
cd $APP_DIR

echo "ECR login"
aws ecr get-login-password --region $REGION \
 | docker login --username AWS --password-stdin $ECR_REGISTRY

echo "Pull latest images"
docker compose pull

echo "Stop & remove old containers"
docker compose down --remove-orphans

echo "Start containers (app + redis)"
docker compose up -d

echo "Deploy finished"