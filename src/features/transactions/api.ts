import { environment } from "@/config/environment";
import { transactionsHttpApi } from "./http-api";
import { transactionsMockApi } from "./mock-api";

export const transactionsApi =
  environment.backendMode === "mock" ? transactionsMockApi : transactionsHttpApi;

export * from "./types";
