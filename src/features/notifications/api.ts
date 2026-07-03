import { environment } from "@/config/environment";
import { httpNotificationsApi } from "./http-api";
import { mockNotificationsApi } from "./mock-api";

export const notificationsApi =
  environment.backendMode === "mock" ? mockNotificationsApi : httpNotificationsApi;
