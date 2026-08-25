"use client";
import dynamic from "next/dynamic";

const S = () => <div className="w-full min-h-[200px] rounded-[var(--radius-tool)] shimmer" />;

export const DynamicJsonFormatter = dynamic(() => import("./JsonFormatter"), { ssr: false, loading: S });
export const DynamicCsvToJson = dynamic(() => import("./CsvToJson"), { ssr: false, loading: S });
export const DynamicJsonToCsv = dynamic(() => import("./JsonToCsv"), { ssr: false, loading: S });
export const DynamicJsonToXml = dynamic(() => import("./JsonToXml"), { ssr: false, loading: S });
export const DynamicXmlToJson = dynamic(() => import("./XmlToJson"), { ssr: false, loading: S });
export const DynamicJsonToYaml = dynamic(() => import("./JsonToYaml"), { ssr: false, loading: S });
export const DynamicYamlToJson = dynamic(() => import("./YamlToJson"), { ssr: false, loading: S });
export const DynamicCsvToXml = dynamic(() => import("./CsvToXml"), { ssr: false, loading: S });
export const DynamicTsvToCsv = dynamic(() => import("./TsvToCsv"), { ssr: false, loading: S });
export const DynamicJsonToTypeScript = dynamic(() => import("./JsonToTypeScript"), { ssr: false, loading: S });
export const DynamicExcelToJson = dynamic(() => import("./ExcelToJson"), { ssr: false, loading: S });
export const DynamicJsonDiff = dynamic(() => import("./JsonDiff"), { ssr: false, loading: S });
export const DynamicJsonToTable = dynamic(() => import("./JsonToTable"), { ssr: false, loading: S });
export const DynamicJsonValidator = dynamic(() => import("./JsonValidator"), { ssr: false, loading: S });
