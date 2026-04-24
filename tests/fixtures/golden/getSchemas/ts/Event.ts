/* eslint-disable */
/**
 * 2026-04-24T07:34:01.709Z
 * This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed,
 */

export interface Event {
  createdAt: string;
  eventType: "job.failed" | "job.started" | "job.succeeded";
  id: string;
  jobState: JobState;
  [k: string]: unknown;
}
export interface JobState {
  createdAt: string;
  endedAt: string | null;
  id: string;
  ownerId: string;
  startedAt: string | null;
  success: boolean;
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
  tasksWithContext: (
    | {
        context: {
          endedAt: string;
          errors: {
            code: number;
            message: string;
          }[];
          files: {
            fileSize: number;
            fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
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
      }
    | {
        context: {
          endedAt: string;
          errors: {
            code: number;
            message: string;
          }[];
          files: {
            fileSize: number;
            fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "rvtconverter";
          version: "0.1.0";
        };
        id: string;
        input: string;
        operation: "convert/rvt/glb";
      }
    | {
        context: {
          endedAt: string;
          errors: {
            code: number;
            message: string;
          }[];
          files: {
            fileSize: number;
            fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
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
      }
    | {
        context: {
          endedAt: string;
          errors: {
            code: number;
            message: string;
          }[];
          files: {
            fileSize: number;
            fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
        id: string;
        operation: "import/url";
        url: string;
        headers?: {
          [k: string]: string;
        };
      }
    | {
        context: {
          endedAt: string;
          errors: {
            code: number;
            message: string;
          }[];
          files: {
            fileSize: number;
            fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
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
        context: {
          endedAt: string;
          errors: {
            code: number;
            message: string;
          }[];
          files: {
            fileSize: number;
            fileType: "archive" | "glb" | "ifc" | "rvt" | "unknown" | "xeokit-manifest" | "xeokit-metadata" | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        id: string;
        input: string;
        operation: "export/url";
        archiveMultipleFiles?: boolean;
      }
  )[];
  failedTaskId?: string;
  tag?: string;
  webhook?: {
    /**
     * @minItems 1
     */
    eventTypes: ["job.failed" | "job.started" | "job.succeeded", ...("job.failed" | "job.started" | "job.succeeded")[]];
    url: string;
  };
}
