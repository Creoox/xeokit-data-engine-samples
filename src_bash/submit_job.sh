#!/bin/bash
set -e

OUTPUT_DIR=".sample-outputs/convert2Xkt"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$OUTPUT_DIR"

if [ -f ".env" ]; then source .env; else echo "Error: .env not found"; exit 1; fi
if [ -z "$XDES_API_CLIENT_ID" ]; then echo "XDES_API_CLIENT_ID not set"; exit 1; fi
if [ -z "$XDES_API_CLIENT_SECRET" ]; then echo "XDES_API_CLIENT_SECRET not set"; exit 1; fi
if [ -z "$XDES_API_URL" ]; then echo "XDES_API_URL not set"; exit 1; fi

AUTH_HEADER="Basic $(echo -n "${XDES_API_CLIENT_ID}:${XDES_API_CLIENT_SECRET}" | base64 -w 0)"

# Parse command line arguments
FILE_TYPE=""
SOURCE_URL=""

usage() {
    echo "Usage: $0 --type <rvt|ifc|step> [--url <source_url>]"
    echo ""
    echo "Options:"
    echo "  --type    File type to convert (rvt, ifc, or step)"
    echo "  --url     Optional source URL (uses default URL if not provided)"
    echo ""
    echo "Examples:"
    echo "  $0 --type rvt"
    echo "  $0 --type ifc --url https://example.com/model.ifc"
    echo "  $0 --type step"
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            FILE_TYPE="$2"
            shift 2
            ;;
        --url)
            SOURCE_URL="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate file type
if [ -z "$FILE_TYPE" ]; then
    echo "Error: --type is required"
    usage
fi

if [[ ! "$FILE_TYPE" =~ ^(rvt|ifc|step)$ ]]; then
    echo "Error: --type must be one of: rvt, ifc, step"
    exit 1
fi

# Set default URLs based on file type
case $FILE_TYPE in
    rvt)
        DEFAULT_URL="https://sos-ch-gva-2.exo.io/creoox-public/xeokit-data-engine-samples/container.rvt"
        CONVERT_OPERATION="convert/rvt/glb"
        ENGINE_NAME="xeoRvt"
        ENGINE_VERSION="0.2.0"
        ;;
    ifc)
        DEFAULT_URL="https://sos-ch-gva-2.exo.io/creoox-public/xeokit-data-engine-samples/Duplex.ifc"
        CONVERT_OPERATION="convert/ifc/glb"
        ENGINE_NAME="xeoIfc"
        ENGINE_VERSION="5.6.11"
        ;;
    step)
        DEFAULT_URL="https://sos-ch-gva-2.exo.io/creoox-public/xeokit-data-engine-samples/doors.step"
        CONVERT_OPERATION="convert/step/glb"
        ENGINE_NAME="xeoStep"
        ENGINE_VERSION="0.1.0"
        ;;
esac

# Use provided URL or default
FILE_URL="${SOURCE_URL:-$DEFAULT_URL}"

echo "Converting $FILE_TYPE to XKT..."
echo "Source URL: $FILE_URL"

# Submit Request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${XDES_API_URL}/api/jobs/async" \
    -H "Authorization: ${AUTH_HEADER}" \
    -H "Content-Type: application/json" \
    -d "{
        \"tag\": \"${FILE_TYPE}-xkt-${TIMESTAMP}\",
        \"tasks\": [
            {\"id\": \"import-file\", \"operation\": \"import/url\", \"fileType\": \"${FILE_TYPE}\", \"url\": \"${FILE_URL}\"},
            {\"id\": \"convert-to-glb\", \"operation\": \"${CONVERT_OPERATION}\", \"input\": \"import-file\", \"engine\": {\"name\": \"${ENGINE_NAME}\", \"version\": \"${ENGINE_VERSION}\"}},
            {\"id\": \"convert-to-xkt\", \"operation\": \"convert/glb/xkt\", \"input\": \"convert-to-glb\", \"engine\": {\"name\": \"xeokit-convert\", \"version\": \"1.3.2\", \"options\": {\"includeMetadata\": true}}},
            {\"id\": \"export-result\", \"operation\": \"export/url\", \"input\": \"convert-to-xkt\"}
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
FILENAME="job-${FILE_TYPE}-submitted_${TIMESTAMP}.json"
FILE_PATH="${OUTPUT_DIR}/${FILENAME}"
echo "$BODY" > "$FILE_PATH"

# Extract Job ID
JOB_ID=$(echo "$BODY" | grep -o '"id":"job_[^"]*"' | head -1 | cut -d'"' -f4)

# Final Output
echo "------------------------------------------------"
echo "✅ Job successfully submitted!"
echo "File type: $FILE_TYPE"
echo "Source URL: $FILE_URL"
echo "Initial state saved to: $FILE_PATH"
echo "Job ID: $JOB_ID"
echo ""
echo "To check the status, run:"
echo "bash ./src_bash/check_status.sh $JOB_ID"
echo "------------------------------------------------"
