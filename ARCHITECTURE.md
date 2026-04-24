# Xeokit Data Engine Server - Developer Guide

## Overview

The **Xeokit Data Engine Server** is a file processing API server designed to handle complex data transformation workflows for 3D building models. It provides a pipeline-based approach where you can chain multiple operations to import, convert, and export files in various formats commonly used in the AEC (Architecture, Engineering, and Construction) industry.

The server provides a flexible, job-based processing system where you define your entire workflow upfront.

## Core Concepts

### Jobs

A **Job** is the main unit of work in the system. It represents a complete processing pipeline defined as a set of interconnected tasks. When you submit a job, you're providing:

- A list of **tasks** to execute
- Dependencies between tasks (which task depends on another's output)
- Optional webhook configuration for receiving notifications
- Optional tags for organizing and identifying your jobs

Jobs are identified by a unique ID in the format `job_[32-character-hex]`.

### Tasks

**Tasks** are individual operations within a job. Each task has:

- A unique **ID** (user-defined within the job)
- An **operation** type (import, convert, or export)
- Operation-specific parameters
- Optional **input** reference to another task's output

Tasks form a directed acyclic graph (DAG) where outputs from one task can be inputs to subsequent tasks.

### Operations

The server supports three categories of operations:

#### 1. Import Operations

Import operations bring external data into the processing pipeline:

- **`import/url`**: Download a file from a URL
  - Supports custom HTTP headers for authentication
  - You specify the file type (IFC, RVT, GLB, etc.)

#### 2. Convert Operations

Convert operations transform files from one format to another:

- **`convert/ifc/glb`**: Convert IFC files to GLB format
- **`convert/rvt/glb`**: Convert Revit (RVT) files to GLB format
- **`convert/glb/xkt`**: Convert GLB files to XKT (xeokit native format)

Each conversion operation requires specifying an **engine** with its version and options. Different engines may have different capabilities and performance characteristics.

#### 3. Export Operations

Export operations send processed files to external destinations:

- **`export/upload`**: Upload files to specified URLs via HTTP PUT
  - Supports multiple target URLs with different file types
  - Optional custom headers for authentication
- **`export/url`**: Make files available via URL
  - Optional archive creation for multiple files

## Supported File Types

The server works with the following file types:

- **IFC** (Industry Foundation Classes) - open standard for BIM data
- **RVT** (Revit) - Autodesk Revit native format
- **GLB** (Binary glTF) - 3D model interchange format
- **XKT** - xeokit's optimized format for web visualization
- **ARCHIVE** (ZIP) - compressed archive of multiple files
- **XEOKIT-MANIFEST** - xeokit manifest files
- **XEOKIT-METADATA** - xeokit metadata files

## Authentication

The server uses HTTP Basic Authentication to protect API endpoints. All requests to `/api/jobs/*`, `/api/dev/*` endpoints must include valid credentials.

### Machine User Credentials

You'll receive machine user credentials consisting of:

- **Client ID**: Your unique identifier (format: `ca_[environment]_[suffix]`)
- **Client Secret**: Your password for authentication

### Making Authenticated Requests

Include your credentials in the `Authorization` header using Basic Authentication:

```
Authorization: Basic base64(clientId:clientSecret)
```

**Example using JavaScript (fetch):**

```javascript
const credentials = btoa("your-client-id:your-client-secret");

fetch("https://api.example.com/api/jobs/async", {
  method: "POST",
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(jobDefinition),
});
```

## Job Execution

Jobs are submitted for asynchronous background processing:

- Submit a job via `POST /api/jobs/async`
- The request returns immediately with a job ID
- Job is queued for background processing
- Poll the job status endpoint to monitor progress
- Receive notifications via webhooks (recommended)

> **Best Practice**: Event notifications via webhooks are preferred over polling. Frequent polling can hit rate limiting and impact system performance. Use webhooks for real-time updates and reserve polling for initial status checks.

This asynchronous model is ideal for long-running file conversions and ensures your client application remains responsive.

## Job Lifecycle

1. **Created**: Job is submitted and validated
2. **Started**: Job execution begins, tasks are processed in order
3. **Processing**: Tasks execute based on dependency graph
4. **Completed**: Job finishes successfully or with errors

### Job State

You can retrieve the current state of any job using:

```
GET /api/jobs/{jobId}
```

The response includes:

- Job configuration (tasks, webhook, tag)
- Execution timestamps (created, started, ended)
- Success status
- Detailed task execution results

**Important**: Jobs are associated with your client ID. You can only access jobs that you created.

## Webhooks and Events

You can configure webhooks to receive real-time notifications about job status changes.

### Supported Events

- **`job.started`**: Job execution has begun
- **`job.succeeded`**: Job completed successfully
- **`job.failed`**: Job encountered an error

### Webhook Configuration

Add a webhook to your job definition:

```json
{
  "tasks": [...],
  "webhook": {
    "url": "https://your-domain.com/webhook-endpoint",
    "eventTypes": ["job.succeeded", "job.failed"]
  }
}
```

The server will POST event data to your webhook URL when the specified events occur.

## Example: Complete Processing Pipeline

Here's a complete example that imports an IFC file, converts it through multiple formats, and uploads the results:

```json
{
  "tasks": [
    {
      "id": "import-ifc",
      "operation": "import/url",
      "url": "https://example.com/building.ifc",
      "fileType": "ifc"
    },
    {
      "id": "ifc-to-glb",
      "operation": "convert/ifc/glb",
      "engine": {
        "name": "cxconverter",
        "version": "5.6.10"
      },
      "input": "import-ifc"
    },
    {
      "id": "glb-to-xkt",
      "operation": "convert/glb/xkt",
      "engine": {
        "name": "xeokit-convert",
        "version": "1.3.1",
        "options": {
          "includeMetadata": true
        }
      },
      "input": "ifc-to-glb"
    },
    {
      "id": "upload-results",
      "operation": "export/upload",
      "urlTargets": [
        {
          "url": "https://your-storage.com/models/building.xkt",
          "fileType": "xkt"
        }
      ],
      "input": "glb-to-xkt"
    }
  ],
  "webhook": {
    "url": "https://your-domain.com/notifications",
    "eventTypes": ["job.succeeded", "job.failed"]
  },
  "tag": "BuildingConversion-2024"
}
```

## Data Persistence and Cleanup

### Temporary Storage

- The server stores intermediate files during job processing
- All task outputs are temporarily stored on the server
- Files are automatically cleaned up after a configurable retention period

### Job Retention

- Job state and result data are retained for a limited time
- After the retention period expires, jobs and associated files are automatically deleted
- Plan to retrieve or export your processed files before they expire
- The retention period is configured by the server administrator

### Best Practices

1. **Always export your results**: Use export operations to send processed files to your own storage
2. **Don't rely on server storage**: Treat the server as a stateless processing engine
3. **Poll completed jobs**: For async jobs, retrieve results shortly after completion
4. **Use webhooks**: Get real-time notifications instead of continuous polling

## Error Handling

### Job-Level Errors

If a job fails, the job state will indicate `"success": false`.

### Task-Level Errors

Individual tasks may fail while others succeed. Check the `tasksWithContext` array in the job state to see detailed results for each task.

### Common Error Scenarios

- **Import errors**: Source URL not accessible, authentication failures
- **Conversion errors**: Invalid input file, unsupported features, engine failures
- **Export errors**: Target URL not accessible, authentication failures
- **Validation errors**: Invalid job schema, missing required fields, circular dependencies

## Pipeline Design Best Practices

### 1. Task Dependencies

- Clearly define input dependencies using task IDs
- The system automatically determines execution order
- Circular dependencies are not allowed

### 2. Parallel Processing

- Tasks without dependencies can run in parallel
- The server optimizes execution based on the dependency graph

### 3. File Type Matching

- Ensure output file types match the next task's expected input
- The system validates compatibility between tasks

### 4. Engine Selection

- Different conversion engines may produce different results
- Test engines to find the best quality/performance balance
- Engine versions matter - newer isn't always better for your use case

## Rate Limiting and Quotas

Be aware of:

- Concurrent job limits per client
- Maximum job execution time
- File size limitations
- Storage quotas

Contact your administrator for specific limits applied to your account.

## Developer Utilities

The server provides developer endpoints to help you build and validate job definitions.

### Schema Generation

Retrieve schema definitions in different formats to help build type-safe integrations:

```
GET /api/dev/schema?name={schemaName}&type={format}
```

**Available schemas:**

- `Job` - Job definition schema
- `JobState` - Job state response schema
- `Event` - Webhook event schema

**Available formats:**

- `json` - JSON Schema format
- `ts` - TypeScript interface (json-schema-to-typescript)
- `ts-quicktype` - TypeScript interface (quicktype)

**Example:**

```javascript
// Get Job schema as TypeScript
fetch("https://api.example.com/api/dev/schema?name=Job&type=ts", {
  headers: {
    Authorization: `Basic ${credentials}`,
  },
});
```

### Payload Validation

Validate your job definition before submission to catch errors early:

```
POST /api/dev/schema/parse
```

Send your job definition in the request body. If valid, it returns the parsed job. If invalid, it returns validation errors.

**Example:**

```javascript
fetch("https://api.example.com/api/dev/schema/parse", {
  method: "POST",
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(yourJobDefinition),
});
```

This is useful for:

- Testing job definitions during development
- Validating complex pipelines before execution
- Debugging schema validation errors

## API Endpoints Summary

### Job Execution

| Method | Endpoint            | Description                           | Auth Required    |
| ------ | ------------------- | ------------------------------------- | ---------------- |
| POST   | `/api/jobs/async`   | Submit job for asynchronous execution | Yes (Basic Auth) |
| GET    | `/api/jobs/{jobId}` | Retrieve job state and results        | Yes (Basic Auth) |

### Developer Utilities

| Method | Endpoint                | Description                                | Auth Required    |
| ------ | ----------------------- | ------------------------------------------ | ---------------- |
| GET    | `/api/dev/schema`       | Get schema definition (JSON or TypeScript) | Yes (Basic Auth) |
| POST   | `/api/dev/schema/parse` | Validate job definition payload            | Yes (Basic Auth) |

## Getting Support

When reporting issues, include:

- Job ID
- Complete job definition (without sensitive credentials)
- Error messages from job state
- Timestamps and any relevant context

## Terminology Quick Reference

- **Job**: A complete processing workflow
- **Task**: An individual operation within a job
- **Operation**: The type of action a task performs (import/convert/export)
- **Engine**: The conversion tool/version used for convert operations
- **Pipeline**: The sequence of tasks in a job
- **DAG**: Directed Acyclic Graph - how tasks depend on each other
- **Job State**: The current status and results of a job
- **Machine User**: An API credential for programmatic access
- **Client ID**: Your unique identifier for authentication
