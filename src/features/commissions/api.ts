import { environment } from "@/config/environment";
import { commissionsHttpApi } from "./http-api";
import { commissionsMockApi } from "./mock-api";

export const commissionsApi =
  environment.backendMode === "mock" ? commissionsMockApi : commissionsHttpApi;

export * from "./types";
