/* eslint-disable */
/**
 * 2026-04-24T07:34:02.093Z
 * This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed,
 */

export interface Job {
  tasks: (
    | {
        engine: {
          name: "cxconverter";
          version: "5.6.10" | "5.6.11";
          options?: {
            maxFileSizeInMB?: number;
          };
        };
        id: string;
        input: string;
        operation: "convert/ifc/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "rvtconverter";
          version: "0.1.0";
        };
        id: string;
        input: string;
        operation: "convert/rvt/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeokit-convert";
          options: {
            includeMetadata: boolean;
          };
          version: "1.3.1";
        };
        id: string;
        input: string;
        operation: "convert/glb/xkt";
        [k: string]: unknown;
      }
    | {
        fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
        id: string;
        operation: "import/url";
        url: string;
        headers?: {
          [k: string]: string;
        };
      }
    | {
        id: string;
        input: string;
        operation: "export/upload";
        urlTargets: {
          fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
          url: string;
          [k: string]: unknown;
        }[];
        headers?: {
          [k: string]: string;
        };
      }
    | {
        id: string;
        input: string;
        operation: "export/url";
        archiveMultipleFiles?: boolean;
      }
  )[];
  tag?: string;
  webhook?: {
    /**
     * @minItems 1
     */
    eventTypes: ["job.failed" | "job.started" | "job.succeeded", ...("job.failed" | "job.started" | "job.succeeded")[]];
    url: string;
  };
}
