import { environment } from "@/config/environment";
import { httpAuthApi } from "./http-api";
import { mockAuthApi } from "./mock-api";

export const authApi =
  environment.backendMode === "mock" ? mockAuthApi : httpAuthApi;
