/**
 * File Comparison Utilities
 *
 * Provides utilities for comparing generated artifacts against golden files.
 *
 * @author Creoox AG
 * @since 2026
 */

import fs from "fs/promises";
import { createHash } from "crypto";

/**
 * Result of a file comparison operation.
 */
export interface ComparisonResult {
  /** Whether the files match within tolerance */
  matches: boolean;
  /** Size of the actual file in bytes */
  actualSize: number;
  /** Size of the expected file in bytes */
  expectedSize: number;
  /** Percentage difference in size (0-100) */
  sizeDifferencePercent: number;
  /** Optional checksums if computed */
  actualChecksum?: string;
  expectedChecksum?: string;
  /** Human-readable message */
  message: string;
}

/**
 * Computes SHA256 hash of a file.
 *
 * @param filePath - Path to the file
 * @returns Hex-encoded hash string
 */
export async function computeFileChecksum(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Compares file sizes with tolerance.
 *
 * @param actualPath - Path to the generated file
 * @param expectedPath - Path to the golden reference file
 * @param tolerancePercent - Allowed percentage difference (default: 5%)
 * @returns Comparison result
 */
export async function compareFileSizes(
  actualPath: string,
  expectedPath: string,
  tolerancePercent: number = 5,
): Promise<ComparisonResult> {
  const [actualStats, expectedStats] = await Promise.all([
    fs.stat(actualPath),
    fs.stat(expectedPath),
  ]);

  const actualSize = actualStats.size;
  const expectedSize = expectedStats.size;

  const difference = Math.abs(actualSize - expectedSize);
  const sizeDifferencePercent = (difference / expectedSize) * 100;

  const matches = sizeDifferencePercent <= tolerancePercent;

  return {
    matches,
    actualSize,
    expectedSize,
    sizeDifferencePercent,
    message: matches
      ? `File sizes match within ${tolerancePercent}% tolerance (${actualSize} vs ${expectedSize} bytes, ${sizeDifferencePercent.toFixed(2)}% diff)`
      : `File sizes differ by ${sizeDifferencePercent.toFixed(2)}% (${actualSize} vs ${expectedSize} bytes), exceeds ${tolerancePercent}% tolerance`,
  };
}

/**
 * Compares two files by checksum (exact match).
 *
 * @param actualPath - Path to the generated file
 * @param expectedPath - Path to the golden reference file
 * @returns Comparison result
 */
export async function compareFileChecksums(
  actualPath: string,
  expectedPath: string,
): Promise<ComparisonResult> {
  const [actualChecksum, expectedChecksum, actualStats, expectedStats] =
    await Promise.all([
      computeFileChecksum(actualPath),
      computeFileChecksum(expectedPath),
      fs.stat(actualPath),
      fs.stat(expectedPath),
    ]);

  const matches = actualChecksum === expectedChecksum;

  const sizeDifferencePercent =
    expectedStats.size > 0
      ? (Math.abs(actualStats.size - expectedStats.size) / expectedStats.size) *
        100
      : 0;

  return {
    matches,
    actualSize: actualStats.size,
    expectedSize: expectedStats.size,
    sizeDifferencePercent,
    actualChecksum,
    expectedChecksum,
    message: matches
      ? `Files match exactly (SHA256: ${actualChecksum.substring(0, 16)}...)`
      : `Files differ (actual: ${actualChecksum.substring(0, 16)}..., expected: ${expectedChecksum.substring(0, 16)}...)`,
  };
}

/**
 * Compares two JSON files semantically (ignoring formatting).
 *
 * Excludes dynamic fields like timestamps and IDs from comparison.
 *
 * @param actualPath - Path to the generated JSON file
 * @param expectedPath - Path to the golden reference JSON file
 * @param excludeFields - Fields to exclude from comparison (e.g., 'id', 'created')
 * @returns Comparison result
 */
export async function compareJsonFiles(
  actualPath: string,
  expectedPath: string,
  excludeFields: string[] = ["id", "created", "createdAt", "started", "ended"],
): Promise<ComparisonResult> {
  const [actualContent, expectedContent, actualStats, expectedStats] =
    await Promise.all([
      fs.readFile(actualPath, "utf-8"),
      fs.readFile(expectedPath, "utf-8"),
      fs.stat(actualPath),
      fs.stat(expectedPath),
    ]);

  let actualJson: unknown;
  let expectedJson: unknown;

  try {
    actualJson = JSON.parse(actualContent);
    expectedJson = JSON.parse(expectedContent);
  } catch (error) {
    return {
      matches: false,
      actualSize: actualStats.size,
      expectedSize: expectedStats.size,
      sizeDifferencePercent: 0,
      message: `JSON parse error: ${(error as Error).message}`,
    };
  }

  // Remove excluded fields
  const actualCleaned = removeFields(actualJson, excludeFields);
  const expectedCleaned = removeFields(expectedJson, excludeFields);

  // Deep comparison
  const matches = deepEqual(actualCleaned, expectedCleaned);

  return {
    matches,
    actualSize: actualStats.size,
    expectedSize: expectedStats.size,
    sizeDifferencePercent:
      (Math.abs(actualStats.size - expectedStats.size) / expectedStats.size) *
      100,
    message: matches
      ? "JSON structures match (excluding dynamic fields)"
      : "JSON structures differ",
  };
}

/**
 * Removes specified fields from an object recursively.
 *
 * @param obj - Object to clean
 * @param fields - Field names to remove
 * @returns Cleaned object
 */
function removeFields(obj: unknown, fields: string[]): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeFields(item, fields));
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!fields.includes(key)) {
        result[key] = removeFields(value, fields);
      }
    }
    return result;
  }

  return obj;
}

/**
 * Deep equality comparison for objects.
 *
 * @param a - First object
 * @param b - Second object
 * @returns True if objects are deeply equal
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a as object).sort();
    const bKeys = Object.keys(b as object).sort();

    if (aKeys.length !== bKeys.length) return false;
    if (!aKeys.every((key, i) => key === bKeys[i])) return false;

    return aKeys.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  return false;
}

/**
 * Compares directory contents (file listing).
 *
 * @param actualDir - Path to the generated directory
 * @param expectedDir - Path to the golden reference directory
 * @returns Comparison result
 */
export async function compareDirectoryContents(
  actualDir: string,
  expectedDir: string,
): Promise<ComparisonResult> {
  const [actualFiles, expectedFiles] = await Promise.all([
    fs.readdir(actualDir),
    fs.readdir(expectedDir),
  ]);

  const actualSet = new Set(actualFiles.sort());
  const expectedSet = new Set(expectedFiles.sort());

  const missing = [...expectedSet].filter((f) => !actualSet.has(f));
  const extra = [...actualSet].filter((f) => !expectedSet.has(f));

  const matches = missing.length === 0 && extra.length === 0;

  let message = "Directory contents match";
  if (!matches) {
    const parts: string[] = [];
    if (missing.length > 0) {
      parts.push(`Missing files: ${missing.join(", ")}`);
    }
    if (extra.length > 0) {
      parts.push(`Extra files: ${extra.join(", ")}`);
    }
    message = parts.join("; ");
  }

  return {
    matches,
    actualSize: actualFiles.length,
    expectedSize: expectedFiles.length,
    sizeDifferencePercent: 0,
    message,
  };
}
