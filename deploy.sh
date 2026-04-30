#!/bin/bash
set -e

echo "Building production assets..."
npm run build

echo "Clearing existing bucket contents..."
gcloud storage rm -r gs://siddhesh-electionsync-v1/** || true

echo "Uploading fresh dist folder to GCS..."
gcloud storage cp -r dist/* gs://siddhesh-electionsync-v1/

echo "Deployment complete! Your top-50 app is live."
