/**
 * RVM to GLB Conversion Sample with Webhook Monitoring
 *
 * This script demonstrates RVM (AVEVA PDMS / E3D) file conversion to GLB format
 * using the Xeokit Data Engine API, optionally enriched with an RVM attributes
 * (ATT/ATR) file, with webhook.site integration for real-time job progress
 * monitoring.
 *
 * **Purpose:**
 * - Submit an asynchronous RVM → GLB conversion job
 * - Optionally attach an RVM attributes file as an additional input
 * - Monitor job progress via webhook.site instead of direct API polling
 * - Download output files when job completes successfully
 *
 * **Usage:**
 * - 1st CLI argument (required): publicly reachable URL to an `.rvm` file
 * - 2nd CLI argument (optional): publicly reachable URL to the matching
 *   attributes file (e.g. `.att`, `.atr`, `.txt`)
 *
 * **Workflow:**
 * 1. Submit RVM to GLB conversion job (with optional attributes import) and webhook.site URL
 * 2. Poll webhook.site for job completion events (every 5 seconds for up to 5 minutes)
 * 3. Parse webhook events to find job.succeeded or job.failed
 * 4. Download GLB output files from successful jobs
 *
 * **Output:**
 * Files are saved to `.sample-outputs/convertRvm2Glb/`:
 * - `webhooks/` - All webhook events received for this job
 * - `convert-step-1/` - Downloaded GLB conversion outputs
 *
 * @author Creoox AG
 * @since 2026
 *
 * @example
 * ```bash
 * pnpm sample:convertRvm2Glb <rvm-url> [attributes-url]
 * ```
 */

import { config } from "../utils/config.js";
import fs from "fs/promises";
import path from "path";
import { Job } from "../bindings/job.interface.js";
import { JobState, Event } from "../bindings/event.interface.js";
import { WebhookSiteApiResponse } from "../bindings/webhook-site.external.interface.js";

const USAGE = "Usage: pnpm sample:convertRvm2Glb <rvm-url> [attributes-url]";

/**
 * Validates that the given string is a parseable URL.
 *
 * @returns The lowercased URL pathname
 * @throws Exits the process when the URL is invalid
 */
function parseUrlOrExit(value: string, label: string): string {
  try {
    return new URL(value).pathname.toLowerCase();
  } catch {
    console.error(`Invalid ${label} URL: ${value}\n${USAGE}`);
    process.exit(1);
  }
}

/**
 * Reads the RVM URL (required) and attributes URL (optional) from the CLI arguments.
 *
 * @returns The validated RVM URL and, if provided, the attributes URL
 * @throws Exits the process when the RVM URL is missing, invalid, or not an `.rvm` file
 */
function parseArgs(): { rvmUrl: string; attributesUrl?: string } {
  const [rvmUrl, attributesUrl] = process.argv.slice(2);

  if (!rvmUrl) {
    console.error(`Missing RVM URL.\n${USAGE}`);
    process.exit(1);
  }

  const ext = path.extname(parseUrlOrExit(rvmUrl, "RVM")).slice(1);
  if (ext !== "rvm") {
    console.error(
      `Unsupported file extension ".${ext}" (expected .rvm).\n${USAGE}`,
    );
    process.exit(1);
  }

  if (attributesUrl) {
    parseUrlOrExit(attributesUrl, "attributes");
  }

  return { rvmUrl, attributesUrl };
}

async function initRvm2GlbJob(
  rvmUrl: string,
  attributesUrl?: string,
): Promise<JobState> {
  const job: Job = {
    tag: "rvm-glb",
    webhook: {
      url: config.computed.webhookSitePostUrl,
      eventTypes: ["job.started", "job.succeeded", "job.failed"],
    },
    tasks: [
      {
        id: "import-file",
        operation: "import/url",
        fileType: "rvm",
        url: rvmUrl,
      },
      ...(attributesUrl
        ? [
            {
              id: "import-attributes",
              operation: "import/url" as const,
              fileType: "rvm-attributes" as const,
              url: attributesUrl,
            },
          ]
        : []),
      {
        id: "convert-step-1",
        operation: "convert/rvm/glb",
        input: "import-file",
        ...(attributesUrl && {
          additionalInputs: { attributes: "import-attributes" },
        }),
        engine: {
          name: "xeoRvm",
        },
      },
    ],
  };

  const url = `${config.envs.XDES_API_URL}/api/jobs/async`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(job),
      headers: {
        Authorization: config.computed.authHeader,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = (await response.json()) as JobState;
    return result;
  } catch (error: unknown) {
    console.error(error);
    throw Error("error_while_api_request");
  }
}

/**
 * Polls webhook.site API for events related to a specific job ID.
 *
 * Fetches webhook events from webhook.site, parses the event data, and saves
 * events that match the provided job ID to the output folder.
 *
 * **Process:**
 * 1. Fetch webhook events from webhook.site API
 * 2. Parse each datum.content as JSON to get Event objects
 * 3. Check if event.jobState.id matches the target job ID
 * 4. Save matching events to `.sample-outputs/convertRvm2Glb/webhooks/`
 *
 * @param jobId - The job ID to filter events for
 * @returns Promise resolving to array of matching events
 *
 * @example
 * ```ts
 * const events = await pollWebhookSiteForEvents('job_abc123');
 * console.log(`Found ${events.length} webhook events for this job`);
 * ```
 */
async function pollWebhookSiteForEvents(jobId: string): Promise<Event[]> {
  const url = config.computed.webhookSiteApiUrl;
  const matchingEvents: Event[] = [];

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch webhooks: ${response.status}`);
    }

    const webhookData = (await response.json()) as WebhookSiteApiResponse;
    console.log(
      `  Retrieved ${webhookData.data.length} webhook requests from webhook.site`,
    );

    for (const datum of webhookData.data) {
      try {
        // Parse the content string as JSON to get the Event
        const event = JSON.parse(datum.content) as Event;

        // Check if this event matches our job ID
        if (event.jobState && event.jobState.id === jobId) {
          matchingEvents.push(event);

          // Save the event to file
          const eventDir = path.join(
            config.fixed.sampleOutputFolder,
            "convertRvm2Glb",
            "webhooks",
          );
          await fs.mkdir(eventDir, { recursive: true });

          const eventFileName = `${event.eventType}-${event.id}.json`;
          const eventFilePath = path.join(eventDir, eventFileName);

          await fs.writeFile(eventFilePath, JSON.stringify(event, null, 2));

          console.log(`  ✓ Saved webhook event: ${event.eventType}`);
        }
      } catch (_parseError) {
        // Skip non-JSON webhook requests or invalid events
        continue;
      }
    }

    if (matchingEvents.length > 0) {
      console.log(`  Found ${matchingEvents.length} event(s) for job ${jobId}`);
    }
    return matchingEvents;
  } catch (error) {
    console.error("Error polling webhook.site:", error);
    throw error;
  }
}

/**
 * Polls webhook.site until job completes (succeeded or failed) or timeout.
 *
 * Continuously checks webhook.site every 5 seconds for up to 5 minutes,
 * looking for a job completion event (job.succeeded or job.failed).
 *
 * @param jobId - The job ID to monitor
 * @returns Promise resolving to the completion Event if succeeded, or null if failed/timeout
 * @throws {Error} When webhook polling fails
 *
 * @example
 * ```ts
 * const successEvent = await pollUntilCompletion('job_abc123');
 * if (successEvent) {
 *   console.log('Job succeeded!');
 * }
 * ```
 */
async function pollUntilCompletion(jobId: string): Promise<Event | null> {
  const maxDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  const pollInterval = 5000; // 5 seconds between polls
  const startTime = Date.now();

  console.log("\nPolling webhook.site for job completion events...");
  console.log("(Will check every 5 seconds for up to 5 minutes)");

  let completionEvent: Event | null = null;

  while (!completionEvent && Date.now() - startTime < maxDuration) {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    console.log(`\n[${elapsedSeconds}s elapsed] Checking for webhooks...`);

    const events = await pollWebhookSiteForEvents(jobId);

    // Check if we received a completion event (succeeded or failed)
    completionEvent =
      events.find(
        (event) =>
          event.eventType === "job.succeeded" ||
          event.eventType === "job.failed",
      ) || null;

    if (completionEvent) {
      console.log(`\n✓ Job completed with event: ${completionEvent.eventType}`);
      console.log(
        `Final status: ${completionEvent.jobState.success ? "SUCCESS" : "FAILED"}`,
      );
      break;
    }

    // Wait before next poll if we haven't found the completion event
    if (Date.now() - startTime < maxDuration) {
      console.log(
        `Waiting ${pollInterval / 1000} seconds before next check...`,
      );
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  if (!completionEvent) {
    console.warn(
      "\n⚠ Timeout: Job did not complete within 5 minutes. Check webhook.site manually.",
    );
    return null;
  }

  // Return the event only if it succeeded
  if (completionEvent.eventType === "job.succeeded") {
    return completionEvent;
  }

  console.error("\n✗ Job failed");
  return null;
}

/**
 * Downloads GLB files from a successful job completion event.
 *
 * Parses the event's job state to find tasks with output files and downloads them.
 *
 * @param event - The job.succeeded event containing file URLs
 * @param taskIds - Array of task IDs to download files from (default: ['convert-step-1'])
 *
 * @example
 * ```ts
 * await downloadFilesFromEvent(successEvent, ['convert-step-1']);
 * // Files saved to: .sample-outputs/convertRvm2Glb/convert-step-1/
 * ```
 */
async function downloadFilesFromEvent(
  event: Event,
  taskIds: string[] = ["convert-step-1"],
) {
  const jobState = event.jobState;

  if (!jobState.tasksWithContext) {
    throw new Error("No tasksWithContext available in job state");
  }

  console.log("\n=== Downloading output files ===");

  for (const taskId of taskIds) {
    const task = jobState.tasksWithContext.find((t) => t.id === taskId);

    if (!task) {
      console.warn(`Task "${taskId}" not found in tasksWithContext`);
      continue;
    }

    if (!task.context || !task.context.files) {
      console.warn(`No files found for task "${taskId}"`);
      continue;
    }

    console.log(`\nDownloading files from task: ${taskId}`);

    for (const file of task.context.files) {
      if (!file.url) {
        console.warn(`No URL available for file: ${file.path}`);
        continue;
      }

      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const fileName = path.basename(file.path);
        const outputDir = path.join(
          config.fixed.sampleOutputFolder,
          "convertRvm2Glb",
          taskId,
        );
        const outputPath = path.join(outputDir, fileName);

        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(outputPath, Buffer.from(buffer));

        console.log(
          `✓ Downloaded: ${fileName} (${(file.fileSize / 1024).toFixed(2)} KB) -> ${outputPath}`,
        );
      } catch (error) {
        console.error(`✗ Failed to download ${file.path}:`, error);
      }
    }
  }
}

async function main() {
  const { rvmUrl, attributesUrl } = parseArgs();
  console.log(`Converting RVM model: ${rvmUrl}`);
  console.log(
    attributesUrl
      ? `Using attributes file: ${attributesUrl}`
      : "No attributes file provided",
  );

  const initialJobState = await initRvm2GlbJob(rvmUrl, attributesUrl);
  const jobId = initialJobState.id;
  console.log(`Job created with ID: ${jobId}`);

  // Poll until job completes
  const successEvent = await pollUntilCompletion(jobId);

  if (successEvent) {
    // Download files from the successful job
    await downloadFilesFromEvent(successEvent, ["convert-step-1"]);
    console.log("\n✓ All files downloaded successfully!");
  } else {
    console.error("\n✗ Job did not succeed, skipping file downloads");
  }
}

main();
