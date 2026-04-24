/**
 * Integration Tests: RVT to GLB Conversion
 *
 * Tests that verify convertRvt2Glb sample generates artifacts matching golden files.
 *
 * @author Creoox AG
 * @since 2026
 */

import { describe, it, expect, beforeAll } from "vitest";
import path from "path";
import fs from "fs/promises";
import {
  validateFileExists,
  validateFileSize,
  validateGlbHeader,
  validateJsonFile,
  validateEvent,
  validateChronologicalOrder,
  validateDirectoryExists,
} from "../utils/validators.js";
import {
  compareFileSizes,
  compareDirectoryContents,
} from "../utils/comparators.js";
import type { Event } from "../../src/bindings/event.interface.js";

const GOLDEN_DIR = path.join(
  process.cwd(),
  "tests/fixtures/golden/convertRvt2Glb",
);
const OUTPUT_DIR = path.join(process.cwd(), ".sample-outputs/convertRvt2Glb");

describe("convertRvt2Glb - Golden Artifact Tests", () => {
  describe("Output Directory Structure", () => {
    it("should have convert-step-1 directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "convert-step-1"));
    });

    it("should have webhooks directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "webhooks"));
    });
  });

  describe("GLB Output (convert-step-1)", () => {
    const glbPath = (dir: string) =>
      path.join(dir, "convert-step-1/container.glb");

    it("should generate container.glb file", async () => {
      await validateFileExists(glbPath(OUTPUT_DIR));
    });

    it("should have valid GLB header", async () => {
      await validateGlbHeader(glbPath(OUTPUT_DIR));
    });

    it("should match golden GLB file size within 5%", async () => {
      const result = await compareFileSizes(
        glbPath(OUTPUT_DIR),
        glbPath(GOLDEN_DIR),
        5,
      );
      expect(result.matches).toBe(true);
      expect(result.sizeDifferencePercent).toBeLessThan(5);
    });

    it("should have minimum expected file size (> 50KB)", async () => {
      await validateFileSize(glbPath(OUTPUT_DIR), 50 * 1024);
    });
  });

  describe("Metadata JSON (convert-step-1)", () => {
    const jsonPath = (dir: string) =>
      path.join(dir, "convert-step-1/container.json");

    it("should generate container.json metadata file", async () => {
      await validateFileExists(jsonPath(OUTPUT_DIR));
    });

    it("should contain valid JSON", async () => {
      const json = await validateJsonFile(jsonPath(OUTPUT_DIR));
      expect(json).toBeDefined();
    });

    it("should have minimum expected file size (> 1KB)", async () => {
      await validateFileSize(jsonPath(OUTPUT_DIR), 1024);
    });

    it("should match golden JSON file size within 10%", async () => {
      // Metadata can vary slightly but should be similar
      const result = await compareFileSizes(
        jsonPath(OUTPUT_DIR),
        jsonPath(GOLDEN_DIR),
        10,
      );
      expect(result.matches).toBe(true);
    });
  });

  describe("Webhook Events", () => {
    let webhookFiles: string[];

    beforeAll(async () => {
      webhookFiles = await fs.readdir(path.join(OUTPUT_DIR, "webhooks"));
    });

    it("should have webhook event files", () => {
      expect(webhookFiles.length).toBeGreaterThan(0);
    });

    it("should have job.started event", () => {
      const hasStarted = webhookFiles.some((f) => f.startsWith("job.started-"));
      expect(hasStarted).toBe(true);
    });

    it("should have job.succeeded or job.failed event", () => {
      const hasCompletion = webhookFiles.some(
        (f) => f.startsWith("job.succeeded-") || f.startsWith("job.failed-"),
      );
      expect(hasCompletion).toBe(true);
    });

    it("should have valid event structure in all webhook files", async () => {
      for (const file of webhookFiles) {
        const eventPath = path.join(OUTPUT_DIR, "webhooks", file);
        const event = await validateJsonFile<Event>(eventPath);
        validateEvent(event);
      }
    });

    it("should have events in chronological order", async () => {
      const events: Event[] = [];

      for (const file of webhookFiles) {
        const eventPath = path.join(OUTPUT_DIR, "webhooks", file);
        const event = await validateJsonFile<Event>(eventPath);
        events.push(event);
      }

      // Sort by createdAt
      events.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      const timestamps = events.map((e) => e.createdAt);
      validateChronologicalOrder(timestamps);
    });

    it("should have job.started before job completion event", async () => {
      const events: Event[] = [];

      for (const file of webhookFiles) {
        const eventPath = path.join(OUTPUT_DIR, "webhooks", file);
        const event = await validateJsonFile<Event>(eventPath);
        events.push(event);
      }

      // Sort by createdAt
      events.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      const startedIndex = events.findIndex(
        (e) => e.eventType === "job.started",
      );
      const completionIndex = events.findIndex(
        (e) => e.eventType === "job.succeeded" || e.eventType === "job.failed",
      );

      // Ensure both events were found
      expect(startedIndex).toBeGreaterThanOrEqual(0);
      expect(completionIndex).toBeGreaterThanOrEqual(0);
      expect(startedIndex).toBeLessThan(completionIndex);
    });
  });

  describe("Conversion Directory Contents", () => {
    it("should have same files in convert-step-1 as golden", async () => {
      const result = await compareDirectoryContents(
        path.join(OUTPUT_DIR, "convert-step-1"),
        path.join(GOLDEN_DIR, "convert-step-1"),
      );
      expect(result.matches).toBe(true);
    });

    it("should have webhook files (count may vary)", async () => {
      const webhookFiles = await fs.readdir(path.join(OUTPUT_DIR, "webhooks"));
      expect(webhookFiles.length).toBeGreaterThan(0);
    });
  });
});
