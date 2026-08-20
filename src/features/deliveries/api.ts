import { environment } from "@/config/environment";
import { deliveriesHttpApi } from "./http-api";
import { deliveriesMockApi } from "./mock-api";

export const deliveriesApi =
  environment.backendMode === "mock" ? deliveriesMockApi : deliveriesHttpApi;

export * from "./types";
