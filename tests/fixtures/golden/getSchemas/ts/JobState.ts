/* eslint-disable */
/**
 * 2026-05-22T10:58:52.441Z
 * This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed,
 */

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
          name: "xeoIfc";
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
          name: "xeoRvt";
          version: "0.2.0";
        };
        id: string;
        input: string;
        operation: "convert/rvt/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeoStep";
          version: "0.1.0";
        };
        id: string;
        input: string;
        operation: "convert/step/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeokit-convert";
          options: {
            includeMetadata: boolean;
          };
          version: "1.3.2";
        };
        id: string;
        input: string;
        operation: "convert/glb/xkt";
        [k: string]: unknown;
      }
    | {
        fileType:
          | "archive"
          | "glb"
          | "ifc"
          | "rvt"
          | "step"
          | "unknown"
          | "xeokit-manifest"
          | "xeokit-metadata"
          | "xkt";
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
          fileType:
            | "archive"
            | "glb"
            | "ifc"
            | "rvt"
            | "step"
            | "unknown"
            | "xeokit-manifest"
            | "xeokit-metadata"
            | "xkt";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoIfc";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoRvt";
          version: "0.2.0";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoStep";
          version: "0.1.0";
        };
        id: string;
        input: string;
        operation: "convert/step/glb";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
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
          version: "1.3.2";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        fileType:
          | "archive"
          | "glb"
          | "ifc"
          | "rvt"
          | "step"
          | "unknown"
          | "xeokit-manifest"
          | "xeokit-metadata"
          | "xkt";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        id: string;
        input: string;
        operation: "export/upload";
        urlTargets: {
          fileType:
            | "archive"
            | "glb"
            | "ifc"
            | "rvt"
            | "step"
            | "unknown"
            | "xeokit-manifest"
            | "xeokit-metadata"
            | "xkt";
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
            fileType:
              | "archive"
              | "glb"
              | "ifc"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt";
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
