#!/bin/bash

# format to use:
# ./deploy.sh <cloud run name> <database name> <memory> <gcloud project>

export ENV_VARS=$(paste -sd, .env)

gcloud auth configure-docker eu.gcr.io
gcloud container clusters get-credentials probio-cluster --region europe-central2
gcloud components install kubectl

kubectl rollout restart deployment/probio-vendure
