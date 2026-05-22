/* eslint-disable */
// 2026-05-22T10:58:52.553Z

// This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by quicktype

// DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed

export interface Event {
    createdAt: string;
    eventType: EventType;
    id:        string;
    jobState:  JobState;
    [property: string]: any;
}

export enum EventType {
    JobFailed = "job.failed",
    JobStarted = "job.started",
    JobSucceeded = "job.succeeded",
}

export interface JobState {
    createdAt:        string;
    endedAt:          null | string;
    failedTaskId?:    string;
    id:               string;
    ownerId:          string;
    startedAt:        null | string;
    success:          boolean;
    tag?:             string;
    tasks:            Task[];
    tasksWithContext: TasksWithContext[];
    webhook?:         Webhook;
}

export interface Task {
    engine?:               TaskEngine;
    id:                    string;
    input?:                string;
    operation:             Operation;
    fileType?:             FileType;
    headers?:              { [key: string]: string };
    url?:                  string;
    urlTargets?:           TaskURLTarget[];
    archiveMultipleFiles?: boolean;
    [property: string]: any;
}

export interface TaskEngine {
    name:     Name;
    options?: PurpleOptions;
    version:  Version;
}

export enum Name {
    XeoIfc = "xeoIfc",
    XeoRvt = "xeoRvt",
    XeoStep = "xeoStep",
    XeokitConvert = "xeokit-convert",
}

export interface PurpleOptions {
    maxFileSizeInMB?: number;
    includeMetadata?: boolean;
}

export enum Version {
    The010 = "0.1.0",
    The020 = "0.2.0",
    The132 = "1.3.2",
    The5610 = "5.6.10",
    The5611 = "5.6.11",
}

/**
 * archive - Set of compressed into zip files
 *
 * glb - Binary glTF file
 *
 * ifc - Industry Foundation Class
 *
 * rvt - Autodesk Revit File
 *
 * step - STEP File
 *
 * unknown - Unknown or unsupported file type
 *
 * xeokit-manifest - xeokit manifest file
 *
 * xeokit-metadata - xeokit metadata file
 *
 * xkt - xeokit native file
 */
export enum FileType {
    Archive = "archive",
    Glb = "glb",
    Ifc = "ifc",
    Rvt = "rvt",
    Step = "step",
    Unknown = "unknown",
    XeokitManifest = "xeokit-manifest",
    XeokitMetadata = "xeokit-metadata",
    Xkt = "xkt",
}

export enum Operation {
    ConvertGlbXkt = "convert/glb/xkt",
    ConvertIfcGlb = "convert/ifc/glb",
    ConvertRvtGlb = "convert/rvt/glb",
    ConvertStepGlb = "convert/step/glb",
    ExportURL = "export/url",
    ExportUpload = "export/upload",
    ImportURL = "import/url",
}

export interface TaskURLTarget {
    fileType: FileType;
    url:      string;
    [property: string]: any;
}

export interface TasksWithContext {
    context:               Context;
    engine?:               TasksWithContextEngine;
    id:                    string;
    input?:                string;
    operation:             Operation;
    fileType?:             FileType;
    headers?:              { [key: string]: string };
    url?:                  string;
    urlTargets?:           TasksWithContextURLTarget[];
    archiveMultipleFiles?: boolean;
}

export interface Context {
    endedAt:   string;
    errors:    Error[];
    files:     File[];
    startedAt: string;
}

export interface Error {
    code:    number;
    message: string;
}

export interface File {
    fileSize: number;
    fileType: FileType;
    path:     string;
    url?:     string;
}

export interface TasksWithContextEngine {
    name:     Name;
    options?: FluffyOptions;
    version:  Version;
}

export interface FluffyOptions {
    maxFileSizeInMB?: number;
    includeMetadata?: boolean;
}

export interface TasksWithContextURLTarget {
    fileType: FileType;
    url:      string;
    [property: string]: any;
}

export interface Webhook {
    eventTypes: EventType[];
    url:        string;
}
