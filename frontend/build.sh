#!/bin/bash
export PROJECT_ID=comvis-ict-2021
docker build -t comic-colorizer-frontend:$1 .
docker tag comic-colorizer-frontend:$1 asia-southeast1-docker.pkg.dev/${PROJECT_ID}/comic-colorizer/comic-colorizer-frontend:$1
gcloud auth configure-docker asia-southeast1-docker.pkg.dev
docker push asia-southeast1-docker.pkg.dev/${PROJECT_ID}/comic-colorizer/comic-colorizer-frontend:$1