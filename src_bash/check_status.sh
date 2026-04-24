#!/bin/bash
set -e

JOB_ID=$1
if [ -z "$JOB_ID" ]; then echo "Usage: $0 <job_id>"; exit 1; fi

OUTPUT_DIR=".sample-outputs/convertRvt2Xkt"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$OUTPUT_DIR"

if [ -f ".env" ]; then source .env; else echo "Error: .env not found"; exit 1; fi
if [ -z "$XDES_API_CLIENT_ID" ]; then echo "XDES_API_CLIENT_ID not set"; exit 1; fi
if [ -z "$XDES_API_CLIENT_SECRET" ]; then echo "XDES_API_CLIENT_SECRET not set"; exit 1; fi
if [ -z "$XDES_API_URL" ]; then echo "XDES_API_URL not set"; exit 1; fi

AUTH_HEADER="Basic $(echo -n "${XDES_API_CLIENT_ID}:${XDES_API_CLIENT_SECRET}" | base64 -w 0)"

# Fetch Response
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${XDES_API_URL}/api/jobs/${JOB_ID}" \
    -H "Authorization: ${AUTH_HEADER}")

HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

# In case id is not correct or job not found
if [ "$HTTP_STATUS" != "200" ]; then echo "response status: $HTTP_STATUS"; echo "response body $BODY": ; exit 1; fi

# Save File
FILENAME="job-state-${JOB_ID}_checked_at_${TIMESTAMP}.json"
FILE_PATH="${OUTPUT_DIR}/${FILENAME}"
echo "$BODY" > "$FILE_PATH"

# -----------------------------------------------------------------------------
# REFINED PARSING (Ensuring we only get the FIRST match)
# -----------------------------------------------------------------------------

# We use head -1 to ignore the timestamps inside the "tasksWithContext" array.
ENDED_AT=$(echo "$BODY" | grep -o '"endedAt":[^,}]*' | head -1 | cut -d':' -f2- | tr -dc '[:alnum:].:-')
SUCCESS=$(echo "$BODY" | grep -o '"success":[^,}]*' | head -1 | cut -d':' -f2- | tr -dc '[:alnum:]')

echo "------------------------------------------------"
echo "Check completed for ID: $JOB_ID"
echo "Log: $FILE_PATH"
echo "------------------------------------------------"

# Debugging lines (uncomment if you still have issues)
# echo "DEBUG: ENDED_AT variable is [$ENDED_AT]"
# echo "DEBUG: SUCCESS variable is [$SUCCESS]"

if [ "$ENDED_AT" = "null" ] || [ -z "$ENDED_AT" ]; then
    echo -e "STATUS: \033[0;34mProcessing...\033[0m"
else
    if [ "$SUCCESS" = "true" ]; then
        echo -e "STATUS: \033[0;32mSUCCESS!\033[0m"
        echo "Finished at: $ENDED_AT"
    else
        echo -e "STATUS: \033[0;31mFAILED\033[0m"
        echo "The job ended, but the success check failed."
    fi
fi
echo "------------------------------------------------"
