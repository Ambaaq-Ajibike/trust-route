import { encryptedApiRequest } from "@/lib/api-client";
import type { AnalyticsOverview } from "./types";

export * from "./types";

export const analyticsHttpApi = {
  async getOverview(from?: string, to?: string): Promise<AnalyticsOverview> {
    const raw = await encryptedApiRequest<Record<string, unknown>>("/Analytics/Overview", {
      From: from,
      To: to,
    });
    return {
      totalDeliveries: Number(raw.totalDeliveries ?? raw.deliveries ?? 0),
      successfulDeliveries: Number(raw.successfulDeliveries ?? raw.completedDeliveries ?? 0),
      cancelledDeliveries: Number(raw.cancelledDeliveries ?? 0),
      totalRevenue: Number(raw.totalRevenue ?? raw.revenue ?? 0),
      totalCommissions: Number(raw.totalCommissions ?? raw.commissions ?? 0),
      activeRidersCount: Number(raw.activeRidersCount ?? raw.activeRiders ?? 0),
      activeCustomersCount: Number(raw.activeCustomersCount ?? raw.activeCustomers ?? 0),
    };
  },
};
