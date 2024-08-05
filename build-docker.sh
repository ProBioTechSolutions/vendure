#!/bin/bash

# format to use:
# ./build-docker.sh your-project


#gcloud auth configure-docker -q
#gcloud auth configure-docker eu.gcr.io

#docker build -t eu.gcr.io/$1/vendure .
#docker run -dp 3000:3000 -e "DB_HOST=$DB_HOST" --name vendure eu.gcr.io/$1/vendure npm run start


gcloud builds submit --tag eu.gcr.io/$1/vendure

# Configure docker to use Google authentication
#gcloud auth configure-docker -q
#gcloud auth configure-docker eu.gcr.io
#docker push eu.gcr.io/$1/vendure
