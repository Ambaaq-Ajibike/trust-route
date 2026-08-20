import { mockDelay } from "@/lib/mock-delay";
import type { AnalyticsOverview } from "./types";

export const analyticsMockApi = {
  async getOverview(): Promise<AnalyticsOverview> {
    await mockDelay(250);
    return {
      totalDeliveries: 1240,
      successfulDeliveries: 1180,
      cancelledDeliveries: 60,
      totalRevenue: 5400000,
      totalCommissions: 810000,
      activeRidersCount: 48,
      activeCustomersCount: 320,
    };
  },
};
