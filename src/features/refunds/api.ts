import { environment } from "@/config/environment";
import { refundsHttpApi } from "./http-api";
import { refundsMockApi } from "./mock-api";

export const refundsApi =
  environment.backendMode === "mock" ? refundsMockApi : refundsHttpApi;

export * from "./types";
