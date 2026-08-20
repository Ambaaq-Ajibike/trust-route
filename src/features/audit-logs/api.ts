import { environment } from "@/config/environment";
import { auditLogsHttpApi } from "./http-api";
import { auditLogsMockApi } from "./mock-api";

export const auditLogsApi =
  environment.backendMode === "mock" ? auditLogsMockApi : auditLogsHttpApi;

export * from "./types";
