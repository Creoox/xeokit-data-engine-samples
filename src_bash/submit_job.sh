#!/bin/bash
set -e

OUTPUT_DIR=".sample-outputs/convertRvt2Xkt"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$OUTPUT_DIR"

if [ -f ".env" ]; then source .env; else echo "Error: .env not found"; exit 1; fi
if [ -z "$XDES_API_CLIENT_ID" ]; then echo "XDES_API_CLIENT_ID not set"; exit 1; fi
if [ -z "$XDES_API_CLIENT_SECRET" ]; then echo "XDES_API_CLIENT_SECRET not set"; exit 1; fi
if [ -z "$XDES_API_URL" ]; then echo "XDES_API_URL not set"; exit 1; fi

AUTH_HEADER="Basic $(echo -n "${XDES_API_CLIENT_ID}:${XDES_API_CLIENT_SECRET}" | base64 -w 0)"
RVT_FILE_URL="${RVT_FILE_URL:-https://sos-ch-gva-2.exo.io/creoox-public/xeokit-data-engine-samples/container.rvt}"

# Submit Request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${XDES_API_URL}/api/jobs/async" \
    -H "Authorization: ${AUTH_HEADER}" \
    -H "Content-Type: application/json" \
    -d "{
        \"tag\": \"rvt-xkt-timestamped\",
        \"tasks\": [
            {\"id\": \"import-file\", \"operation\": \"import/url\", \"fileType\": \"rvt\", \"url\": \"${RVT_FILE_URL}\"},
            {\"id\": \"convert-step-1\", \"operation\": \"convert/rvt/glb\", \"input\": \"import-file\", \"engine\": {\"name\": \"rvtconverter\", \"version\": \"0.1.0\"}},
            {\"id\": \"convert-step-2\", \"operation\": \"convert/glb/xkt\", \"input\": \"convert-step-1\", \"engine\": {\"name\": \"xeokit-convert\", \"version\": \"1.3.1\", \"options\": {\"includeMetadata\": true}}},
            {\"id\": \"export-step-1\", \"operation\": \"export/url\", \"input\": \"convert-step-2\"}
        ]
    }")

HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_STATUS" -ne 200 ] && [ "$HTTP_STATUS" -ne 201 ]; then
    echo "Submission failed with status: $HTTP_STATUS"
    echo "$BODY"
    exit 1
fi

# Save response
FILENAME="job-state-submitted_at_${TIMESTAMP}.json"
FILE_PATH="${OUTPUT_DIR}/${FILENAME}"
echo "$BODY" > "$FILE_PATH"

# Extract Job ID
JOB_ID=$(echo "$BODY" | grep -o '"id":"job_[^"]*"' | head -1 | cut -d'"' -f4)

# Final Output
echo "------------------------------------------------"
echo "Job successfully submitted!"
echo "Initial state saved to: $FILE_PATH"
echo "Job ID: $JOB_ID"
echo ""
echo "To check the status, run:"
echo "bash ./src_bash/check_status.sh $JOB_ID"
echo "------------------------------------------------"
