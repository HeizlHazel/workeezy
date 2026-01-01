#!/bin/bash
set -e

REGION=ap-northeast-2
ACCOUNT_ID=020513637952
ECR_REPO=workeezy-server
IMAGE_URI=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest
CONTAINER_NAME=workeezy-server

echo "ECR login"
aws ecr get-login-password --region $REGION \
| sudo docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

echo "Pull latest image"
sudo docker pull $IMAGE_URI

echo "Stop & remove old container"
sudo docker stop $CONTAINER_NAME || true
sudo docker rm $CONTAINER_NAME || true

echo "Run new container"
sudo docker run -d \
  --name $CONTAINER_NAME \
  -p 8080:8080 \
  --env-file /home/ubuntu/workeezy.env \
  --restart always \
  $IMAGE_URI

echo "Deploy finished"