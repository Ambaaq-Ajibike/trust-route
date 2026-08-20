import { environment } from "@/config/environment";
import { payoutsHttpApi } from "./http-api";
import { payoutsMockApi } from "./mock-api";

export const payoutsApi =
  environment.backendMode === "mock" ? payoutsMockApi : payoutsHttpApi;

export * from "./types";
