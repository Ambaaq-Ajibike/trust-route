import { environment } from "@/config/environment";
import { analyticsHttpApi } from "./http-api";
import { analyticsMockApi } from "./mock-api";

export const analyticsApi =
  environment.backendMode === "mock" ? analyticsMockApi : analyticsHttpApi;

export * from "./types";
