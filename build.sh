#!/bin/env bash

rm -rf dist/
mkdir dist/
cp -r {index,service}.js dist/
cp package.json dist/
cd dist/
npm install --production
