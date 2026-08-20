import { environment } from "@/config/environment";
import { usersHttpApi } from "./http-api";
import { usersMockApi } from "./mock-api";

export const usersApi =
  environment.backendMode === "mock" ? usersMockApi : usersHttpApi;

export * from "./types";
