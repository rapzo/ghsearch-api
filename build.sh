#!/bin/env bash

rm -rf dist/
mkdir dist/
cp {index,service}.js dist/
cp package.json dist/
cd dist/
npm install --production
cd ..

$(aws ecr get-login --no-include-email --region eu-west-1)
docker build -t ghsearch-api --build-arg GITHUB_API_TOKEN=$(cat .env) .
docker tag ghsearch-api:latest 168268005725.dkr.ecr.eu-west-1.amazonaws.com/ghsearch-api:latest
docker push 168268005725.dkr.ecr.eu-west-1.amazonaws.com/ghsearch-api:latest
