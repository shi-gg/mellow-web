import type { ApiV1UsersMeBillingGetResponse } from "@/typings";

export const MAX_PREMIUM_GUILDS = 1;

export function isActive(status: ApiV1UsersMeBillingGetResponse["status"]): status is "active" | "trialing" | "past_due" {
    return status === "active" || status === "trialing" || status === "past_due";
}