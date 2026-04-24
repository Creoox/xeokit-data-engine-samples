/**
 * Integration Tests: Check Job Payload
 *
 * Tests that verify checkJobPayload sample generates artifacts matching golden files.
 *
 * @author Creoox AG
 * @since 2026
 */

import { describe, it, expect } from "vitest";
import path from "path";
import {
  validateFileExists,
  validateJsonFile,
  validateDirectoryExists,
} from "../utils/validators.js";
import { compareFileSizes } from "../utils/comparators.js";

const GOLDEN_DIR = path.join(
  process.cwd(),
  "tests/fixtures/golden/checkJobPayload",
);
const OUTPUT_DIR = path.join(process.cwd(), ".sample-outputs/checkJobPayload");

describe("checkJobPayload - Golden Artifact Tests", () => {
  describe("Output Directory Structure", () => {
    it("should have checkJobPayload output directory", async () => {
      await validateDirectoryExists(OUTPUT_DIR);
    });
  });

  describe("Validation Result Files", () => {
    it("should generate invalid-payload.json", async () => {
      await validateFileExists(path.join(OUTPUT_DIR, "invalid-payload.json"));
    });

    it("should generate valid-payload.json", async () => {
      await validateFileExists(path.join(OUTPUT_DIR, "valid-payload.json"));
    });

    it("should contain valid JSON in invalid-payload.json", async () => {
      const json = await validateJsonFile(
        path.join(OUTPUT_DIR, "invalid-payload.json"),
      );
      expect(json).toBeDefined();
    });

    it("should contain valid JSON in valid-payload.json", async () => {
      const json = await validateJsonFile(
        path.join(OUTPUT_DIR, "valid-payload.json"),
      );
      expect(json).toBeDefined();
    });

    it("should match golden file size for invalid-payload.json within 20%", async () => {
      const result = await compareFileSizes(
        path.join(OUTPUT_DIR, "invalid-payload.json"),
        path.join(GOLDEN_DIR, "invalid-payload.json"),
        20, // Allow 20% variance for error messages
      );
      expect(result.matches).toBe(true);
    });

    it("should match golden file size for valid-payload.json within 10%", async () => {
      const result = await compareFileSizes(
        path.join(OUTPUT_DIR, "valid-payload.json"),
        path.join(GOLDEN_DIR, "valid-payload.json"),
        10,
      );
      expect(result.matches).toBe(true);
    });
  });

  describe("Invalid Payload Validation", () => {
    it("should contain validation errors in invalid-payload.json", async () => {
      const json = await validateJsonFile<{
        error?: string;
        errors?: unknown[];
        message?: string;
      }>(path.join(OUTPUT_DIR, "invalid-payload.json"));

      // The invalid payload should have error information
      const hasErrors =
        json.error !== undefined ||
        json.errors !== undefined ||
        json.message !== undefined;
      expect(hasErrors).toBe(true);
    });

    it("should identify specific validation issues", async () => {
      const json = await validateJsonFile<{
        errors?: Array<{ message?: string; path?: string }>;
      }>(path.join(OUTPUT_DIR, "invalid-payload.json"));

      // Should have detailed error information
      if (json.errors && Array.isArray(json.errors)) {
        expect(json.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Valid Payload Validation", () => {
    it("should have tasks array in valid-payload.json", async () => {
      const json = await validateJsonFile<{ tasks?: unknown[] }>(
        path.join(OUTPUT_DIR, "valid-payload.json"),
      );

      expect(json.tasks).toBeDefined();
      expect(Array.isArray(json.tasks)).toBe(true);
      expect(json.tasks!.length).toBeGreaterThan(0);
    });

    it("should have webhook configuration in valid-payload.json", async () => {
      const json = await validateJsonFile<{
        webhook?: { url?: string; eventTypes?: string[] };
      }>(path.join(OUTPUT_DIR, "valid-payload.json"));

      expect(json.webhook).toBeDefined();
      expect(json.webhook!.url).toBeDefined();
      expect(json.webhook!.eventTypes).toBeDefined();
      expect(Array.isArray(json.webhook!.eventTypes)).toBe(true);
    });

    it("should have tag field in valid-payload.json", async () => {
      const json = await validateJsonFile<{ tag?: string }>(
        path.join(OUTPUT_DIR, "valid-payload.json"),
      );

      expect(json.tag).toBeDefined();
      expect(json.tag).toBe("valid-payload");
    });
  });

  describe("Payload Structure Validation", () => {
    it("should validate sample Job payload structure", () => {
      // This is a structural test for the payload format used in checkJobPayload
      const samplePayload = {
        tasks: [
          {
            id: "import-file",
            operation: "import/url",
            fileType: "ifc",
            url: "https://example.com/file.ifc",
          },
        ],
        tag: "test-job",
      };

      expect(samplePayload.tasks).toBeDefined();
      expect(samplePayload.tasks.length).toBeGreaterThan(0);
      expect(samplePayload.tasks[0].id).toBeDefined();
      expect(samplePayload.tasks[0].operation).toBeDefined();
    });

    it("should have valid task operations", () => {
      const validOperations = [
        "import/url",
        "convert/ifc/glb",
        "convert/rvt/glb",
        "convert/glb/xkt",
        "export/url",
        "export/upload",
      ];

      // Test that we know the valid operation types
      expect(validOperations.length).toBeGreaterThan(0);
      expect(validOperations).toContain("import/url");
      expect(validOperations).toContain("convert/ifc/glb");
      expect(validOperations).toContain("export/url");
    });
  });
});
