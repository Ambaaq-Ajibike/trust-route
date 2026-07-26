import { environment } from "@/config/environment";
import { httpIssuesApi } from "./http-api";
import { mockIssuesApi } from "./mock-api";

export const issuesApi =
  environment.backendMode === "mock" ? mockIssuesApi : httpIssuesApi;
