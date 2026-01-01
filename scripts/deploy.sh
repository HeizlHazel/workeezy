#!/bin/bash
set -e

ECR_URI=002177417362.dkr.ecr.ap-northeast-2.amazonaws.com/workeezy-server
CONTAINER_NAME=workeezy-server

echo "Pull latest image"
docker pull $ECR_URI:latest

echo "Stop & remove old container"
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "Run new container"
docker run -d \
  --name $CONTAINER_NAME \
  -p 8080:8080 \
  --env-file /home/ubuntu/workeezy.env \
  --restart always \
  $ECR_URI:latest

echo "Deploy finished"