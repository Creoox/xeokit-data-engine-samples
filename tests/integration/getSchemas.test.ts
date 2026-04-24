/**
 * Integration Tests: Get Schemas
 *
 * Tests that verify getSchemas sample generates artifacts matching golden files.
 *
 * @author Creoox AG
 * @since 2026
 */

import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs/promises";
import {
  validateFileExists,
  validateFileSize,
  validateJsonFile,
  validateDirectoryExists,
} from "../utils/validators.js";
import {
  compareFileSizes,
  compareDirectoryContents,
} from "../utils/comparators.js";

const GOLDEN_DIR = path.join(process.cwd(), "tests/fixtures/golden/getSchemas");
const OUTPUT_DIR = path.join(process.cwd(), ".sample-outputs/getSchemas");

describe("getSchemas - Golden Artifact Tests", () => {
  describe("Output Directory Structure", () => {
    it("should have json directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "json"));
    });

    it("should have ts directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "ts"));
    });

    it("should have ts-quicktype directory", async () => {
      await validateDirectoryExists(path.join(OUTPUT_DIR, "ts-quicktype"));
    });
  });

  describe("JSON Schema Files", () => {
    const schemaNames = ["Job", "JobState", "Event"];

    for (const schemaName of schemaNames) {
      describe(`${schemaName}.json`, () => {
        const jsonPath = (dir: string) =>
          path.join(dir, `json/${schemaName}.json`);

        it(`should generate ${schemaName}.json`, async () => {
          await validateFileExists(jsonPath(OUTPUT_DIR));
        });

        it(`should contain valid JSON`, async () => {
          const json = await validateJsonFile(jsonPath(OUTPUT_DIR));
          expect(json).toBeDefined();
        });

        it(`should have minimum file size (> 100 bytes)`, async () => {
          await validateFileSize(jsonPath(OUTPUT_DIR), 100);
        });

        it(`should match golden file size within 10%`, async () => {
          const result = await compareFileSizes(
            jsonPath(OUTPUT_DIR),
            jsonPath(GOLDEN_DIR),
            10,
          );
          expect(result.matches).toBe(true);
        });

        it(`should be a valid JSON Schema with $schema property`, async () => {
          const json = await validateJsonFile<{ $schema?: string }>(
            jsonPath(OUTPUT_DIR),
          );
          expect(json.$schema).toBeDefined();
          expect(json.$schema).toContain("json-schema.org");
        });
      });
    }
  });

  describe("TypeScript Definition Files", () => {
    const schemaNames = ["Job", "JobState", "Event"];

    for (const schemaName of schemaNames) {
      describe(`${schemaName}.ts`, () => {
        const tsPath = (dir: string) => path.join(dir, `ts/${schemaName}.ts`);

        it(`should generate ${schemaName}.ts`, async () => {
          await validateFileExists(tsPath(OUTPUT_DIR));
        });

        it(`should have minimum file size (> 100 bytes)`, async () => {
          await validateFileSize(tsPath(OUTPUT_DIR), 100);
        });

        it(`should contain TypeScript export statement`, async () => {
          const content = await fs.readFile(tsPath(OUTPUT_DIR), "utf-8");
          expect(content).toContain("export");
        });

        it(`should match golden file size within 10%`, async () => {
          const result = await compareFileSizes(
            tsPath(OUTPUT_DIR),
            tsPath(GOLDEN_DIR),
            10,
          );
          expect(result.matches).toBe(true);
        });
      });
    }
  });

  describe("TypeScript Quicktype Files", () => {
    const schemaNames = ["Job", "JobState", "Event"];

    for (const schemaName of schemaNames) {
      describe(`${schemaName}.ts (quicktype)`, () => {
        const tsPath = (dir: string) =>
          path.join(dir, `ts-quicktype/${schemaName}.ts`);

        it(`should generate ${schemaName}.ts`, async () => {
          await validateFileExists(tsPath(OUTPUT_DIR));
        });

        it(`should have minimum file size (> 100 bytes)`, async () => {
          await validateFileSize(tsPath(OUTPUT_DIR), 100);
        });

        it(`should contain TypeScript export statement`, async () => {
          const content = await fs.readFile(tsPath(OUTPUT_DIR), "utf-8");
          expect(content).toContain("export");
        });

        it(`should match golden file size within 10%`, async () => {
          const result = await compareFileSizes(
            tsPath(OUTPUT_DIR),
            tsPath(GOLDEN_DIR),
            10,
          );
          expect(result.matches).toBe(true);
        });
      });
    }
  });

  describe("Directory Contents", () => {
    it("should have same files in json/ as golden", async () => {
      const result = await compareDirectoryContents(
        path.join(OUTPUT_DIR, "json"),
        path.join(GOLDEN_DIR, "json"),
      );
      expect(result.matches).toBe(true);
    });

    it("should have same files in ts/ as golden", async () => {
      const result = await compareDirectoryContents(
        path.join(OUTPUT_DIR, "ts"),
        path.join(GOLDEN_DIR, "ts"),
      );
      expect(result.matches).toBe(true);
    });

    it("should have same files in ts-quicktype/ as golden", async () => {
      const result = await compareDirectoryContents(
        path.join(OUTPUT_DIR, "ts-quicktype"),
        path.join(GOLDEN_DIR, "ts-quicktype"),
      );
      expect(result.matches).toBe(true);
    });
  });

  describe("Schema Content Validation", () => {
    it("should have Job schema with tasks property", async () => {
      const json = await validateJsonFile<{
        properties?: { tasks?: unknown };
      }>(path.join(OUTPUT_DIR, "json/Job.json"));
      expect(json.properties).toBeDefined();
      expect(json.properties?.tasks).toBeDefined();
    });

    it("should have JobState schema with id property", async () => {
      const json = await validateJsonFile<{
        properties?: { id?: unknown };
      }>(path.join(OUTPUT_DIR, "json/JobState.json"));
      expect(json.properties).toBeDefined();
      expect(json.properties?.id).toBeDefined();
    });

    it("should have Event schema with eventType property", async () => {
      const json = await validateJsonFile<{
        properties?: { eventType?: unknown };
      }>(path.join(OUTPUT_DIR, "json/Event.json"));
      expect(json.properties).toBeDefined();
      expect(json.properties?.eventType).toBeDefined();
    });
  });
});
