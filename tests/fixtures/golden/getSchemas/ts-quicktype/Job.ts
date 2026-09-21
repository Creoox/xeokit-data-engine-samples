/* eslint-disable */
// 2026-09-21T06:40:59.851Z

// This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by quicktype

// DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed

export interface Job {
    tag?:     string;
    tasks:    Task[];
    webhook?: Webhook;
}

export interface Task {
    engine?:               Engine;
    id:                    string;
    input?:                string;
    operation:             Operation;
    settings?:             Settings;
    fileType?:             FileType;
    headers?:              { [key: string]: string };
    url?:                  string;
    urlTargets?:           URLTarget[];
    archiveMultipleFiles?: boolean;
    [property: string]: any;
}

export interface Engine {
    name:     Name;
    options?: Options;
    version:  Version;
}

export enum Name {
    XeoIFCv2 = "xeoIFCv2",
    XeoIfc = "xeoIfc",
    XeoRvt = "xeoRvt",
    XeoStep = "xeoStep",
    XeokitConvert = "xeokit-convert",
}

export interface Options {
    configJson?:      { [key: string]: any };
    maxFileSizeInMB?: number;
    includeMetadata?: boolean;
}

export enum Version {
    The010 = "0.1.0",
    The020 = "0.2.0",
    The1010 = "1.0.10",
    The132 = "1.3.2",
    The51115 = "5.11.15",
    The5610 = "5.6.10",
    The5611 = "5.6.11",
}

/**
 * archive - Set of compressed into zip files
 *
 * csv - Metadata CSV package compressed into zip
 *
 * glb - Binary glTF file
 *
 * ifc - Industry Foundation Class
 *
 * rfa - Autodesk Revit Family File
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
 *
 * xlsx - Metadata spreadsheet file
 */
export enum FileType {
    Archive = "archive",
    CSV = "csv",
    Glb = "glb",
    Ifc = "ifc",
    Rfa = "rfa",
    Rvt = "rvt",
    Step = "step",
    Unknown = "unknown",
    XeokitManifest = "xeokit-manifest",
    XeokitMetadata = "xeokit-metadata",
    Xkt = "xkt",
    Xlsx = "xlsx",
}

export enum Operation {
    ConvertGlbXkt = "convert/glb/xkt",
    ConvertIfcGlb = "convert/ifc/glb",
    ConvertMetadataCSV = "convert/metadata/csv",
    ConvertRfaGlb = "convert/rfa/glb",
    ConvertRvtGlb = "convert/rvt/glb",
    ConvertStepGlb = "convert/step/glb",
    ExportURL = "export/url",
    ExportUpload = "export/upload",
    ImportURL = "import/url",
}

export interface Settings {
    filters?:  null | Filters;
    grouping?: null | Grouping;
    version?:  number;
    [property: string]: any;
}

export interface Filters {
    conditions:      Condition[];
    ifcTypeFilters?: string[];
    logicOperators:  LogicOperator[];
    version?:        number;
    [property: string]: any;
}

export interface Condition {
    id:       string;
    operator: Operator;
    property: string;
    value:    string;
    [property: string]: any;
}

export enum Operator {
    After = "after",
    Before = "before",
    Contains = "contains",
    Equals = "equals",
    GreaterOrEqual = "greaterOrEqual",
    GreaterThan = "greaterThan",
    IsEmpty = "isEmpty",
    IsFalse = "isFalse",
    IsNotEmpty = "isNotEmpty",
    IsTrue = "isTrue",
    LessOrEqual = "lessOrEqual",
    LessThan = "lessThan",
    NotContains = "notContains",
    NotEquals = "notEquals",
}

export enum LogicOperator {
    And = "AND",
    Or = "OR",
}

export interface Grouping {
    criteria: Criterion[];
    version?: number;
    [property: string]: any;
}

export interface Criterion {
    id:       string;
    property: string;
    [property: string]: any;
}

export interface URLTarget {
    fileType: FileType;
    url:      string;
    [property: string]: any;
}

export interface Webhook {
    eventTypes: EventType[];
    url:        string;
}

export enum EventType {
    JobFailed = "job.failed",
    JobStarted = "job.started",
    JobSucceeded = "job.succeeded",
}
