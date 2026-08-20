import { environment } from "@/config/environment";
import { adminHttpApi } from "./http-api";
import { mockAdminApi } from "./mock-api";

export const adminApi =
  environment.backendMode === "mock" ? mockAdminApi : adminHttpApi;

export * from "./types";
