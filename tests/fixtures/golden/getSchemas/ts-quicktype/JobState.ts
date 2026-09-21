/* eslint-disable */
// 2026-09-21T06:40:59.989Z

// This file was automatically generated from XEOKIT-DATA-ENGINE JSONSchema by quicktype

// DO NOT MODIFY IT BY HAND. Instead, regenerate it if JSONSchema changed

export interface JobState {
    createdAt:        string;
    endedAt:          null | string;
    failedTaskId?:    string;
    id:               string;
    owner:            Owner;
    startedAt:        null | string;
    success:          boolean;
    tag?:             string;
    tasks:            Task[];
    tasksWithContext: TasksWithContext[];
    webhook?:         Webhook;
}

export interface Owner {
    accessPolicies: AccessPolicy[];
    id:             string;
}

export interface AccessPolicy {
    operation:  AccessPolicyOperation;
    properties: Property[];
}

export enum AccessPolicyOperation {
    ConvertGlbXkt = "convert/glb/xkt",
    ConvertIfcGlb = "convert/ifc/glb",
    ConvertMetadataCSV = "convert/metadata/csv",
    ConvertRfaGlb = "convert/rfa/glb",
    ConvertRvtGlb = "convert/rvt/glb",
    ConvertStepGlb = "convert/step/glb",
    Empty = "*",
    ExportURL = "export/url",
    ExportUpload = "export/upload",
    ImportURL = "import/url",
}

export enum Property {
    ConvertIfcGlbLicense = "convert/ifc/glb/license",
    ConvertRvtGlbLicense = "convert/rvt/glb/license",
    ConvertStepGlbLicense = "convert/step/glb/license",
}

export interface Task {
    engine?:               TaskEngine;
    id:                    string;
    input?:                string;
    operation:             TaskOperation;
    settings?:             TaskSettings;
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
    XeoIFCv2 = "xeoIFCv2",
    XeoIfc = "xeoIfc",
    XeoRvt = "xeoRvt",
    XeoStep = "xeoStep",
    XeokitConvert = "xeokit-convert",
}

export interface PurpleOptions {
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

export enum TaskOperation {
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

export interface TaskSettings {
    filters?:  null | PurpleFilters;
    grouping?: null | PurpleGrouping;
    version?:  number;
    [property: string]: any;
}

export interface PurpleFilters {
    conditions:      PurpleCondition[];
    ifcTypeFilters?: string[];
    logicOperators:  LogicOperator[];
    version?:        number;
    [property: string]: any;
}

export interface PurpleCondition {
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

export interface PurpleGrouping {
    criteria: PurpleCriterion[];
    version?: number;
    [property: string]: any;
}

export interface PurpleCriterion {
    id:       string;
    property: string;
    [property: string]: any;
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
    operation:             TaskOperation;
    fileType?:             FileType;
    headers?:              { [key: string]: string };
    url?:                  string;
    settings?:             TasksWithContextSettings;
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
    configJson?:      { [key: string]: any };
    maxFileSizeInMB?: number;
    includeMetadata?: boolean;
}

export interface TasksWithContextSettings {
    filters?:  null | FluffyFilters;
    grouping?: null | FluffyGrouping;
    version?:  number;
    [property: string]: any;
}

export interface FluffyFilters {
    conditions:      FluffyCondition[];
    ifcTypeFilters?: string[];
    logicOperators:  LogicOperator[];
    version?:        number;
    [property: string]: any;
}

export interface FluffyCondition {
    id:       string;
    operator: Operator;
    property: string;
    value:    string;
    [property: string]: any;
}

export interface FluffyGrouping {
    criteria: FluffyCriterion[];
    version?: number;
    [property: string]: any;
}

export interface FluffyCriterion {
    id:       string;
    property: string;
    [property: string]: any;
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

export enum EventType {
    JobFailed = "job.failed",
    JobStarted = "job.started",
    JobSucceeded = "job.succeeded",
}
