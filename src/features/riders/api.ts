import { environment } from "@/config/environment";
import { httpRidersApi } from "./http-api";
import { mockRidersApi } from "./mock-api";

export const ridersApi =
  environment.backendMode === "mock" ? mockRidersApi : httpRidersApi;
