/**
 * Integration Tests: IFC to XKT Conversion
 *
 * Tests that verify convertIfc2Xkt sample generates artifacts matching golden files.
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
  validateXktHeader,
  validateJsonFile,
  validateJobState,
  validateDirectoryExists,
} from "../utils/validators.js";
import {
  compareFileSizes,
  compareDirectoryContents,
} from "../utils/comparators.js";
import type { JobState } from "../../src/bindings/event.interface.js";

const GOLDEN_DIR = path.join(
  process.cwd(),
  "tests/fixtures/golden/convertIfc2Xkt",
);
const OUTPUT_DIR = path.join(process.cwd(), ".sample-outputs/convertIfc2Xkt");

describe("convertIfc2Xkt - Golden Artifact Tests", () => {
  describe("Output Directory Structure", () => {
    it("should have export-step-1 directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "export-step-1"));
    });

    it("should have export-step-2 directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "export-step-2"));
    });

    it("should have at least one job state file", async () => {
      const files = await fs.readdir(OUTPUT_DIR);
      const jobStateFiles = files.filter((f) => f.startsWith("job-state-"));
      expect(jobStateFiles.length).toBeGreaterThan(0);
    });
  });

  describe("GLB Output (export-step-1)", () => {
    const glbPath = (dir: string) =>
      path.join(dir, "export-step-1/files/Duplex.glb");

    it("should generate Duplex.glb file", async () => {
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

    it("should have minimum expected file size (> 100KB)", async () => {
      await validateFileSize(glbPath(OUTPUT_DIR), 100 * 1024);
    });
  });

  describe("Metadata JSON (export-step-1)", () => {
    const jsonPath = (dir: string) =>
      path.join(dir, "export-step-1/files/Duplex.json");

    it("should generate Duplex.json metadata file", async () => {
      await validateFileExists(jsonPath(OUTPUT_DIR));
    });

    it("should contain valid JSON", async () => {
      const json = await validateJsonFile(jsonPath(OUTPUT_DIR));
      expect(json).toBeDefined();
    });

    it("should have minimum expected file size (> 1KB)", async () => {
      await validateFileSize(jsonPath(OUTPUT_DIR), 1024);
    });
  });

  describe("Manifest JSON (export-step-1)", () => {
    const manifestPath = (dir: string) =>
      path.join(dir, "export-step-1/files/Duplex.manifest.json");

    it("should generate Duplex.manifest.json file", async () => {
      await validateFileExists(manifestPath(OUTPUT_DIR));
    });

    it("should contain valid JSON", async () => {
      const json = await validateJsonFile(manifestPath(OUTPUT_DIR));
      expect(json).toBeDefined();
    });
  });

  describe("XKT Output (export-step-2)", () => {
    const xktPath = (dir: string) => path.join(dir, "export-step-2/Duplex.xkt");

    it("should generate Duplex.xkt file", async () => {
      await validateFileExists(xktPath(OUTPUT_DIR));
    });

    it("should have valid XKT header", async () => {
      await validateXktHeader(xktPath(OUTPUT_DIR));
    });

    it("should match golden XKT file size within 5%", async () => {
      const result = await compareFileSizes(
        xktPath(OUTPUT_DIR),
        xktPath(GOLDEN_DIR),
        5,
      );
      expect(result.matches).toBe(true);
      expect(result.sizeDifferencePercent).toBeLessThan(5);
    });

    it("should have minimum expected file size (> 500KB)", async () => {
      await validateFileSize(xktPath(OUTPUT_DIR), 500 * 1024);
    });
  });

  describe("Job State File", () => {
    let jobStatePath: string;

    beforeAll(async () => {
      const files = await fs.readdir(OUTPUT_DIR);
      const jobStateFile = files.find((f) => f.startsWith("job-state-"));
      if (!jobStateFile) {
        throw new Error("No job state file found");
      }
      jobStatePath = path.join(OUTPUT_DIR, jobStateFile);
    });

    it("should have a job state file", async () => {
      await validateFileExists(jobStatePath);
    });

    it("should contain valid JSON", async () => {
      const jobState = await validateJsonFile<JobState>(jobStatePath);
      expect(jobState).toBeDefined();
    });

    it("should have valid JobState structure", async () => {
      const jobState = await validateJsonFile<JobState>(jobStatePath);
      validateJobState(jobState);
    });

    it("should indicate successful job completion", async () => {
      const jobState = await validateJsonFile<JobState>(jobStatePath);
      expect(jobState.success).toBe(true);
    });

    it("should have all tasks succeeded", async () => {
      const jobState = await validateJsonFile<JobState>(jobStatePath);
      expect(jobState.tasksWithContext.length).toBeGreaterThan(0);

      // Check that all tasks completed (have context.endedAt)
      const allCompleted = jobState.tasksWithContext.every(
        (task: { context?: { endedAt?: string } }) =>
          task.context?.endedAt !== undefined,
      );
      expect(allCompleted).toBe(true);
    });

    it("should have expected task IDs", async () => {
      const jobState = await validateJsonFile<JobState>(jobStatePath);
      const taskIds = jobState.tasks.map((t) => t.id);

      expect(taskIds).toContain("import-file");
      expect(taskIds).toContain("convert-step-1");
      expect(taskIds).toContain("export-step-1");
      expect(taskIds).toContain("convert-step-2");
      expect(taskIds).toContain("export-step-2");
    });

    it("should have chronological timestamps", async () => {
      const jobState = await validateJsonFile<JobState>(jobStatePath);

      // Ensure all timestamps exist
      expect(jobState.createdAt).toBeDefined();
      expect(jobState.startedAt).toBeDefined();
      expect(jobState.endedAt).toBeDefined();

      const created = new Date(jobState.createdAt!).getTime();
      const started = new Date(jobState.startedAt!).getTime();
      const ended = new Date(jobState.endedAt!).getTime();

      expect(started).toBeGreaterThanOrEqual(created);
      expect(ended).toBeGreaterThanOrEqual(started);
    });
  });

  describe("Export Directory Contents", () => {
    it("should have same files in export-step-1 as golden", async () => {
      const result = await compareDirectoryContents(
        path.join(OUTPUT_DIR, "export-step-1/files"),
        path.join(GOLDEN_DIR, "export-step-1/files"),
      );
      expect(result.matches).toBe(true);
    });

    it("should have same files in export-step-2 as golden", async () => {
      const result = await compareDirectoryContents(
        path.join(OUTPUT_DIR, "export-step-2"),
        path.join(GOLDEN_DIR, "export-step-2"),
      );
      expect(result.matches).toBe(true);
    });
  });
});
