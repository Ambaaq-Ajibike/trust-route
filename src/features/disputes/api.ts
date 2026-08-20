import { environment } from "@/config/environment";
import { disputesHttpApi } from "./http-api";
import { disputesMockApi } from "./mock-api";

export const disputesApi =
  environment.backendMode === "mock" ? disputesMockApi : disputesHttpApi;

export * from "./types";
