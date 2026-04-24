/**
 * Job Payload Validator Sample
 *
 * This script demonstrates the `/api/dev/schema/parse` endpoint for validating
 * Job payloads against the API schema. It helps developers verify their Job
 * configurations before submission.
 *
 * **Purpose:**
 * - Test if Job payloads match the schema requirements
 * - Receive detailed validation error descriptions for invalid payloads
 * - Verify payload structure before submitting to production endpoints
 *
 * **Endpoint Behavior:**
 * - **Status 200**: Payload is valid - returns the validated Job object
 * - **Status 400**: Payload is invalid - returns error details describing what's wrong
 *
 * **Output:**
 * Validation results are saved to `{outputFolder}/checkJobPayload/{tag}.json`
 *
 * @author Creoox AG
 * @since 2026
 *
 * @example
 * ```bash
 * pnpm sample:checkJobPayload
 * ```
 */

import { config } from "../utils/config.js";
import fs from "fs/promises";
import path from "path";

import { Job } from "../bindings/job.interface.js";

/**
 * Validates a Job payload against the API schema.
 *
 * Sends the Job object to the validation endpoint and returns either
 * the validated payload or validation errors.
 *
 * @param job - The Job payload to validate
 * @returns Validation result: either the validated Job (on success) or error details (on failure)
 * @throws {Error} When the API request fails with unexpected status or network error
 *
 * @example
 * ```ts
 * const result = await checkJobPayload(myJob);
 * // Returns error details if invalid, or validated Job if valid
 * ```
 */
async function checkJobPayload(job: Job) {
  const url = `${config.envs.XDES_API_URL}/api/dev/schema/parse`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(job),
      headers: {
        Authorization: config.computed.authHeader,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 400) {
      console.warn("Payload do not match Job Schema");
      return (await response.json()) as object;
    } else if (response.status === 200) {
      console.info("Payload match Job Schema");
      return (await response.json()) as Job;
    } else {
      throw Error("error_while_api_request");
    }
  } catch (error: unknown) {
    console.error(error);
    throw Error("error_while_api_request");
  }
}

/**
 * Writes validation result to a JSON file.
 *
 * Saves the validation response (either errors or validated payload)
 * to the output directory for inspection and debugging.
 *
 * @param tag - Identifier for the test case (used as filename)
 * @param content - The validation result object to save
 *
 * @example
 * ```ts
 * await writeParseInfo("valid-payload", validatedJob);
 * // Creates: output/checkJobPayload/valid-payload.json
 * ```
 */
async function writeParseInfo(tag: string, content: object) {
  const filePath = `${config.fixed.sampleOutputFolder}/checkJobPayload/${tag}.json`;
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  console.info("Creating file", filePath);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
}

/**
 * Main execution function.
 *
 * Demonstrates payload validation with two test cases:
 * 1. Invalid payload with intentional errors
 * 2. Valid payload that passes schema validation
 *
 * **Process:**
 * 1. Creates test Job payloads (one invalid, one valid)
 * 2. Sends each to the schema validation endpoint
 * 3. Saves validation results to JSON files for review
 *
 * **Use Cases:**
 * - Learn what validation errors look like
 * - Verify Job payload structure before submission
 * - Test schema compliance during development
 * - Debug payload issues with detailed error messages
 */
async function main() {
  const tag1 = "invalid-payload";
  const job1: Job = {
    tag: tag1,
    tasks: [
      {
        operation: "import/url",
        id: "task-1-import",
        fileType: "rvt",
        url: "https://example.com/path/to/your-file.rvt",
      },
      {
        operation: "convert/rvt/glb",
        id: "task-2-rvt-to-glb",
        input: "WRONG-CONTENT1",
        engine: {
          name: "rvtconverter",
          version: "0.1.0",
        },
      },
    ],
    webhook: {
      url: "WRONG-CONTENT2",
      eventTypes: ["job.failed", "job.started"],
    },
  };

  const info1 = await checkJobPayload(job1);
  await writeParseInfo(tag1, info1);

  const tag2 = "valid-payload";
  const job2: Job = {
    tag: tag2,
    tasks: [
      {
        operation: "import/url",
        id: "task-1-import",
        fileType: "rvt",
        url: "https://example.com/path/to/your-file.rvt",
      },
      {
        operation: "convert/rvt/glb",
        id: "task-2-rvt-to-glb",
        input: "task-1-import",
        engine: {
          name: "rvtconverter",
          version: "0.1.0",
        },
      },
    ],
    webhook: {
      url: "http://my-webhook-handler.example",
      eventTypes: ["job.failed", "job.started"],
    },
  };

  const info2 = await checkJobPayload(job2);
  await writeParseInfo(tag2, info2);
}

main();
