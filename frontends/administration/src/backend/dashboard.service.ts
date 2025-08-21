import { apiFetch } from "@/backend/request.service";

import type { DashboardMetrics } from "@/interfaces/dashboard";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiFetch<DashboardMetrics>("/admin/dashboard/metrics", { method: "GET" });
}
