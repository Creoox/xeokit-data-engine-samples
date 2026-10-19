/* eslint-disable */
/**
 * 2026-10-19T10:57:18.516Z
 * This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed,
 */

export interface JobState {
  createdAt: string;
  endedAt: string | null;
  id: string;
  owner: {
    accessPolicies: {
      operation:
        | "*"
        | "convert/glb/xkt"
        | "convert/ifc/glb"
        | "convert/metadata/csv"
        | "convert/nwd/glb"
        | "convert/pointcloud/potree"
        | "convert/rfa/glb"
        | "convert/rvt/glb"
        | "convert/step/glb"
        | "export/upload"
        | "export/url"
        | "import/url";
      properties: (
        | "convert/ifc/glb/license"
        | "convert/nwd/glb/license"
        | "convert/rvt/glb/license"
        | "convert/step/glb/license"
      )[];
    }[];
    id: string;
  };
  startedAt: string | null;
  success: boolean;
  tasks: (
    | {
        engine:
          | {
              name: "xeoIFCv2";
              options?: {
                configJson?: {
                  [k: string]: unknown;
                };
              };
              /**
               * @deprecated
               * Deprecated. The server ignores this value. versions.env pins the engine version.
               */
              version?: string;
            }
          | {
              name: "xeoIfc";
              options?: {
                configJson?: {
                  [k: string]: unknown;
                };
                maxFileSizeInMB?: number;
              };
              /**
               * @deprecated
               * Deprecated. The server ignores this value. versions.env pins the engine version.
               */
              version?: string;
            };
        id: string;
        input: string;
        operation: "convert/ifc/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeoNwd";
          options?: {
            allowPartial?: boolean;
            origin?: string | "auto";
          };
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
        };
        id: string;
        input: string;
        operation: "convert/nwd/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeoPotree";
          version: "2.1.5";
          options?: {
            attributes?: string[];
            encoding?: "BROTLI" | "UNCOMPRESSED";
            method?: "poisson" | "poisson_average" | "random";
            projection?: string;
          };
        };
        id: string;
        input: string;
        operation: "convert/pointcloud/potree";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeoRvt";
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
        };
        id: string;
        input: string;
        operation: "convert/rfa/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeoRvt";
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
        };
        id: string;
        input: string;
        operation: "convert/rvt/glb";
        [k: string]: unknown;
      }
    | {
        engine: {
          name: "xeoStep";
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
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
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
        };
        id: string;
        input: string;
        operation: "convert/glb/xkt";
        [k: string]: unknown;
      }
    | {
        id: string;
        input: string;
        operation: "convert/metadata/csv";
        settings?: {
          filters?: {
            conditions: {
              id: string;
              operator:
                | "after"
                | "before"
                | "contains"
                | "equals"
                | "greaterOrEqual"
                | "greaterThan"
                | "isEmpty"
                | "isFalse"
                | "isNotEmpty"
                | "isTrue"
                | "lessOrEqual"
                | "lessThan"
                | "notContains"
                | "notEquals";
              property: string;
              value: string;
              [k: string]: unknown;
            }[];
            logicOperators: ("AND" | "OR")[];
            ifcTypeFilters?: string[];
            version?: number;
            [k: string]: unknown;
          } | null;
          grouping?: {
            criteria: {
              id: string;
              property: string;
              [k: string]: unknown;
            }[];
            version?: number;
            [k: string]: unknown;
          } | null;
          version?: number;
          [k: string]: unknown;
        };
        [k: string]: unknown;
      }
    | {
        fileType:
          | "archive"
          | "csv"
          | "glb"
          | "ifc"
          | "las"
          | "laz"
          | "nwc"
          | "nwd"
          | "potree-hierarchy"
          | "potree-metadata"
          | "potree-octree"
          | "rfa"
          | "rvt"
          | "step"
          | "unknown"
          | "xeokit-manifest"
          | "xeokit-metadata"
          | "xkt"
          | "xlsx";
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
            | "csv"
            | "glb"
            | "ifc"
            | "las"
            | "laz"
            | "nwc"
            | "nwd"
            | "potree-hierarchy"
            | "potree-metadata"
            | "potree-octree"
            | "rfa"
            | "rvt"
            | "step"
            | "unknown"
            | "xeokit-manifest"
            | "xeokit-metadata"
            | "xkt"
            | "xlsx";
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine:
          | {
              name: "xeoIFCv2";
              options?: {
                configJson?: {
                  [k: string]: unknown;
                };
              };
              /**
               * @deprecated
               * Deprecated. The server ignores this value. versions.env pins the engine version.
               */
              version?: string;
            }
          | {
              name: "xeoIfc";
              options?: {
                configJson?: {
                  [k: string]: unknown;
                };
                maxFileSizeInMB?: number;
              };
              /**
               * @deprecated
               * Deprecated. The server ignores this value. versions.env pins the engine version.
               */
              version?: string;
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoNwd";
          options?: {
            allowPartial?: boolean;
            origin?: string | "auto";
          };
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
        };
        id: string;
        input: string;
        operation: "convert/nwd/glb";
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoPotree";
          version: "2.1.5";
          options?: {
            attributes?: string[];
            encoding?: "BROTLI" | "UNCOMPRESSED";
            method?: "poisson" | "poisson_average" | "random";
            projection?: string;
          };
        };
        id: string;
        input: string;
        operation: "convert/pointcloud/potree";
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoRvt";
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
        };
        id: string;
        input: string;
        operation: "convert/rfa/glb";
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoRvt";
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        engine: {
          name: "xeoStep";
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
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
          /**
           * @deprecated
           * Deprecated. The server ignores this value. versions.env pins the engine version.
           */
          version?: string;
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        fileType:
          | "archive"
          | "csv"
          | "glb"
          | "ifc"
          | "las"
          | "laz"
          | "nwc"
          | "nwd"
          | "potree-hierarchy"
          | "potree-metadata"
          | "potree-octree"
          | "rfa"
          | "rvt"
          | "step"
          | "unknown"
          | "xeokit-manifest"
          | "xeokit-metadata"
          | "xkt"
          | "xlsx";
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
            path: string;
            url?: string;
          }[];
          startedAt: string;
        };
        id: string;
        input: string;
        operation: "convert/metadata/csv";
        settings?: {
          filters?: {
            conditions: {
              id: string;
              operator:
                | "after"
                | "before"
                | "contains"
                | "equals"
                | "greaterOrEqual"
                | "greaterThan"
                | "isEmpty"
                | "isFalse"
                | "isNotEmpty"
                | "isTrue"
                | "lessOrEqual"
                | "lessThan"
                | "notContains"
                | "notEquals";
              property: string;
              value: string;
              [k: string]: unknown;
            }[];
            logicOperators: ("AND" | "OR")[];
            ifcTypeFilters?: string[];
            version?: number;
            [k: string]: unknown;
          } | null;
          grouping?: {
            criteria: {
              id: string;
              property: string;
              [k: string]: unknown;
            }[];
            version?: number;
            [k: string]: unknown;
          } | null;
          version?: number;
          [k: string]: unknown;
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
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
            | "csv"
            | "glb"
            | "ifc"
            | "las"
            | "laz"
            | "nwc"
            | "nwd"
            | "potree-hierarchy"
            | "potree-metadata"
            | "potree-octree"
            | "rfa"
            | "rvt"
            | "step"
            | "unknown"
            | "xeokit-manifest"
            | "xeokit-metadata"
            | "xkt"
            | "xlsx";
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
              | "csv"
              | "glb"
              | "ifc"
              | "las"
              | "laz"
              | "nwc"
              | "nwd"
              | "potree-hierarchy"
              | "potree-metadata"
              | "potree-octree"
              | "rfa"
              | "rvt"
              | "step"
              | "unknown"
              | "xeokit-manifest"
              | "xeokit-metadata"
              | "xkt"
              | "xlsx";
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
